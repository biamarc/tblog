export interface TravelItem extends TravelResult {
  userId: string
}

export interface TravelResult {
  travelId: string
  createdAt: string
  name: string
  description: string
  startDate: string
  endDate: string
  published: boolean
  imageUrl?: string
  like: number
  unlike: number
}

