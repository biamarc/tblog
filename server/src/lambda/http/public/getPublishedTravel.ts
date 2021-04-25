import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {removeUserIdFromItem} from "../../utils";
import {getTravelById} from "../../../services/TravelsService";
import {createLogger} from "../../../utils/logger";
import {TravelItem, TravelResult} from "../../../models/TravelItem";

const logger = createLogger('getPublishedTravel')

/**
 * Retrieve a single published travel
 * @param event the request
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Received event: %s', JSON.stringify(event))

    const travelId = event.pathParameters.travelId
    logger.info('Get travel: travelId=%s', travelId)

    const travel: TravelItem = await getTravelById(travelId)
    if (travel === null || !travel.published){
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: ''
        }
    }

    const travelResult: TravelResult = removeUserIdFromItem(travel)
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(travelResult)
    }

}
