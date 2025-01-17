/* LICENSE

© 2023 by KyneSys Labs, licensed under CC BY-NC-ND 4.0

Full license text: https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
Human readable license: https://creativecommons.org/licenses/by-nc-nd/4.0/

KyneSys Labs: https://www.kynesys.xyz/

*/

import { NodeCall } from "src/libs/network/manageNodeCall"
import { getSharedState } from "src/utilities/sharedState"
import Peer from "../Peer"

// proxy method
export async function verifyPeer(peer: Peer, expectedKey: string): Promise<Peer> {
    await getPeerIdentity(peer, expectedKey)
    return peer
}

// Peer is verified and its status is updated
export default async function getPeerIdentity(
    peer: Peer,
    expectedKey: string,
): Promise<Peer> {

    // Getting our identity
    let id = getSharedState.identity.ed25519
    
    console.warn("[PEER AUTHENTICATION] Getting peer identity")
            
    let node_call: NodeCall = {
        message: "getPeerIdentity",
        data: null,
        muid: null,
    }


    let response = await peer.call({
        method: "nodeCall",
        params: [node_call],
    })
    )
    // Response management
    if (response.result === 200) {
                //)
                if (response.response=== expectedKey) {
                    } else {
                                                                        return null
        }
        // Adding the property to the peer
        peer.identity = response.response.identity // Identity is now known
        peer.status.online = true // Peer is now online
        peer.status.ready = true // Peer is now ready
        peer.status.timestamp = new Date().getTime()
        peer.verification.status = true // We verified the peer
        peer.verification.message = "getPeerIdentity routine verified"      
        peer.verification.timestamp = new Date().getTime()
    } else {
                return null
    }
    // ? Should we add it to the peerList here instead of in the peerBootstrap routine / hello_peer routine?
    return peer
}
