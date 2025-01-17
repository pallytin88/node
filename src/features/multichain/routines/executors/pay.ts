import { IOperation } from "@kynesyslabs/demosdk/types"
import * as multichain from "@kynesyslabs/demosdk/xm-localsdk"

import { chainProviders } from "sdk/localsdk/multichain/configs/chainProviders"
import { evmProviders } from "sdk/localsdk/multichain/configs/evmProviders"
import { TransactionResponse } from "sdk/localsdk/multichain/types/multichain"
import checkSignedPayloads from "src/utilities/checkSignedPayloads"

/**
 * Executes a XM pay operation and returns
 * @param operation The XM operation to be executed
 * @param chainID The chain ID for the EVM pay operation
 * @returns A promise to an object with the status and the result of the operation
 */
export default async function handlePayOperation(
    operation: IOperation,
    chainID: number,
) {
    let result: TransactionResponse

    ...")
    // NOTE For the following tasks we need to check the signed payloads against checkSignedPayloads()

    // NOTE Generic sanity check on payloads
    if (!checkSignedPayloads(1, operation.task.signedPayloads)) {
        ",
        )
        return {
            result: "error",
            error: "Invalid signedPayloads length",
        }
    }
    ",
    )
    // ANCHOR EVM (which is quite simple: send a signed transaction. Done.)
    if (operation.is_evm) {
        // If is EVM, send tx and return the result
        return await handleEVMPay(chainID, operation)
    }

    // SECTION: Non EVM Section has more complexity
    
    // ANCHOR Ripple
    const rpc_url =
        operation.rpc || chainProviders[operation.chain][operation.subchain]
    if (!rpc_url) {
        return {
            result: "error",
            error: `RPC URL not found for ${operation.chain}.${operation.subchain}`,
        }
    }

    switch (operation.chain) {
        case "xrpl":
            result = await handleXRPLPay(rpc_url, operation)
            break

        case "egld":
            result = await genericJsonRpcPay(
                multichain.MULTIVERSX,
                rpc_url,
                operation,
            )
            break

        case "ibc":
            result = await genericJsonRpcPay(multichain.IBC, rpc_url, operation)
            break

        case "solana":
            result = await genericJsonRpcPay(
                multichain.SOLANA,
                rpc_url,
                operation,
            )
            break

        case "ton":
            result = await genericJsonRpcPay(multichain.TON, rpc_url, operation)
            break

        default:
            result = {
                result: "error",
                error: `Chain: ${operation.chain} not supported`,
            }
    }

        
    // REVIEW is this ok here?
    return result
}

/**
 * Executes a JSON RPC Pay operation for a JSON RPC sdk and returns the result
 * @param rpc_url The RPC URL for the chain
 * @param operation The operation to be executed
 */
async function genericJsonRpcPay(
    sdk: any,
    rpc_url: string,
    operation: IOperation,
) {
        let instance: multichain.IBC

    try {
        instance = await sdk.create(rpc_url)
    } catch (error) {
        return {
            result: "error",
            error: error.toString(),
        }
    }

    try {
        const signedTx = operation.task.signedPayloads[0]

        // INFO: Send payload and return the result
        const result = await instance.sendTransaction(signedTx)
                
        return result
    } catch (error) {
                        return {
            result: "error",
            error: error.toString(),
        }
    }
}
/**
 * Executes an EVM Pay operation and returns the result
 */
async function handleEVMPay(chainID: number, operation: IOperation) {
     // REVIEW Simulations?
    
    
    
    let evmInstance = multichain.EVM.getInstance(chainID)

    if (!evmInstance) {
        const rpc_url = evmProviders[operation.chain][operation.subchain]
        evmInstance = multichain.EVM.createInstance(chainID, rpc_url)
        await evmInstance.connect()
    }

    return await multichain.EVM.getInstance(chainID).sendSignedTransaction(
        operation.task.signedPayloads[0],
    )
}

/**
 * Executes a Ripple Pay operation and returns the result
 */
async function handleXRPLPay(
    rpc_url: string,
    operation: IOperation,
): Promise<TransactionResponse> {
             // REVIEW Simulations?
    let xrplInstance = new multichain.XRPL(rpc_url)
    const connected = await xrplInstance.connect()
    
    if (!connected) {
        return {
            result: "error",
            error: `Failed to connect to the XRP network. RPC URL: "${rpc_url}" on ${operation.chain}.${operation.subchain} is not reachable`,
        }
    }

    // REVIEW 10 seconds timeout for connection
    let timer = 0
    while (!xrplInstance.connected) {
        await new Promise(resolve => setTimeout(resolve, 300))
        timer += 300
        if (timer > 10000) {
                        return {
                result: "error",
                error: "Timeout in connecting to the XRP network",
            }
        }
    }
    
    try {
                        )
        const result = await xrplInstance.sendTransaction(
            operation.task.signedPayloads[0],
        )
                
        return result
    } catch (error) {
                        return {
            result: "error",
            error: error,
        }
    }
}
