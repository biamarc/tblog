import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {getUserId, removeUserIdFromItem} from "../../utils";
import {getTravelById, likeTravel} from "../../../services/TravelsService";
import {TravelItem, TravelResult} from "../../../models/TravelItem";
import {createLogger} from "../../../utils/logger";
import {LikeItem} from "../../../models/LikeItem";
import {deleteLike, getLike} from "../../../services/LikesTravelsService";

const logger = createLogger('deleteLikeOnTravel')
/**
 * Delete a like remove like/unlike on a travel
 * @param event the request from API Gateway containing the data used to remove the like
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Received event: %s', JSON.stringify(event))
    const travelId = event.pathParameters.travelId
    logger.info('Delete like on travelId=%s', travelId)

    // extract userId from JWT Token
    const userId: string = getUserId(event)
    const likeItem: LikeItem = await getLike(userId, travelId)
    if (likeItem === null) {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: ''
        }
    }
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
    let inc = {like: 0, unlike: 0}

    if (likeItem.like) {
        inc.like = -1
        inc.unlike = 0
    } else {
        inc.like = 0
        inc.unlike = -1
    }
    // delete like
    await deleteLike(userId, travelId)
    // update travel
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
