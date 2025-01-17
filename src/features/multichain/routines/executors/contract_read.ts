import type { IOperation } from "@kynesyslabs/demosdk/types"
import * as multichain from "@kynesyslabs/demosdk/xm-localsdk"

export default async function handleContractRead(
    operation: IOperation,
    chainID: number,
) {
        // Mainly EVM but let's let it open for weird chains
    // Workflow: loading the provider url in our configuration, creating an instance, parsing the request
    // and sending back the chain response as it is
    if (operation.is_evm) {
        //         let providerUrl = evmProviders[operation.chain][operation.subchain] // REVIEW Error handling
        let evmInstance = multichain.EVM.createInstance(chainID, providerUrl) // REVIEW We should be connected
                        await evmInstance.connect()
                                let params = operation.task.params // REVIEW Error handling
                if (!params.address) {
                        return {
                result: "error",
                error: "Missing contract address",
            }
        }
        if (!params.abi) {
                        return {
                result: "error",
                error: "Missing contract ABI",
            }
        }
        if (!params.method) {
                        return {
                result: "error",
                error: "Missing contract method",
            }
        }
        // Getting a contract instance using the evm library
                let contractInstance = await evmInstance.getContractInstance(
            params.address,
            params.abi,
        )
        const methodParams = JSON.parse(params.params)
                                // Convert the object values into an array
        const argsArray = Object.values(methodParams)
        const result = await contractInstance[params.method](...argsArray) // REVIEW Big IF
                //)
        //        return {
            result: result,
            status: true,
        }
    } else {
        return {
            result: "error",
            error: "Not implemented yet: contract_read on non-EVM chains",
        }
    }
}
