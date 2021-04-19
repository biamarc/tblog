import {TravelsRepo} from "../repos/TravelsRepo"
import {CreateTravelRequest} from "../requests/CreateTravelRequest";
import {TravelItem} from "../models/TravelItem";
import {genUUId} from "../utils/helper";
import {UpdateTravelRequest} from "../requests/UpdateTravelRequest";
import {TravelsPaged} from "../models/TravelsPaged";
import {Pagination} from "../utils/pagination";
import {PublishTravelRequest} from "../requests/PublishTravelRequest";

const repo: TravelsRepo = new TravelsRepo()


/**
 * Return all travels owned by the user
 * @param userId the user identifier
 * @param pagination the pagination object
 */
export async function getAllTravels(userId: string, pagination?: Pagination): Promise<TravelsPaged> {
    return repo.getTravelsOwnedByUser(userId, pagination)
}

/**
 * Return all published (public) travels
 * @param pagination the pagination object
 */
export async function getAllPublishedTravels(pagination?: Pagination): Promise<TravelsPaged> {
    return repo.getPublishedTravels(pagination)
}


/**
 * Create a Travel owned by the user
 * @param userId the user owned the travel
 * @param req the input parameters to create new travel
 * @return the travelItem created
 */
export async function createTravel(userId: string, req: CreateTravelRequest): Promise<TravelItem> {
    const obj: TravelItem = {
        userId: userId,
        travelId: genUUId(),
        name: req.name,
        description: req.description,
        startDate: req.startDate,
        endDate: req.endDate,
        published: req.published,
        createdAt: new Date().toISOString(),
        imageUrl: null
    }
    return repo.createTravel(obj)
}

/**
 * Return the travel if exists and if it's owned by the user
 * @param userId the user identifier
 * @param travelId the pk of the travel
 */
export async function getTravel(userId: string, travelId: string): Promise<TravelItem> {
    return repo.getTravel(userId, travelId)
}

/**
 * Update travel if it's owned by user
 * @param userId the user identifier
 * @param travelId the pk identify the travel
 * @param req the input parameter
 * @return the travel modified
 */
export async function updateTravel(userId: string, travelId: string, req: UpdateTravelRequest): Promise<TravelItem> {
    const obj: TravelItem = await getTravel(userId, travelId)
    if (!obj) {
        return null
    }
    obj.name = req.name
    obj.description = req.description
    obj.startDate = req.startDate
    obj.endDate = req.endDate
    obj.published = req.published

    return repo.updateTravel(obj)
}

/**
 * Publish or unpublish a travel if it's owned by user
 * @param userId the user identifier
 * @param travelId the pk identify the travel
 * @param req the input parameter
 * @return the travel modified
 */
export async function publishTravel(userId: string, travelId: string, req: PublishTravelRequest): Promise<TravelItem> {
    const obj: TravelItem = await getTravel(userId, travelId)
    if (!obj) {
        return null
    }
    obj.published = req.published
    return repo.updateTravel(obj)
}

/**
 * Delete a travel if exists and if it's owned by the user
 * @param userId the user identifier
 * @param travelId the pk of travel to delete
 */
export async function deleteTravel(userId: string, travelId: string): Promise<void> {
    const obj: TravelItem = await getTravel(userId, travelId)
    if (!obj) {
        return
    }
    await repo.deleteTravel(obj)
}

/**
 * Update only the imageUrl in the todoItem
 * @param travelId the pk of item
 * @param imageUrl the url of uploaded image
 */
export async function updateTravelImage(travelId: string, imageUrl: string): Promise<void> {
    const obj: TravelItem = await repo.getTravelById(travelId)
    if (obj !== null) {
        return repo.updateTravelImageUrl(obj, imageUrl)
    }
}
