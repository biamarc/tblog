import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'

import {UpdateTravelRequest} from '../../../requests/UpdateTravelRequest'
import {getUserId, removeUserIdFromItem} from "../../utils";
import {TravelItem, TravelResult} from "../../../models/TravelItem";
import {updateTravel} from "../../../services/TravelsService";
import {createLogger} from "../../../utils/logger";

const logger = createLogger('updateTodo')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Received event: %s', JSON.stringify(event))

    const travelId = event.pathParameters.travelId
    const updateTravelRequest: UpdateTravelRequest = JSON.parse(event.body)

    logger.info('Update travel: travelId=%s, req=%s', travelId,  JSON.stringify(updateTravelRequest))

    // extract userId from JWT Token
    const userId: string = getUserId(event)

    const travel: TravelItem = await updateTravel(userId, travelId, updateTravelRequest)
    if (travel === null) {
        logger.warn('Update travel failed; the travelId=%s may not exists or not owned by the current user=%s', travelId, userId)
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                message: `The travelId=${travelId} was not found`
            })
        }
    }
    // remove userId
    const travelResult : TravelResult = removeUserIdFromItem(travel)
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(travelResult)
    }
}
