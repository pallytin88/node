import { RPCResponse } from "@kynesyslabs/demosdk/types"
import Cryptography from "src/libs/crypto/cryptography"
import { Peer } from "src/libs/peer"
import { getSharedState } from "src/utilities/sharedState"

export async function proofConsensus(hash: string): Promise<[string, string]> {
    let poc: [string, string] = [hash, null]
    // Obtain Paperinik (PK, Public Key) and Public hash
    const pk = getSharedState.identity.ed25519.privateKey
    const publicHex = getSharedState
        .identity.ed25519.publicKey.toString("hex")
    // Signing the hash

        
            
    const signature = Cryptography.sign(hash, pk)

        )

    const signatureHex = signature.toString("hex")
    // Adding the signature to the PoC
    poc[1] = signatureHex
    // Returning the PoC
    return poc
}

export async function proofConsensusHandler(hash: any): Promise<RPCResponse> {
    let response: RPCResponse = {
        result: 200,
        response: "",
        require_reply: true,
        extra: "",
    }
    //    // process.exit(0)
    // REVIEW Check if the content is valid - Or maybe not
        //    let pocFullResponse = await proofConsensus(hash)
    response.response = pocFullResponse[0]
    response.extra = pocFullResponse[1]
    return response
}

export async function askPoC(hash: string, peer: Peer): Promise<any> {
    let poc_call = {
        method: "proofOfConsensus",
        params: [hash],
    }
        let response = await peer.call(poc_call)
    if (response.result===200) {
        return response.response
    } else {
        return null
    }
}
