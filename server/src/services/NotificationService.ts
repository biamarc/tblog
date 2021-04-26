import * as AWS from "aws-sdk";
import {Notification} from "../models/Notification";
import {Connection} from "../models/Connection";
import {createLogger} from "../utils/logger";

const stage = process.env.STAGE
const apiId = process.env.API_ID
const awsRegion = process.env.DEPLOY_REGION

const connectionParams = {
    apiVersion: "2018-11-29",
    endpoint: `${apiId}.execute-api.${awsRegion}.amazonaws.com/${stage}`
}

const apiGateway = new AWS.ApiGatewayManagementApi(connectionParams)

const logger = createLogger('notificationService')
/**
 * Send notification to a client
 * @param connection connection object
 * @param payload the notification to send
 */
export async function send(connection: Connection, payload: Notification): Promise<void> {
    logger.info("Invoke send with connection=%s, payload=%s", JSON.stringify(connection), JSON.stringify(payload))
    if (connection.userId !== null) {
        logger.info("Send message to connection=%s", JSON.stringify(connection))
        await apiGateway.postToConnection({
            ConnectionId: connection.id,
            Data: JSON.stringify(payload),
        }).promise()
    }

}
