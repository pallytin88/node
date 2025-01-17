import { RPCResponse } from "@kynesyslabs/demosdk/types"
import _ from "lodash"
import { getSharedState } from "src/utilities/sharedState"
import Chain from "../blockchain/chain"
import GCR from "../blockchain/gcr/gcr"
import eggs from "./routines/eggs"
import { emptyResponse } from "./server_rpc"
// Importing methods themselves
import { Hashing } from "node_modules/@kynesyslabs/demosdk/build/encryption"
import {
    GlobalChangeRegistry
} from "src/model/entities/GCR/GlobalChangeRegistry"
import log from "src/utilities/logger"
import HandleGCR from "../blockchain/gcr/handleGCR"
import getBlockByHash from "./routines/nodecalls/getBlockByHash"
import getBlockByNumber from "./routines/nodecalls/getBlockByNumber"
import getBlockHeaderByHash from "./routines/nodecalls/getBlockHeaderByHash"
import getBlockHeaderByNumber from "./routines/nodecalls/getBlockHeaderByNumber"
import getPeerInfo from "./routines/nodecalls/getPeerInfo"
import getPeerlist from "./routines/nodecalls/getPeerlist"
import getPreviousHashFromBlockHash from "./routines/nodecalls/getPreviousHashFromBlockHash"
import getPreviousHashFromBlockNumber from "./routines/nodecalls/getPreviousHashFromBlockNumber"

export interface NodeCall {
    message: string
    data: any
    muid: string
}

// REVIEW Is this module too big?
export async function manageNodeCall(content: NodeCall): Promise<RPCResponse> {
    // Basic Node API handling logic
    // ...
    let result: any // Storage for the result
    let nStat: any // Storage for the native status
    let { data } = content
    let response = _.cloneDeep(emptyResponse)
    response.result = 200 // Until proven otherwise
    response.require_reply = false // Until proven otherwise
    response.extra = null // Until proven otherwise
    //    )
    switch (content.message) {
        case "getPeerInfo":
            response.response = await getPeerInfo()
            break
        case "getPeerlist":
            response.response = await getPeerlist()
            break
        case "getPeerlistHash":
            var peerlist = await getPeerlist()
            response.response = Hashing.sha256(JSON.stringify(peerlist))
            log.custom(
                "manageNodeCall",
                "Peerlist hash: " + response.response,
                true,
            )
            break
        // REVIEW Both below for getting the last hash (untested yet)
        case "getPreviousHashFromBlockNumber":
            result = await getPreviousHashFromBlockNumber(data)
            response.response = result.response
            response.extra = result.extra
            break
        case "getPreviousHashFromBlockHash":
            result = await getPreviousHashFromBlockHash(data)
            response.response = result.response
            response.extra = result.extra
            break
        // REVIEW (untested) Headers instead of full blocks
        case "getBlockHeaderByNumber":
            result = await getBlockHeaderByNumber(data)
            response.response = result.response
            response.extra = result.extra
            break
        case "getBlockHeaderByHash":
            result = await getBlockHeaderByHash(data)
            response.response = result.response
            response.extra = result.extra
            break
        case "getLastBlockNumber":
                        response.response = await Chain.getLastBlockNumber()
             // REVIEW Debug
            //            break
        case "getLastBlock":
            response.response = await Chain.getLastBlock()
            break
        case "getLastBlockHash":
            response.response = await Chain.getLastBlockHash()
            break
        case "getBlockByNumber":
                        return await getBlockByNumber(data)
        case "getBlockByHash":
            // Check if we have .hash or .blockHash
            if (data.hash) {
                            } else if (data.blockHash) {
                                data.hash = data.blockHash
            } else {
                response.result = 400
                response.response = "No hash or blockHash specified"
            }
            try {
                result = await getBlockByHash(data)
                response.response = result.response
                response.extra = result.extra
            } catch (e) {
                response.response = null
                response.result = 400
                response.extra = e
            }
            break
        case "getTxByHash":
            if (!data.hash) {
                response.result = 400
                response.response = "No hash specified"
                break
            }
                        try {
                response.response = await Chain.getTxByHash(data.hash)
            } catch (e) {
                response.response = null
                response.result = 400
                response.extra = e
            }
            if (!response.response) {
                response.result = 400
                response.response = "error"
            }
            break
        case "getMempool":
            response.response = await Chain.getPendingPool()
            break
        // INFO Authentication listener
        case "getPeerIdentity":
            // NOTE We don't need to sign anything as the headers are signed already
            response.response =
                getSharedState.identity.ed25519.publicKey.toString("hex")
            //            break

        // INFO Address info endpoint
        case "getAddressInfo":
            if (!data.address) {
                response.result = 400
                response.response = "No address specified"
                break
            }
            try {
                nStat = (await GCR.getGCRNativeStatus(
                    data.address,
                )) as GlobalChangeRegistry
                response = nStat //.toString() // REVIEW It works ?
            } catch (error) {
                response.result = 400
                response.response = "error"
                response.extra = error
            }
            break
        case "getAddressNonce":
            if (!data.address) {
                response.result = 400
                response.response = "No address specified"
                break
            }
            nStat = (await GCR.getGCRNativeStatus(
                data.address,
            )) as GlobalChangeRegistry
            response.response = nStat.details.content.nonce
            break
        case "getPeerTime":
            response.response = new Date().getTime()
            break

        case "getAllTxs":
            var response_object = await Chain.getAllTxs()
            response.response = response_object
            break

        // REVIEW Implement native tables requests
        // NOTE: ...(data.options ? [data.options] : []) is used to handle optional parameters. If the options are not provided, the function will use its default values.
        case "getNativeStatus":
            response = await HandleGCR.getNativeStatus(
                data.address,
                ...(data.options ? [data.options] : []),
            )
            break
        case "getNativeProperties":
            response = await HandleGCR.getNativeProperties(
                data.address,
                ...(data.options ? [data.options] : []),
            )
            break
        case "getNativeSubnetsTxs":
            response = await HandleGCR.getNativeSubnetsTxs(
                data.subnetId,
                ...(data.options ? [data.options] : []),
            )
            break

        // NOTE Don't look past here, go away
        // INFO For real, nothing here to be seen
        case "hots":
                        response.response = eggs.hots()
            break
        default:
                        // eslint-disable-next-line quotes
            response.response = '{ error: "Unknown message"}'
            break
    }

    // REVIEW Is this ok? Follow back and see
    return response
}
