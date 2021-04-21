import {ConnectionsRepo} from "../repos/ConnectionsRepo";
import {Connection} from "../models/Connection";

const repo: ConnectionsRepo = new ConnectionsRepo()

/**
 * Return all connections
 */
export async function getUserConnections(userId: string): Promise<Connection[]> {
    return await repo.getConnections(userId)
}

export async function remove(connectionId: string): Promise<void> {
    return await repo.delete(connectionId)
}


export async function create(connection: Connection): Promise<Connection> {
    return await repo.put(connection)
}
