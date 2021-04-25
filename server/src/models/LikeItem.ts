export interface LikeItem extends LikeResult {
  userId: string
}

export interface LikeResult {
  travelId: string
  createdAt: string
  like: boolean
}

