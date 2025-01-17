import * as fs from "fs"
// INFO Singleton managing the wallet in a cli environment
import forge from "node-forge"

export interface Identity {
    privateKey: forge.pki.ed25519.BinaryBuffer
    publicKey: forge.pki.ed25519.BinaryBuffer
}

export default class Wallet {
    private static instance: Wallet

    identity: Identity = { privateKey: null, publicKey: null }

    public static getInstance(): Wallet {
        if (!Wallet.instance) {
            Wallet.instance = new Wallet()
        }
        return Wallet.instance
    }

    // NOTE If provided, the seed will be used to generate the keys
    constructor(pk: string = null) {
        if (pk) {
            this.load(pk)
        } else {
            this.create()
        }
    }

    create() {
        this.identity = forge.pki.ed25519.generateKeyPair()
    }

    dispatch(divided_input: string[]) {
        // We need the modes (2 to 3 arguments)
        if (divided_input.length < 2 || divided_input.length > 3) {
                        return
        }
        var mode = divided_input[1]
        switch (mode.toLowerCase()) {
            default:
                                break
            // NOTE New wallet from scratch
            case "create":
                if (divided_input.length > 2) {
                                    }
                try {
                    this.create()
                                    } catch (e) {
                                    }
                break
            // NOTE Loading from an hex private key
            case "load":
                if (divided_input.length < 3) {
                                        break
                }
                try {
                    this.load(divided_input[2])
                                    } catch (e) {
                                    }
                break
            // NOTE Saving the wallet to a file
            case "save": // Requires an input from the user or default to a file
                var filename: string
                if (divided_input.length < 3) {
                                        filename = "wallet.demos"
                } else {
                    filename = divided_input[2]
                }
                // Writing to file
                try {
                    this.save(filename)
                                    } catch (e) {
                                    }
                break
            // NOTE Reading from a file
            case "read": // Requires an input from the user or default to a file
                var load_filename: string
                if (divided_input.length < 3) {
                                        load_filename = "wallet.demos"
                } else {
                    load_filename = divided_input[2]
                }
                // Reading from file
                try {
                    this.read(load_filename)
                                    } catch (e) {
                                    }
                break
            // NOTE Showing the wallet
            case "show": // Shows the wallet
                //                break
        }
    }

    load(pk: string) {
        this.identity.privateKey = Buffer.from(pk, "hex")
        this.identity.publicKey = forge.pki.ed25519.publicKeyFromPrivateKey({
            privateKey: this.identity.privateKey,
        })
    }

    save(filename: string) {
        fs.writeFileSync(filename, this.identity.privateKey.toString("hex"))
    }

    read(filename: string) {
        let stringed_pk = fs.readFileSync(filename, "utf8")
        this.identity.privateKey = Buffer.from(stringed_pk, "hex")
        this.identity.publicKey = forge.pki.ed25519.publicKeyFromPrivateKey({
            privateKey: this.identity.privateKey,
        })
    }
}
