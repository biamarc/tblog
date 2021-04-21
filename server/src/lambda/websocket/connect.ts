import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import 'source-map-support/register'
import {Connection} from "../../models/Connection";
import {create} from "../../services/ConnectionsService";
import {getUserId} from "../utils";
import {createLogger} from "../../utils/logger";


/**
 * Create a connection to web socket
 * @param event
 */
const logger = createLogger('connection')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('Websocket connect: %s', JSON.stringify(event))

    // extract userId from JWT Token
    const userId :string = getUserId(event)
    if (!userId){
        logger.error('Userid was not found on request')
        return {
            statusCode: 401,
            body: 'Logged user was not found'
        }

    }
    const item: Connection = {
        id: event.requestContext.connectionId,
        userId: userId,
        timestamp: new Date().toISOString()
    }

    console.log('Storing item: ', item)
    await create(item)

    return {
        statusCode: 200,
        body: ''
    }
}
