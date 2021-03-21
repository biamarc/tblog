import {S3Event, SNSEvent, SNSHandler} from 'aws-lambda'
import {createLogger} from "../../utils/logger";
import {updateTravelImage} from "../../services/TravelsService";
import {getDownloadImageUrl} from "../../services/ImagesService";


const logger = createLogger('syncTravelWithImage')

/**
 * Process an event to Topic and update a TravelItem
 * @param event the SNS topic event
 */
export const handler: SNSHandler = async (event: SNSEvent) => {
    logger.info("Process SNS event: %s", JSON.stringify(event))
    for (const snsRecord of event.Records) {
        const s3EventStr = snsRecord.Sns.Message
        logger.info('Processing single S3 event %s', s3EventStr)
        const s3Event = JSON.parse(s3EventStr)
        await processS3Event(s3Event)
    }
}

async function processS3Event(event: S3Event) {
    for (const record of event.Records) {
        const todoId = record.s3.object.key
        logger.info('Processing S3 item with key: %s', todoId)
        try {
            await syncTodo(todoId)
        } catch (e) {
            logger.error('Error syncing S3Event: %s', JSON.stringify(event))
        }
    }
}

async function syncTodo(travelId: string) {
    const downloadUrl: string = await getDownloadImageUrl(travelId)
    await updateTravelImage(travelId, downloadUrl)
    logger.info(`Synchronize travelId=${travelId} with imageUrl=${downloadUrl}`)
}

