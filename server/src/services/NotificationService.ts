import * as AWS from "aws-sdk";
import {Notification} from "../models/Notification";
import {Connection} from "../models/Connection";
const stage = process.env.STAGE
const apiId = process.env.API_ID
const awsRegion = process.env.DEPLOY_REGION

const connectionParams = {
    apiVersion: "2018-11-29",
    endpoint: `${apiId}.execute-api.${awsRegion}.amazonaws.com/${stage}`
}

const apiGateway = new AWS.ApiGatewayManagementApi(connectionParams)

/**
 * Send notification to a client
 * @param connection connection object
 * @param payload the notification to send
 */
export async function send(connection: Connection, payload: Notification) {
    if (connection.userId !== null) {
        await apiGateway.postToConnection({
            ConnectionId: connection.id,
            Data: JSON.stringify(payload),
        })
    }

}
