import { RPCResponse } from "@kynesyslabs/demosdk/types"
import Chain from "src/libs/blockchain/chain"

export default async function getBlockByNumber(
    data: any,
): Promise<RPCResponse> {
    const blockNumber: number = data.blockNumber

    if (!blockNumber) {
                return {
            result: 400,
            response: "error",
            extra: "Block number not provided",
            require_reply: false,
        }
    } else {
                const block = await Chain.getBlockByNumber(data.blockNumber)

        if (block) {
            return {
                result: 200,
                response: block,
                require_reply: false,
                extra: "",
            }
        }

        return {
            result: 404,
            response: "error",
            extra: "Block not found",
            require_reply: false,
        }
    }
}
