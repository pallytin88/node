import * as socket_client from "socket.io-client"

export default class Network {
    constructor() {}

    static async rpcConnect(
        rpc_url: string,
        socket: socket_client.Socket,
    ): Promise<socket_client.Socket> {
        try {
            socket = socket_client.connect(rpc_url)
            let timeout = 5000
            socket.on("connect", () => {
                                return socket
            })
            while (timeout > 0) {
                if (socket.connected) {
                    return socket
                }
                                await new Promise(resolve => setTimeout(resolve, 1000))
                timeout -= 1000
            }
            return null
        } catch (e) {
                        return null
        }
    }
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
