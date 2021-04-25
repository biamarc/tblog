import {Pagination} from "../utils/pagination";
import {LikesTravelsRepo} from "../repos/LikesTravelsRepo";
import {LikesPaged} from "../models/LikesPaged";
import {PutLikeTravelRequest} from "../requests/PutLikeTravelRequest";
import {LikeItem} from "../models/LikeItem";

const repo: LikesTravelsRepo = new LikesTravelsRepo()


/**
 * Return all likes posted by the user
 * @param userId the user identifier
 * @param pagination the pagination object
 */
export async function getAllLikes(userId: string, pagination?: Pagination): Promise<LikesPaged> {
    return repo.getLikesOwnedByUser(userId, pagination)
}

/**
 * Create a like for the user
 * @param userId the user owned the travel
 * @param req the input parameters to create new like
 * @return the likeItem created
 */
export async function createLike(userId: string, travelId: string, req: PutLikeTravelRequest): Promise<LikeItem> {
    const obj: LikeItem = {
        userId: userId,
        travelId: travelId,
        like: req.like,
        createdAt: new Date().toISOString(),
    }
    return repo.createLike(obj)
}

/**
 * Return the like if exists and if it's owned by the user
 * @param userId the user identifier
 * @param travelId the pk of the travel
 */
export async function getLike(userId: string, travelId: string): Promise<LikeItem> {
    return repo.getLikesOnTravel(userId, travelId)
}

/**
 * Update like if it's owned by user
 * @param userId the user identifier
 * @param travelId the pk identify the travel
 * @param req the input parameter
 * @return the travel modified
 */
export async function updateLike(userId: string, travelId: string, req: PutLikeTravelRequest): Promise<LikeItem> {
    const obj: LikeItem = await getLike(userId, travelId)
    if (!obj) {
        return null
    }
    obj.like = req.like
    return repo.updateLike(obj)
}

/**
 * Delete a like if exists and if it's owned by the user
 * @param userId the user identifier
 * @param travelId the pk of travel to delete
 */
export async function deleteLike(userId: string, travelId: string): Promise<void> {
    const obj: LikeItem = await getLike(userId, travelId)
    if (!obj) {
        return
    }
    await repo.deleteLike(obj)
}
