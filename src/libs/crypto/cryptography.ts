/* LICENSE

© 2023 by KyneSys Labs, licensed under CC BY-NC-ND 4.0

Full license text: https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode
Human readable license: https://creativecommons.org/licenses/by-nc-nd/4.0/

KyneSys Labs: https://www.kynesys.xyz/

*/

import * as crypto from "crypto"
import { promises as fs } from "fs"
import forge from "node-forge"
import { getSharedState } from "src/utilities/sharedState"
import terminalkit from "terminal-kit"

import { ForgeToHex } from "./forgeUtils"

const term = terminalkit.terminal

const algorithm = "aes-256-cbc"

export default class Cryptography {
    static new() {
        const seed = forge.random.getBytesSync(32)
        const keys = forge.pki.ed25519.generateKeyPair({ seed })
                return keys
    }

    // INFO Method to generate a new key pair from a seed
    static newFromSeed(stringSeed: string) {
        return forge.pki.ed25519.generateKeyPair({ seed: stringSeed })
    }

    // TODO Eliminate the old legacy compatibility
    static async save(keypair: forge.pki.KeyPair, path: string, mode = "hex") {
                if (mode === "hex") {
            let hexPrivKey = Cryptography.saveToHex(keypair.privateKey)
            await fs.writeFile(path, hexPrivKey)
        } else {
            await fs.writeFile(path, JSON.stringify(keypair.privateKey))
        }
    }

    static saveToHex(forgeBuffer: forge.pki.PrivateKey): string {
                // // REVIEW if it is like this
        let stringBuffer = forgeBuffer.toString("hex")
                        return "0x" + stringBuffer
    }

    // SECTION Encrypted save and load
    static async saveEncrypted(
        keypair: forge.pki.KeyPair,
        path: string,
        password: string,
    ) {
        const key = crypto.createCipher(algorithm, password)
        // Getting the private key in hex form
        const hex_key = keypair.privateKey.toString("hex")
        // Encrypting and saving
        const encryptedMessage = key.update(hex_key, "utf8", "hex")
        await fs.writeFile(path, encryptedMessage)
    }

    static async loadEncrypted(path: string, password: string) {
        let keypair: forge.pki.KeyPair = {
            privateKey: null,
            publicKey: null,
        }
        // Preparing the environment
        const decipher = crypto.createDecipher(algorithm, password)
        const contentOfFile = await fs.readFile(path, "utf8")
        // Decrypting
        const decryptedKey = decipher.update(contentOfFile, "hex", "utf8")
        // Loading
        if (decryptedKey.includes("{")) {
            keypair = Cryptography.loadFromBufferString(contentOfFile)
        } else {
            keypair = Cryptography.loadFromHex(contentOfFile)
        }
        return keypair
    }
    // !SECTION Encrypted save and load

    static async load(path) {
        let keypair: forge.pki.KeyPair = {
            privateKey: null,
            publicKey: null,
        }

        const contentOfFile = await fs.readFile(path, "utf8")
        if (contentOfFile.includes("{")) {
            keypair = Cryptography.loadFromBufferString(contentOfFile)
        } else {
            keypair = Cryptography.loadFromHex(contentOfFile)
        }
        return keypair
    }

    static loadFromHex(content: string): forge.pki.KeyPair {
        let keypair = { publicKey: null, privateKey: null }
        content = content.slice(2)
        let finalArray = new Uint8Array(64)
                        for (let i = 0; i < content.length; i += 2) {
            const hexValue = content.substr(i, 2)
            const decimalValue = parseInt(hexValue, 16)
            finalArray[i / 2] = decimalValue
        }
                //        // Condensing
                keypair.privateKey = Buffer.from(finalArray)
                        keypair.publicKey = forge.pki.ed25519.publicKeyFromPrivateKey({
            privateKey: keypair.privateKey,
        })
                return keypair
    }

    static loadFromBufferString(content: string): forge.pki.KeyPair {
        let keypair = { publicKey: null, privateKey: null }
        keypair.privateKey = Buffer.from(JSON.parse(content))
        keypair.publicKey = forge.pki.ed25519.publicKeyFromPrivateKey({
            privateKey: keypair.privateKey,
        })
        return keypair
    }

    static sign(
        message: string,
        privateKey: forge.pki.ed25519.BinaryBuffer | any,
    ) {
        // REVIEW Test HexToForge support
        if (privateKey.type == "string") {
                        // privateKey = HexToForge(privateKey)
            privateKey = forge.util.binary.hex.decode(privateKey)
            process.exit(0)
        }

        return forge.pki.ed25519.sign({
            message,
            encoding: "utf8",
            privateKey,
        })
    }

    static verify(
        signed: string,
        signature: string | forge.pki.ed25519.BinaryBuffer,
        publicKey: string | forge.pki.ed25519.BinaryBuffer,
    ) {
        /*
                                 */
        // REVIEW Test HexToForge support
        if (typeof signature == "string") {
                        // signature = HexToForge(signature)
            signature = forge.util.binary.hex.decode(signature)
        }

        if (typeof publicKey == "string") {
                        // publicKey = HexToForge(publicKey)
            publicKey = forge.util.binary.hex.decode(publicKey)
        }

        // Also, we have to sanitize buffers so that they are forge compatible
        if (signature.length == 64) {
            //            signature = Buffer.from(signature as Uint8Array) // REVIEW Does not work in bun
        }
        //
        if (publicKey.length == 64) {
            //            publicKey = Buffer.from(publicKey as Uint8Array) // REVIEW Does not work in bun
        }

        //
         " +
                signed,
        )
         " +
                ForgeToHex(signature),
        )
         " +
                ForgeToHex(publicKey),
        )
        //        return forge.pki.ed25519.verify({
            message: signed,
            encoding: "utf8",
            signature: signature,
            publicKey: publicKey,
        })
    }

    // ANCHOR Encryption part
    static rsa = {
        // INFO Generating a new RSA keypair from our ecdsa private key
        derive: (): forge.pki.rsa.KeyPair => {
            let md = forge.md.sha256.create()
            md.update(
                JSON.stringify(getSharedState.identity.ed25519.privateKey),
            )
            let seed = md.digest().toHex()
            let pnrg = forge.random.createInstance()
            pnrg.seedFileSync = () => seed
            let keys = forge.pki.rsa.generateKeyPair({ bits: 4096, prng: pnrg })
            return keys
        },

        // INFO Encryption method using the public key
        encrypt: (
            message: string,
            publicKey: any | forge.pki.rsa.PublicKey,
        ): [boolean, any] => {
            // NOTE Supporting "fake buffers" from web browsers
            if (publicKey.type == "Buffer") {
                //                publicKey = Buffer.from(publicKey)
            }
            // Converting the message and decrypting it
            let based = forge.util.encode64(message)
            const encrypted = publicKey.encrypt(based)
            return [true, encrypted]
        },

        // INFO Decryption method using the private key
        decrypt: (
            message: string,
            privateKey: any | forge.pki.rsa.PrivateKey = null,
        ): [boolean, any] => {
            // NOTE Supporting "fake buffers" from web browsers
            try {
                if (privateKey.type == "Buffer") {
                    //term.yellow("[DECRYPTION] Normalizing privateKey...\n")
                    privateKey = Buffer.from(privateKey)
                }
            } catch (e) {
                term.yellow(
                    "[DECRYPTION] Looks like there is nothing to normalize here, let's proceed\n",
                )
                            }
            // Converting back the message and decrypting it
            // NOTE If no private key is provided, we try to use our one
            if (!privateKey) {
                term.yellow(
                    "[DECRYPTION] No private key provided, using our one...\n",
                )
                privateKey = getSharedState.identity.rsa.privateKey
                if (!privateKey) {
                    term.red("[DECRYPTION] No private key found\n")
                    return [false, "No private key found"]
                }
            }
            let debased = forge.util.decode64(message)
            const decrypted = privateKey.decrypt(debased)
            return [true, decrypted.toString()]
        },
    }
}
