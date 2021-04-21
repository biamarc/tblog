import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {createDynamoDBClient} from "../utils/helper";
import {Connection} from "../models/Connection";
import {createLogger} from "../utils/logger";
import QueryInput = DocumentClient.QueryInput;
import QueryOutput = DocumentClient.QueryOutput;


/**
 * Implement storage of connection
 */
export class ConnectionsRepo {
    private logger = createLogger('connectionRepos')
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly connectionsTable = process.env.CONNECTIONS_TABLE,
        private readonly userIdIndex = process.env.CONNECTIONS_TABLE_USER_ID_INDEX
    ) {
    }

    /**
     * Return the active connections for a given userId
     */
    async getConnections(userId: String): Promise<Connection[]> {
        this.logger.info('Retrieve connections for userId %s', userId);
        const queryInput: QueryInput = {
            TableName: this.connectionsTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: "#key = :userIdValue",
            ExpressionAttributeNames: {
                "#key": "userId"
            },
            ExpressionAttributeValues: {
                ":userIdValue": userId
            },
            ScanIndexForward: false,
            Limit: 10
        };
        this.logger.info('Query params: %s', JSON.stringify(queryInput));
        const result: QueryOutput = await this.docClient.query(queryInput).promise();
        return  result.Items as Connection[]
    }

    /**
     * Save a connection
     * @param obj the connection to save
     */
    async put(obj: Connection): Promise<Connection> {
        this.logger.info('Create connection: %s', JSON.stringify(obj));
        await this.docClient.put({
            TableName: this.connectionsTable,
            Item: obj
        }).promise()

        return obj
    }

    /**
     * Remove a connection
     * @param connectionId the pk of connection
     */
    async delete(connectionId: string): Promise<void> {
        this.logger.info('Delete connection: %s', JSON.stringify(connectionId));
        await this.docClient.delete({
            TableName: this.connectionsTable,
            Key: {
                id: connectionId
            }
        }).promise()
    }
}
