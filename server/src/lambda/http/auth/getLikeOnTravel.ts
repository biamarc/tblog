import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {getUserId} from "../../utils";
import {createLogger} from "../../../utils/logger";
import {LikeItem} from "../../../models/LikeItem";
import {getLike} from "../../../services/LikesTravelsService";

const logger = createLogger('getLikeOnTravel')
/**
 * Retrieve like posted on a  travel
 * @param event the request from API Gateway containing the data used to remove the like
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Received event: %s', JSON.stringify(event))
    const travelId = event.pathParameters.travelId
    logger.info('Get like on travelId=%s', travelId)

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
    delete (likeItem.userId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(likeItem)
    }
}
