import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import 'source-map-support/register'
import {Connection} from "../../models/Connection";
import {getConnection, update} from "../../services/ConnectionsService";
import {createLogger} from "../../utils/logger";
import {verifyToken} from "../../auth/utils";
import {WebSocketBody} from "../../models/WebSocketBody";


/**
 * Register a logged user on a web-socket connection
 * @param event
 */
const logger = createLogger('reguser')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('Websocket reguser: %s', JSON.stringify(event))
    try {
        logger.info('Authorizing a user')
        const webSocketBody: WebSocketBody = JSON.parse(event.body)
        const jwtToken = await verifyToken('bearer ' + webSocketBody.token)
        logger.info('User was authorized')
        const userId: string = jwtToken.sub

        const item: Connection = await getConnection(event.requestContext.connectionId)
        if (item == null) {
            return {
                statusCode: 404,
                body: ''
            }
        }
        item.userId = userId
        await update(item)
        return {
            statusCode: 200,
            body: ''
        }
    } catch (e) {
        logger.error('User not authorized', {error: e.message})
        return {
            statusCode: 401,
            body: ''
        }
    }
}
