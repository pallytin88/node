import { EnhancedCrypto } from "./enigma_lite"
async function run_tests() {
        const { publicKey, privateKey } = EnhancedCrypto.generateKeys()
    
    const message = "Hello, world! This is a secret message."
    
    // Signing
        const signature = EnhancedCrypto.sign(message, privateKey)
    
    // Verifying
        const isValid = EnhancedCrypto.verify(message, signature, publicKey)
    
    // Encrypting
        const encrypted = EnhancedCrypto.encrypt(message, publicKey)
    
    // Decrypting
        const decrypted = EnhancedCrypto.decrypt(encrypted, privateKey)
    
    // Verify decryption was successful
    }

run_tests()