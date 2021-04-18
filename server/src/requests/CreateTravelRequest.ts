/**
 * Fields in a request to create a single Travel.
 */
export interface CreateTravelRequest {
  name: string
  description: string
  startDate: string
  endDate: string
  published: boolean
}
