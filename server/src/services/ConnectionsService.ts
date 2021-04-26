import {ConnectionsRepo} from "../repos/ConnectionsRepo";
import {Connection} from "../models/Connection";

const repo: ConnectionsRepo = new ConnectionsRepo()

/**
 * Return all connections owned by the user to notify message
 */
export async function getUserConnections(userId: string): Promise<Connection[]> {
    return await repo.getConnections(userId)
}

/**
 * Remove the connection
 * @param connectionId
 */
export async function remove(connectionId: string): Promise<void> {
    return await repo.delete(connectionId)
}

/**
 * Create new connection
 * @param connection the Connection object to save
 */
export async function create(connection: Connection): Promise<Connection> {
    return await repo.put(connection)
}

/**
 * Retrieve the connection by it's primary key
 * @param connectionId the key of connection
 */
export async function getConnection(connectionId: string): Promise<Connection> {
    return await repo.getConnection(connectionId)
}

/**
 * Update the connection
 * @param connectionId
 */
export async function update(connection: Connection): Promise<Connection> {
    return await repo.update(connection)
}
