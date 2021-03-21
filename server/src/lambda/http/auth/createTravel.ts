import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'

import {CreateTravelRequest} from '../../../requests/CreateTravelRequest'
import {getUserId, removeUserIdFromItem} from "../../utils";
import {createTravel} from "../../../services/TravelsService";
import {TravelItem, TravelResult} from "../../../models/TravelItem";
import {createLogger} from "../../../utils/logger";

const logger = createLogger('createTravel')
/**
 * Create a travel for authenticated user
 * @param event the request from API Gateway containing the data used to created new travel object
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Received event: %s', JSON.stringify(event))

  const newTravel: CreateTravelRequest = JSON.parse(event.body)
  logger.info('Create new travel: %s', JSON.stringify(newTravel))

  // extract userId from JWT Token
  const userId:string = getUserId(event)

  // create travelItem
  const travel: TravelItem = await createTravel(userId, newTravel)

  // remove userId
  const travelResult : TravelResult = removeUserIdFromItem(travel)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: travelResult
    })
  }
}
