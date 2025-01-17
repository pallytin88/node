/* LICENSE

© 2023 by KyneSys Labs, licensed under CC BY-NC-ND 4.0

Full license text: https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
Human readable license: https://creativecommons.org/licenses/by-nc-nd/4.0/

KyneSys Labs: https://www.kynesys.xyz/

*/

import * as fs from "fs"
import Chain from "src/libs/blockchain/chain"

export default async function findGenesisBlock() {
        let genesis_block_q = await Chain.getGenesisBlock()
        //    let genesis_block
    if (!genesis_block_q) {
                genesis_block = null
    } else {
        genesis_block = genesis_block_q
    }
    //     // throw new Error("genesis block found")
    if (!genesis_block) {
                if (!fs.existsSync("data/genesis.json")) {
            // Exit if there are no genesis block
                        // eslint-disable-next-line no-undef
            process.exit(-5)
        }
                // Loading the genesis block
        let genesis_data = JSON.parse(
            fs.readFileSync("data/genesis.json", "utf8"),
        )
                //         //         // throw new Error()
        // Adding the genesis block to the chain
                let genesis_hash = await Chain.generateGenesisBlock(genesis_data)
                genesis_block = await Chain.getGenesisBlock()
    } else {
            }
        }
