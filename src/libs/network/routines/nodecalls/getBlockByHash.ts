import Chain from "src/libs/blockchain/chain"

export default async function getBlockByHash(data: any) {
    let response = null
    let extra = ""

    if (!data.hash) {
                response = "error"
        extra = "Missing hash"
        return { response, extra }
    }
        response = await Chain.getBlockByHash(data.hash)
    // REVIEW Debug lines
    //    // response = JSON.stringify(response)
    //    return { response, extra }

}