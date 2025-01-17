/* eslint-disable no-unused-vars */
// INFO Entry point for multichain requests

import { XMScript } from "@kynesyslabs/demosdk/types"
import XMParser from "./routines/XMParser"

export default class multichainDispatcher {
    // INFO Digesting the request from the server
    static async digest(data: XMScript): Promise<any> {
                                        )
                                        .length)
        
                        for (
            let i = 0;
            i < Object.keys(data.operations).length;
            i++
        ) {
            // Named function
            [i],
            )
        }
                        // REVIEW Execute
        let result = await multichainDispatcher.execute(data)
        // TODO Implement a response schema
        return JSON.stringify(result, (_, v) =>
            typeof v === "bigint" ? v.toString() : v,
        ) // await multichainDispatcher.execute(data)
    }

    // INFO Check syntax of xM Script
    static async load(script: string): Promise<any> {
        // TODO String to XMScript
        return await XMParser.load(script)
    }

    // INFO Executes a xM Script
    static async execute(script: XMScript): Promise<any> {
        let results = []
                )
        results = await XMParser.execute(script)
                

                //
                
        return results
    }
}