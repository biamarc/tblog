import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import 'source-map-support/register'
import {Connection} from "../../models/Connection";
import {create} from "../../services/ConnectionsService";
import {createLogger} from "../../utils/logger";


/**
 * Create a connection to web socket
 * @param event
 */
const logger = createLogger('connection')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('Websocket connect: %s', JSON.stringify(event))
    const item: Connection = {
        id: event.requestContext.connectionId,
        userId: '_unknown_',
        timestamp: new Date().toISOString()
    }

    console.log('Storing item: ', item)
    await create(item)

    return {
        statusCode: 200,
        body: ''
    }
}
