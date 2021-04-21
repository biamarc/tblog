import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import 'source-map-support/register'
import {remove} from "../../services/ConnectionsService";

/**
 * Disconnect a web socket
 * @param event
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket disconnect', event)

    const connectionId = event.requestContext.connectionId
    await remove(connectionId)
    return {
        statusCode: 200,
        body: ''
    }
}
