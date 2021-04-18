import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'

import {getUserId, removeUserIdFromItem} from "../../utils";
import {TravelItem, TravelResult} from "../../../models/TravelItem";
import {getTravel} from "../../../services/TravelsService";
import {createLogger} from "../../../utils/logger";

const logger = createLogger('getTravel')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Received event: %s', JSON.stringify(event))

    const travelId = event.pathParameters.travelId
    logger.info('Get travel: travelId=%s', travelId)

    // extract userId from JWT Token
    const userId: string = getUserId(event)

    const travel: TravelItem = await getTravel(userId, travelId)
    if (travel === null) {
        logger.warn('Request travelId=%s may not exists or not owned by the current user=%s', travelId, userId)
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                message: `The requested travel was not found`
            })
        }
    }
    const travelResults: TravelResult = removeUserIdFromItem(travel)
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body:  JSON.stringify(travelResults)
    }
}
