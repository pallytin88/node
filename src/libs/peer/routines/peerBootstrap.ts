/* LICENSE

© 2023 by KyneSys Labs, licensed under CC BY-NC-ND 4.0

Full license text: https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
Human readable license: https://creativecommons.org/licenses/by-nc-nd/4.0/

KyneSys Labs: https://www.kynesys.xyz/

*/


import log from "src/utilities/logger"
import Peer from "../Peer"
import PeerManager from "../PeerManager"
import getPeerIdentity from "./getPeerIdentity"

const peerManager = PeerManager.getInstance()

// Proxy function to call peerBootstrap in a nicer way
export async function peerlistCheck(local_list: Peer[]): Promise<Peer[]> {
    return await peerBootstrap(local_list)
}

// ANCHOR Main function

export default async function peerBootstrap(
    local_list: Peer[],
): Promise<Peer[]> {
        // Validity check
    for (let i = 0; i < local_list.length; i++) {
                // ANCHOR Extract peer info from the string
        let _currentPeer: Peer = local_list[i] // The url of the peer
        // If there is a : in the url, we assume it's a address + port
        let currentPeerUrl: string = _currentPeer.connection.string
        let currentPublicKey: string = _currentPeer.identity
         
        // ANCHOR Connection test and hello_peer routine
        const blankPeer = new Peer(currentPeerUrl, currentPublicKey)
            // Adding identity if any
                // After this, the peer object will have an identity and thus will be verified
        let verifiedPeer = await getPeerIdentity(
            blankPeer,
            currentPublicKey,
        )
        if (!verifiedPeer) {
                        peerManager.addOfflinePeer(blankPeer)
            peerManager.removeOnlinePeer(blankPeer.identity)
            continue
        }
                        // ! remove debug code
        try {
            verifiedPeer.connection.string = currentPeerUrl // Adding this step
        } catch (error) {
                        log.critical("Error setting connection string: " + error)
            continue
        }
                log.info("[BOOTSTRAP] OK: Valid peer " + currentPeerUrl + "\n")

                // This should automatically add the peer to the peer list or the offline list
        // let response = await verifiedPeer.longCall({
        //     method: "hello_peer",
        //     params: [{
        //         url: verifiedPeer.connection.string,
        //         publicKey: currentPublicKey,
        //     }],
        // }, true, 250, 3)
        await PeerManager.sayHelloToPeer(verifiedPeer)
        // )
    }
    // Dying if there are no valid peers
    if (peerManager.getPeers().length == 0) {
        // Exit if there are no valid peers
            } else {
        .length)
    }
    return peerManager.getPeers()
}
