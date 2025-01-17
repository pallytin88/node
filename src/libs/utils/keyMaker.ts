import fs from "fs"
import { pki } from "node-forge"
import terminalkit from "terminal-kit"
import { cryptography } from "../crypto"
const term = terminalkit.terminal

async function ensureIdentity(): Promise<pki.KeyPair> {
    let ed25519: pki.KeyPair
    if (fs.existsSync(".demos_identity")) {
        // Loading the identity
        // TODO Add load with cryptography
        ed25519 = await cryptography.load(".demos_identity")
        term.yellow("Loaded ecdsa identity")
    } else {
        ed25519 = cryptography.new()
        // Writing the identity to disk in binary format
        await cryptography.save(ed25519, ".demos_identity")
        term.yellow("Generated new identity")
    }
    return ed25519
}

async function main() {
    // Check for -f flag
    const forceNew = process.argv.includes("-f")

    if (forceNew && fs.existsSync(".demos_identity")) {
        fs.unlinkSync(".demos_identity")
            }

    // Loading or generating the identity
    let identity = await ensureIdentity()
    const publicKey = identity.publicKey.toString("hex")
    const privateKey = identity.privateKey.toString("hex")
                // Save to file
    fs.writeFileSync("public.key", publicKey)
    fs.writeFileSync(".demos_identity", "0x" + privateKey)
    // Logging
     to .demos_identity and public.key")
}

main()
