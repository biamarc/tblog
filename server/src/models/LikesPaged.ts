import {LikeItem} from "./LikeItem";

export interface LikesPaged {
    items: LikeItem[],
    nextKey: string
}
