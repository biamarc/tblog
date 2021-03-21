import {CustomAuthorizerEvent, CustomAuthorizerResult} from 'aws-lambda'
import 'source-map-support/register'

import {decode, JwtHeader, verify} from 'jsonwebtoken'
import {createLogger} from '../../utils/logger'
import {JwtPayload} from '../../auth/JwtPayload'
import {parseAuthHeader} from "../../auth/utils";
import {Jwt} from "../../auth/Jwt";

import * as jwksClient from 'jwks-rsa'

const client = jwksClient({
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 600000,
    jwksUri: 'https://devside.eu.auth0.com/.well-known/jwks.json'
});

async function getKey(header: JwtHeader) {
    const key = await client.getSigningKeyAsync(header.kid)
    return key.getPublicKey()
}

const logger = createLogger('auth')

/**
 * Custom Authorizer
 * @param event event for authorization
 */
export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    logger.info('Authorizing a user')
    try {
        const jwtToken = await verifyToken(event.authorizationToken)
        logger.info('User was authorized')

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }
    } catch (e) {
        logger.error('User not authorized', {error: e.message})
        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
    // extract token
    const token = parseAuthHeader(authHeader)
    // decode token
    const jwt: Jwt = decode(token, {complete: true}) as Jwt
    const certificate: string = await getKey(jwt.header)
    if (!certificate) {
        throw Error('Unable to get certificate')
    }
    // verify token
    verify(token, certificate, {algorithms: ['RS256']})

    return jwt.payload
}

