import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {getUserId} from "../../utils";
import {TravelItem} from "../../../models/TravelItem";
import {getTravel} from "../../../services/TravelsService";
import {createLogger} from "../../../utils/logger";
import {getUploadSignedUrl} from "../../../services/ImagesService";

const logger = createLogger('uploadUrl')

/**
 * Create pre-signed url used to upload new travel image
 * @param event the request from API Gateway containing the data used to create pre-signed url
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Received event: %s', JSON.stringify(event))

    const travelId = event.pathParameters.travelId

    logger.info('Generate pre-seigned url for todo: %s', travelId)

    // extract userId from JWT Token
    const userId: string = getUserId(event)

    const travelItem: TravelItem = await getTravel(userId, travelId)
    if (travelItem === null) {
        logger.warn(`The user=${userId} try to generate pre-signed url for a not owned travelItem=${travelId}`)
        return {
            statusCode: 403,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                message: 'You must use only for owned travel'
            })
        }
    }

    const url: string = getUploadSignedUrl(travelItem.travelId)
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            uploadUrl: url
        })
    }
}
