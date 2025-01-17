import bigInt from "big-integer"
import terminalkit from "terminal-kit"

import { Prover, Verifier } from "./zk"
import generateLargePrime from "./zkPrimer"

const term = terminalkit.terminal

// EXAMPLE

async function testing() {
    // Start a timer to measure the time it takes to run the protocol
    const start = Date.now()

        // Generate two large primes for the protocol
        const prime1 = generateLargePrime(2048, 5)
    )
        const prime2 = generateLargePrime(2048, 5)
    )
        
        // The password is the secret that the Prover knows
    const password = "mySecretPassword"
    //         // Convert the password to a big integer to use in the protocol
    const passwordAsBigInt = bigInt(password, 36)
    //);
        // Create a Prover with the password as the secret
    const prover = new Prover(prime1, prime2, passwordAsBigInt)
    
    term.yellow(
        "\n[PROVER -> VERIFIER] 'Hey, I know the password! Here's my modulus!\n\n",
    )

        // Create a Verifier with the Prover's modulus
    const verifier = new Verifier(prover.modulus)
    
    term.yellow("\n[VERIFIER -> PROVER] 'Okay, prove it!'\n\n")

        // The Prover generates a commitment
    const commitment = prover.generateCommitment()
    //);

    term.yellow("\n[PROVER -> VERIFIER] 'Here's my commitment!'\n\n")

    // The Verifier generates a challenge
        const challenge = verifier.generateChallenge(commitment)
    //);

    term.yellow(
        "\n[VERIFIER -> PROVER] 'And here is your challenge, based on your commitment!'\n\n",
    )

        // The Prover responds to the challenge
    const response = prover.respondToChallenge(challenge)
    //);

    term.yellow("\n[PROVER -> VERIFIER] 'Here is my response!'\n\n")

        // The Verifier verifies the response
    const isVerified = verifier.verifyResponse(response, challenge)
    )

    if (isVerified) {
        term.green("\n[VERIFIER] 'You are verified!'\n\n")
    } else {
        term.red("\n[VERIFIER] 'You are not verified!'\n\n")
    }

    // Stop the timer
    const end = Date.now()
    const timeTaken = end - start
    }

testing()
