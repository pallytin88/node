
import FHE from "./FHE"

async function main() {

    // Create a new instance of FHE
    // NOTE The resulting instance will be used to perform operations on the encrypted data
    // Only this specific instance will be able to decrypt the data it encrypted
    const fhe = await FHE.getInstance()
    await fhe.config.setParameters()
    await fhe.config.createKeysAndEncoders()

            // Create data to be encrypted
    let plainData = 7
    let addStep = 5
    let multiplyStep = 3
    // Encrypt the PlainText
    var cipheredData = await fhe.encryption.encryptNumber(plainData)

        var cipheredAddStep = await fhe.encryption.encryptNumber(addStep)
    // Add the CipherText to itself and store it in the destination parameter (itself)
    var cipheredAdditionResult = await fhe.math.addNumbers(cipheredData, cipheredAddStep)
    // Decrypt the CipherText
    var decryptedAdditionResult = await fhe.encryption.decryptNumber(cipheredAdditionResult)
    
    var decryptedData = await fhe.encryption.decryptNumber(cipheredData)

    if (decryptedData !== decryptedAdditionResult) {
                process.exit(-1)
    }
            var cipheredMultiplyStep = await fhe.encryption.encryptNumber(multiplyStep)
    // Multiply the CipherText to itself and store it in the destination parameter (itself)
    var cipheredMultiplicationResult = await fhe.math.multiplyNumbers(cipheredData, cipheredMultiplyStep)
    // Decrypt the CipherText
    var decryptedMultiplicationResult = await fhe.encryption.decryptNumber(cipheredMultiplicationResult)
    
    decryptedData = await fhe.encryption.decryptNumber(cipheredData)
    if (decryptedData !== decryptedMultiplicationResult) {
                process.exit(-1)
    }
    
        // Boolean operations
    // Negate the CipherText and store it in the destination parameter (itself)
    var cipheredNegateResult = await fhe.math.negate(cipheredData)
    // Decrypt the CipherText
    var decryptedNegateResult = await fhe.encryption.decryptNumber(cipheredNegateResult)
    if (decryptedNegateResult !== -decryptedData) {
                process.exit(-1)
    }
    
    decryptedData = await fhe.encryption.decryptNumber(cipheredData)
    if (decryptedData !== decryptedNegateResult) {
                process.exit(-1)
    }

    
    
}


main()