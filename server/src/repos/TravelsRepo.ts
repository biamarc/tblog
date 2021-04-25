import {encodeNextKey, Pagination} from "../utils/pagination";
import {createDynamoDBClient} from "../utils/helper";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {TravelItem} from "../models/TravelItem";
import {createLogger} from "../utils/logger";
import {TravelsPaged} from "../models/TravelsPaged";
import QueryInput = DocumentClient.QueryInput;
import QueryOutput = DocumentClient.QueryOutput;
import GetItemOutput = DocumentClient.GetItemOutput;

const MAX_ITEMS_PER_PAGE = 100;

export class TravelsRepo {
    private logger = createLogger('travelRepos')

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly travelTable = process.env.TRAVELS_TABLE,
        private readonly userIdIndex = process.env.TRAVELS_USER_ID_INDEX,
        private readonly travelIdIndex = process.env.TRAVELS_ID_INDEX,
        private readonly publishedTravelIndex = process.env.TRAVELS_PUBLISHED_ID_INDEX

) {
    }

    /**
     * Retrieve a todoItem owned bu the user
     * @param userId the pk of user
     * @param travelId the pk of the travel
     * @return the travel if exists or null in other case
     */
    async getTravel(userId: string, travelId: string): Promise<TravelItem> {
        const result: GetItemOutput = await this.docClient.get({
            TableName: this.travelTable,
            Key: {
                userId: userId,
                travelId: travelId
            }
        }).promise()
        return (!!result.Item) ? result.Item as TravelItem : null
    }

    /**
     * Return all the travel for a given user
     * @param userId the pk of the userId
     * @param pagination the object used to scan and paginate the result
     */
    async getTravelsOwnedByUser(userId: string, pagination?: Pagination): Promise<TravelsPaged> {
        const queryInput: QueryInput = {
            TableName: this.travelTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: "#key = :userIdValue",
            ExpressionAttributeNames: {
                "#key": "userId"
            },
            ExpressionAttributeValues: {
                ":userIdValue": userId
            },
            ScanIndexForward: false,
            Limit: pagination ? pagination.limit : MAX_ITEMS_PER_PAGE,
            ExclusiveStartKey: pagination ? pagination.nextKey : null,
        };
        this.logger.info('Query params: %s', JSON.stringify(queryInput));
        const result: QueryOutput = await this.docClient.query(queryInput).promise();
        return {
            items: result.Items as TravelItem[],
            nextKey: encodeNextKey(result.LastEvaluatedKey)
        }
    }

    /**
     * Return all the travel for a given user
     * @param pagination the object used to scan and paginate the result
     */
    async getPublishedTravels(pagination?: Pagination): Promise<TravelsPaged> {
        const queryInput: QueryInput = {
            TableName: this.travelTable,
            IndexName: this.publishedTravelIndex,
            KeyConditionExpression: "#key = :published",
            ExpressionAttributeNames: {
                "#key": "published"
            },
            ExpressionAttributeValues: {
                ":published": 1
            },
            ScanIndexForward: false,
            Limit: pagination ? pagination.limit : MAX_ITEMS_PER_PAGE,
            ExclusiveStartKey: pagination ? pagination.nextKey : null,
        };
        this.logger.info('Query params: %s', JSON.stringify(queryInput));
        const result: QueryOutput = await this.docClient.query(queryInput).promise();
        return {
            items: result.Items as TravelItem[],
            nextKey: encodeNextKey(result.LastEvaluatedKey)
        }
    }


    /**
     * Create a Travel in DynamoDb table
     * @param obj the travelItem to be persisted
     */
    async createTravel(obj: TravelItem): Promise<TravelItem> {
        this.logger.info('Create new travel: %s', JSON.stringify(obj));
        await this.docClient.put({
            TableName: this.travelTable,
            Item: obj
        }).promise()
        return obj
    }

    /**
     * Update a Travel in DynamoDb table
     * @param obj the travel to be updated
     * @return the updated object
     */
    async updateTravel(obj: TravelItem): Promise<TravelItem> {
        this.logger.info("Update travel: %s", JSON.stringify(obj))

        await this.docClient.update({
            TableName: this.travelTable,
            Key: {
                userId: obj.userId,
                travelId: obj.travelId
            },
            UpdateExpression: "set #name=:name, description=:description, startDate=:startDate, endDate=:endDate, published=:published",
            ExpressionAttributeNames: {
                "#name": 'name'
            },
            ExpressionAttributeValues: {
                ":name": obj.name,
                ":description": obj.description,
                ":startDate": obj.startDate,
                ":endDate": obj.endDate,
                ":published": obj.published
            },
        }).promise()

        return obj
    }

    /**
     * Delete a Travel in DynamoDb table
     * @param obj the travel to be deleted
     */
    async deleteTravel(obj: TravelItem): Promise<void> {
        this.logger.info("Delete travel: %s", JSON.stringify(obj))
        await this.docClient.delete({
            TableName: this.travelTable,
            Key: {
                userId: obj.userId,
                travelId: obj.travelId
            }
        }).promise()
    }

    /**
     * Update a Travel setting an imageUrl
     * @param travel the travel to update with image url
     * @param url the image url
     */
    async updateTravelImageUrl(travel: TravelItem, url: string): Promise<void> {
        await this.docClient.update({
            TableName: this.travelTable,
            Key: {
                userId: travel.userId,
                travelId: travel.travelId
            },
            UpdateExpression: "set imageUrl = :imageUrl",
            ExpressionAttributeValues: {
                ":imageUrl": url
            },
        }).promise()
    }

    /**
     * Return all the travels owned by the user
     * @param travelId the key of the travel
     */
    async getTravelById(travelId: string): Promise<TravelItem> {
        const queryInput: QueryInput = {
            TableName: this.travelTable,
            IndexName: this.travelIdIndex,
            KeyConditionExpression: "#key = :keyIdValue",
            ExpressionAttributeNames: {
                "#key": "travelId"
            },
            ExpressionAttributeValues: {
                ":keyIdValue": travelId
            },
            ScanIndexForward: true,
            Limit: 1
        };
        this.logger.info('Query to retrieve a single travel: %s', JSON.stringify(queryInput));
        const result: QueryOutput = await this.docClient.query(queryInput).promise();
        return result.Count == 1 ? result.Items[0] as TravelItem : null
    }


    /**
     * Update the like, or unlike on a travel
     * @param obj
     */
    async likeTravel(obj: TravelItem): Promise<TravelItem> {
        this.logger.info("Update travel: %s", JSON.stringify(obj))

        await this.docClient.update({
            TableName: this.travelTable,
            Key: {
                userId: obj.userId,
                travelId: obj.travelId
            },
            UpdateExpression: "set #like=:like, #unlike=:unlike",
            ExpressionAttributeNames: {
                "#like": 'like',
                "#unlike": 'unlike',
            },
            ExpressionAttributeValues: {
                ":like": obj.like,
                ":unlike": obj.unlike
            },
        }).promise()

        return obj
    }
}
