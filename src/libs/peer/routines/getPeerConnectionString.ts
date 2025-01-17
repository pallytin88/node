/* LICENSE

© 2023 by KyneSys Labs, licensed under CC BY-NC-ND 4.0

Full license text: https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
Human readable license: https://creativecommons.org/licenses/by-nc-nd/4.0/

KyneSys Labs: https://www.kynesys.xyz/

*/

// TODO Do the same but with connectionString


import { NodeCall } from "src/libs/network/manageNodeCall"
import Peer from "../Peer"

export default async function getPeerConnectionString(
    peer: Peer,
    id: any,
): Promise<Peer> {
    let node_call: NodeCall = {
        message: "getPeerConnectionString",
        data: null,
        muid: null,
    }
    let response = await peer.call({
        method: "nodeCall",
        params: [node_call],
    })
    // Response management
    if (response.result === 200) {
                //        peer.connection.string = response.response
    } else {
            }
    return peer
}
