import {APIGatewayProxyEvent} from "aws-lambda";
import {Key} from "aws-sdk/clients/dynamodb";



/**
 * Data for pagination
 */
export interface Pagination {
    nextKey: Key;
    limit: number;
}


/**
 * Get value of the limit parameter.
 *
 * @param {Object} event HTTP event passed to a Lambda function
 *
 * @returns {number} parsed "limit" parameter
 */
function parseLimitParameter(event: APIGatewayProxyEvent): number {
    const limitStr: string = getQueryParameter(event, 'limit');
    if (!limitStr) {
        return undefined;
    }

    const limit: number = parseInt(limitStr, 10);
    if (limit <= 0) {
        throw new Error('Limit should be positive');
    }

    return limit;
}

/**
 * Get value of the limit parameter.
 *
 * @param {Object} event HTTP event passed to a Lambda function
 *
 * @returns {Object} parsed "nextKey" parameter
 */
function parseNextKeyParameter(event: APIGatewayProxyEvent): Key {
    const nextKeyStr: string = getQueryParameter(event, 'nextKey');
    if (!nextKeyStr) {
        return undefined;
    }

    const uriDecoded: string = decodeURIComponent(nextKeyStr);
    return JSON.parse(uriDecoded);
}

/**
 * Get a query parameter or return "undefined"
 *
 * @param {Object} event HTTP event passed to a Lambda function
 * @param {string} name a name of a query parameter to return
 *
 * @returns {string} a value of a query parameter value or "undefined" if a parameter is not defined
 */
function getQueryParameter(event: APIGatewayProxyEvent, name: string): string {
    const queryParams: any = event.queryStringParameters;
    if (!queryParams) {
        return undefined;
    }

    return queryParams[name];
}

/**
 * Encode last evaluated key using
 *
 * @param {Object} lastEvaluatedKey a JS object that represents last evaluated key
 *
 * @return {string} URI encoded last evaluated key
 */
export function encodeNextKey(lastEvaluatedKey: Key): string {
    if (!lastEvaluatedKey) {
        return null;
    }

    return encodeURIComponent(JSON.stringify(lastEvaluatedKey));
}

/**
 * Extract pagination data from the event
 * @param event
 */
export function evalPagination(event: APIGatewayProxyEvent): Pagination {
    let nextKey: Key;
    let limit: number;

    // Parse query parameters
    nextKey = parseNextKeyParameter(event);
    limit = parseLimitParameter(event) || 20;
    return {
        nextKey: nextKey,
        limit: limit
    }
}


