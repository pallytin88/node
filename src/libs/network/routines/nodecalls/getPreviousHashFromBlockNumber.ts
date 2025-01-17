import Chain from "src/libs/blockchain/chain"

export default async function getPreviousHashFromBlockNumber(data: any) {
    let response = null
    let extra = ""
        if (data.blockNumber === undefined || data.blockNumber < 0) {
        response = "error"
        extra = "Block number is not valid"
        return { response, extra }
    }
    response = await Chain.getBlockByNumber(data.blockNumber)
        response = response.content.previousHash
    return { response, extra }
}
