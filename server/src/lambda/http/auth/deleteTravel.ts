import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserId} from "../../utils";
import {deleteTravel, getTravel} from "../../../services/TravelsService";
import {createLogger} from "../../../utils/logger";
import {removeImage} from "../../../services/ImagesService";
import {TravelItem} from "../../../models/TravelItem";

const logger = createLogger('deleteTravel')

/**
 * Delete existing travel
 * @param event the request from API Gateway containing the data used to delete existing travel object
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Received event: %s', JSON.stringify(event))
  // travelId to delete
  const travelId = event.pathParameters.travelId
  logger.info('Delete travel: %s', travelId)

  // extract userId from JWT Token
  const userId:string = getUserId(event)

  // get todoItem
  const travelItem: TravelItem = await getTravel(userId, travelId)

  if (travelItem) {
    // delete object
    await deleteTravel(userId, travelId)

    if (travelItem.imageUrl) {
      // remove image associated to the todoItem if exists
      await removeImage(travelId)
    }
  }
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}
