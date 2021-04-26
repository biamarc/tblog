import {DynamoDBStreamEvent, DynamoDBStreamHandler} from 'aws-lambda'
import 'source-map-support/register'
import {getTravelById} from "../../services/TravelsService";
import {TravelItem} from "../../models/TravelItem";
import {createLogger} from "../../utils/logger";
import {getUserConnections} from "../../services/ConnectionsService";
import {Connection} from "../../models/Connection";
import {send} from "../../services/NotificationService";
import {Notification} from "../../models/Notification";

/**
 * Send notification where new like was posted
 * @param event
 */

const logger = createLogger('sendNotification')
export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    logger.info('Processing events batch from DynamoDB: %s', JSON.stringify(event))

    for (const record of event.Records) {
        logger.info('Processing record: %s', JSON.stringify(record))
        if (record.eventName !== 'INSERT') {
            logger.warn('Found not INSERT record: %s', record.eventName)
            continue
        }

        const newItem = record.dynamodb.NewImage
        const travelId = newItem.travelId.S
        logger.info('Processing notification for travelId = %s', travelId)
        if (travelId) {
            const travel: TravelItem = await getTravelById(travelId)
            if (!travel) {
                logger.warn('Travel not found with travelId = %s ', travelId)
                continue
            }
            const notification: Notification = {
                travelId: travelId
            }
            logger.info('Retrieve connections for user: %s', travel.userId)
            const connection: Connection[] = await getUserConnections(travel.userId)
            logger.info('Find connections.size(): %s', connection ? connection.length : null)
            for (const conn of connection) {
                logger.info('Send notification on connectionId = %s', JSON.stringify(conn))
                await send(conn, notification)
            }
        }
    }
}
