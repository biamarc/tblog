import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {getUserId, removeUserIdFromItems} from "../../utils";
import {getAllTravels} from "../../../services/TravelsService";
import {evalPagination, Pagination} from "../../../utils/pagination";
import {TravelsPaged} from "../../../models/TravelsPaged";
import {createLogger} from "../../../utils/logger";
import {TravelResult} from "../../../models/TravelItem";

const logger = createLogger('getTravels')

/**
 * Read all travels owned by a user
 * @param event the request
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Received event: %s', JSON.stringify(event))

    // extract userId from JWT Token
    const userId: string = getUserId(event)
    logger.info('Retrieve todos for userId: %s', userId)

    // extract pagination
    let pagination: Pagination
    try {
        pagination = evalPagination(event)
    } catch (e) {
        logger.error('Error extracting pagination parameters: %s', JSON.stringify(event));
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({error: 'Invalid pagination parameters'})
        }
    }
    const travelsPaged: TravelsPaged = await getAllTravels(userId, pagination)
    const travelResults: TravelResult[] = removeUserIdFromItems(travelsPaged.items)
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            items: travelResults,
            nextKey: travelsPaged.nextKey
        })
    }

}
