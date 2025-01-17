import { io, Socket } from "socket.io-client"

export async function createConnectedSocket(
    connectionString: string,
): Promise<Socket | null> {
    return new Promise((resolve, reject) => {
        const socket = io(connectionString)

        socket.on("connect", () => {
                        resolve(socket)
        })

        socket.on("connect_error", err => {
            console.error(
                `[SOCKET CONNECTOR] Connection error to ${connectionString}:`,
                err,
            )
            reject(null)
        })
    })
}
