import {TravelItem} from "./TravelItem";

export interface TravelsPaged {
    items: TravelItem[],
    nextKey: string
}
