import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";
import {TravelItem, TravelResult} from "../models/TravelItem";

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

/**
 * Remove userId from array of TodoItem[]
 * @param travelItems the array of items
 */
export function removeUserIdFromItems(travelItems: TravelItem[]): TravelResult[] {
  for (const item of travelItems){
    removeUserIdFromItem(item)
  }
  return travelItems as TravelResult[]
}

/**
 * Remove userId from TodoItem
 * @param item
 */
export function removeUserIdFromItem(item: TravelItem): TravelResult {
  if (!item) return item
  delete(item.userId)
  return item as TravelResult
}
