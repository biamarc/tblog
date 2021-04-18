import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {getUserId} from "../../utils";
import {TravelItem} from "../../../models/TravelItem";
import {publishTravel} from "../../../services/TravelsService";
import {createLogger} from "../../../utils/logger";
import {PublishTravelRequest} from "../../../requests/PublishTravelRequest";

/**
 * Allow to publish or unpublish a travel owned by user
 */
const logger = createLogger('publishTravel')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Received event: %s', JSON.stringify(event))

    const travelId = event.pathParameters.travelId
    const publishTravelRequest: PublishTravelRequest = JSON.parse(event.body)

    logger.info('Publish travel: travelId=%s, req=%s', travelId,  JSON.stringify(publishTravelRequest))

    // extract userId from JWT Token
    const userId: string = getUserId(event)

    const travel: TravelItem = await publishTravel(userId, travelId, publishTravelRequest)
    if (travel === null) {
        logger.warn('Publish/Unpublish travel failed; the travelId=%s may not exists or not owned by the current user=%s', travelId, userId)
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                message: `The publish/unpublish your travel has failed`
            })
        }
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(travel)
    }
}
