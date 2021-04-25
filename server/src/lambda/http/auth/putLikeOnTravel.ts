import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {getUserId, removeUserIdFromItem} from "../../utils";
import {getTravelById, likeTravel} from "../../../services/TravelsService";
import {TravelItem, TravelResult} from "../../../models/TravelItem";
import {createLogger} from "../../../utils/logger";
import {PutLikeTravelRequest} from "../../../requests/PutLikeTravelRequest";
import {LikeItem} from "../../../models/LikeItem";
import {createLike, getLike, updateLike} from "../../../services/LikesTravelsService";

const logger = createLogger('putLikeOnTravel')
/**
 * Put a like on a travel
 * @param event the request from API Gateway containing the data used to created the like
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Received event: %s', JSON.stringify(event))

    const likeRequest: PutLikeTravelRequest = JSON.parse(event.body)
    const travelId = event.pathParameters.travelId
    logger.info('Put like on travelId=%s with value=%s', travelId, likeRequest)

    // extract userId from JWT Token
    const userId: string = getUserId(event)

    // extract travel and check if exists and it's published
    let travelItem: TravelItem = await getTravelById(travelId)
    if (travelItem===null || !travelItem.published){
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: ''
        }
    }

    const likeItem: LikeItem = await getLike(userId, travelId)
    let inc = {like: 0, unlike: 0}

    if (likeItem !== null && likeItem.like !== likeRequest.like) {
        if (likeRequest.like) {
            inc.like = +1
            inc.unlike = -1
        } else {
            inc.like = -1
            inc.unlike = +1
        }
        likeItem.like = likeRequest.like
        await updateLike(userId, travelId, likeRequest)
    } else if (likeItem !== null && likeItem.like === likeRequest.like) {
        inc.like = 0
        inc.unlike = 0
    } else {
        if (likeRequest.like) {
            inc.like = +1
            inc.unlike = 0
        } else {
            inc.like = 0
            inc.unlike = +1
        }
        await createLike(userId, travelId, likeRequest)
    }
    // update the like on the travel
    travelItem.like = (travelItem.like | 0) + inc.like
    travelItem.unlike = (travelItem.unlike | 0) + inc.unlike
    const updatedTravel:TravelItem = await likeTravel(travelItem)
    // remove userId
    const travelResult: TravelResult = removeUserIdFromItem(updatedTravel)
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(travelResult)
    }
}
