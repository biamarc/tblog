import {encodeNextKey, Pagination} from "../utils/pagination";
import {createDynamoDBClient} from "../utils/helper";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {createLogger} from "../utils/logger";
import {LikeItem} from "../models/LikeItem";
import {LikesPaged} from "../models/LikesPaged";
import QueryInput = DocumentClient.QueryInput;
import QueryOutput = DocumentClient.QueryOutput;
import GetItemOutput = DocumentClient.GetItemOutput;

const MAX_ITEMS_PER_PAGE = 100;

export class LikesTravelsRepo {
    private logger = createLogger('likesTravelsRepos')

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly likesTravelsTable = process.env.LIKES_TRAVELS_TABLE,
        private readonly userIdIndex = process.env.TRAVELS_USER_ID_INDEX
    ) {
    }

    /**
     * Retrieve a likes on a travel gived by the user
     * @param userId the pk of user
     * @param travelId the pk of the travel
     * @return the "like" if exists or null in other case
     */
    async getLikesOnTravel(userId: string, travelId: string): Promise<LikeItem> {
        const result: GetItemOutput = await this.docClient.get({
            TableName: this.likesTravelsTable,
            Key: {
                userId: userId,
                travelId: travelId
            }
        }).promise()
        return (!!result.Item) ? result.Item as LikeItem : null
    }

    /**
     * Return all the like inserted by the user
     * @param userId the pk of the userId
     * @param pagination the object used to scan and paginate the result
     */
    async getLikesOwnedByUser(userId: string, pagination?: Pagination): Promise<LikesPaged> {
        const queryInput: QueryInput = {
            TableName: this.likesTravelsTable,
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
            items: result.Items as LikeItem[],
            nextKey: encodeNextKey(result.LastEvaluatedKey)
        }
    }

    /**
     * Create a Like in DynamoDb table
     * @param obj the likeItem to be persisted
     */
    async createLike(obj: LikeItem): Promise<LikeItem> {
        this.logger.info('Create new like: %s', JSON.stringify(obj));
        await this.docClient.put({
            TableName: this.likesTravelsTable,
            Item: obj
        }).promise()
        return obj
    }

    /**
     * Update a Like in DynamoDb table
     * @param obj the like to be updated
     * @return the updated object
     */
    async updateLike(obj: LikeItem): Promise<LikeItem> {
        this.logger.info("Update like: %s", JSON.stringify(obj))

        await this.docClient.update({
            TableName: this.likesTravelsTable,
            Key: {
                userId: obj.userId,
                travelId: obj.travelId
            },
            UpdateExpression: "set #like=:like",
            ExpressionAttributeNames: {
                "#like": 'like'
            },
            ExpressionAttributeValues: {
                ":like": obj.like
            },
        }).promise()
        return obj
    }

    /**
     * Delete a Like in DynamoDb table
     * @param obj the like to be deleted
     */
    async deleteLike(obj: LikeItem): Promise<void> {
        this.logger.info("Delete like: %s", JSON.stringify(obj))
        await this.docClient.delete({
            TableName: this.likesTravelsTable,
            Key: {
                userId: obj.userId,
                travelId: obj.travelId
            }
        }).promise()
    }
}
