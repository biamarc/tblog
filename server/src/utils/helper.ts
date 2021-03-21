import {v4 as uuid} from 'uuid'
/**
 * Generate uuid version 4
 */
export function genUUId(): string {
    return uuid()
}

import {DocumentClient} from "aws-sdk/clients/dynamodb";
import * as AWSXRay from 'aws-xray-sdk'
import * as AWS from "aws-sdk";
const XAWS = AWSXRay.captureAWS(AWS)

export function createDynamoDBClient(): DocumentClient {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}
