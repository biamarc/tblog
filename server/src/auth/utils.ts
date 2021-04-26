import {decode, JwtHeader, verify} from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'
import * as jwksClient from "jwks-rsa";
import {Jwt} from "./Jwt";


/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

/**
 * Parse Authorization header and return the token Bearer
 * @param authHeader the content of Authorization header
 */
export function parseAuthHeader(authHeader: string): string{
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  return split[1]
}


const client = jwksClient({
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000,
  jwksUri: 'https://devside.eu.auth0.com/.well-known/jwks.json'
});

export async function getKey(header: JwtHeader) {
  const key = await client.getSigningKeyAsync(header.kid)
  return key.getPublicKey()
}

export async function verifyToken(authHeader: string): Promise<JwtPayload> {
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
