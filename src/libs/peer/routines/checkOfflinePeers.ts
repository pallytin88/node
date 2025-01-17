import { getSharedState } from "src/utilities/sharedState"
import PeerManager from "../PeerManager"

// REVIEW Check offline peers asynchronously
export default async function checkOfflinePeers(): Promise<void> {
    // INFO add a reentrancy check
    if (getSharedState.inPeerRecheckLoop) {
                return
    }

    getSharedState.inPeerRecheckLoop = true
    const offlinePeers = PeerManager.getInstance().getOfflinePeers()
    for (const offlinePeerIdentity in offlinePeers) {
        let offlinePeer = offlinePeers[offlinePeerIdentity]
        const offlinePeerString = offlinePeer.connection.string
                // TODO Add sanity checks
        const isOnline = await offlinePeer.connect()
        if (isOnline) {
                        // Add the peer to the peer manager and online list
            PeerManager.getInstance().addPeer(offlinePeer)
            // Remove the peer from the offline list
            PeerManager.getInstance().removeOfflinePeer(offlinePeerString)
        } else {
                    }
    }
    getSharedState.inPeerRecheckLoop = false
}
