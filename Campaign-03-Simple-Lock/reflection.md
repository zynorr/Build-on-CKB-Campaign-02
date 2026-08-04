
## What I Learned
The biggest lesson was that CKB does not use persistent smart-contract accounts in the same way as account-based blockchains. State and assets exist in immutable Cells. A Cell cannot be updated directly. To change its state or transfer its capacity, a transaction consumes the existing Cell as an input and creates new output Cells. This made it clearer why CKB applications are designed around constructing and validating state transitions.

I also learned that a Lock Script is a validation rule for consuming a Cell. It does not receive a normal function call from the frontend. Instead, it runs when a transaction attempts to consume a Cell protected by that script. If the script returns `0`, the transaction is valid. If it returns a non-zero exit code, the transaction is rejected.

## Understanding the `hash_lock` Contract

The tutorial contract gave me a practical example of this validation model. The deployed bytecode was stored in a code Cell and referenced by its code hash and Cell dependency. The deployed script used the `data2` hash type and had this code hash:

`0xcd262cb39d9e83f63e5415a56a23982fb6ae79b993e3cf371c12fad71dd23519`

The deployment transaction was:

`0xcaf34e8e7cf174c567c0fc3f3f7c9ddeec5a1d7a66f0b8a261d4d3d0c5f41fea`

The contract reads the current Lock Script and takes the bytes from offset `35` onward as the expected preimage hash. The preceding bytes identify the JavaScript VM program and hash type used to execute the contract.

When someone tries to consume a protected Cell, the contract reads the first group-input witness. It treats the witness `lock` field as the preimage, calculates `hashCkb(preimage)`, and compares the result with the expected hash stored in the lock arguments. A matching value returns exit code `0`, while an incorrect preimage returns exit code `11`.

This helped me understand that the witness supplies authorization data without storing it permanently inside the Cell being protected. The Lock Script defines how that authorization data must be verified.

## Building and Deploying on Windows

The most valuable part of the tutorial was debugging the Windows-specific problems.

The first contract build failed because the original build script executed:

`./node_modules/.bin/esbuild`

That command format works in Unix-like environments but was not recognized by Windows. I changed the build process to use esbuild's Node API through `buildSync()`. I also used `offckb debugger` to compile the bundled JavaScript into CKB bytecode.

pnpm initially blocked the install scripts for `esbuild`, `secp256k1`, `sharp`, and `unrs-resolver`. I had to approve those packages and rebuild the dependencies before the contract could compile successfully.

I also encountered an `EADDRINUSE` error on port `28114` when running `offckb node`. At first, this looked like a failure, but it actually meant that the OffCKB Devnet proxy was already running. I confirmed this by checking the node logs with:

`offckb logs node --tail 8`

The logs showed that the chain was still producing and indexing blocks.

Another deployment attempt failed because I ran `pnpm run deploy` from the repository root, which did not contain the required `package.json`. Changing to the `examples/dApp/simple-lock` directory fixed that issue. The deployment script also needed to convert the Windows entry path with `pathToFileURL(process.argv[1]).href` for its ES module check.

These problems taught me to distinguish between dependency errors, operating-system compatibility errors, incorrect working directories, network-port conflicts, and actual contract execution failures.

## Completing the Frontend Flow

After deploying the contract, I copied the generated deployment metadata into the frontend. This allowed the frontend to use the correct code hash and Cell dependency when constructing transactions.

The frontend generated a hash-lock address from the preimage hash. I funded this address with 300 Devnet CKB. To unlock it, the frontend constructed a transaction containing the receiver output, the deployed contract dependency, the CKB JavaScript VM dependency, the protected input Cells, and the preimage inside the witness.

I transferred 99 CKB to the receiver. After the transaction was committed, the hash-lock balance became 200.99999 CKB. This showed that the original Cell had been consumed and replaced with a receiver Cell and a change Cell still protected by the hash lock.

Completing this transaction helped me understand how the contract, deployment artifacts, frontend, RPC client, Cell collector, transaction inputs, outputs, dependencies, and witnesses work together. The frontend does not directly execute the Lock Script. It proposes a transaction, and the CKB node executes the script while validating that transaction.

## Weaknesses of the `hash_lock` Example

The main weakness is that the preimage becomes public when it is included in the transaction witness. Anyone observing the transaction can learn it. This means a simple hash lock should not be treated like permanent password-based ownership.

Reusing the same preimage is particularly dangerous. If several live Cells use the same hash, spending one Cell reveals the secret needed to unlock all the others. Another participant could use the revealed preimage to construct a competing transaction that sends the remaining capacity somewhere else.

The example also allows weak text preimages such as ordinary words or short phrases. Because the expected hash is public in the lock arguments, an attacker can perform an offline brute-force or dictionary attack until they find a matching preimage.

Another weakness is the lack of identity verification. The script only checks whether the spender knows the preimage. It does not require a signature from an owner and does not bind the authorization to a specific receiver or transaction. Anyone who learns the secret can create their own transaction with different outputs.

There is also no recovery mechanism. If the owner loses the preimage, the protected Cells can remain locked permanently because the example has no timeout or refund branch.

I noticed several frontend weaknesses as well. The preimage is entered through a normal text field, making it visible on screen. The application also logs values that should be treated carefully. Hash generation uses JavaScript character values, while the witness uses UTF-8 encoding through `TextEncoder`. Non-ASCII text could therefore produce inconsistent byte representations.

The frontend waits a fixed 10 seconds before refreshing the balance instead of polling `get_transaction`. This can display stale information when block confirmation takes longer. The interface says the fee is `0.001 CKB`, while the transaction code subtracts 1,000 shannons, which is `0.00001 CKB`. The fee is also fixed rather than calculated from transaction size and the current fee rate.

## How I Would Improve It

I would generate the preimage from cryptographically secure random bytes instead of allowing a short memorable phrase. Each locked Cell should use a unique secret, salt, or nonce so that revealing one preimage does not compromise other Cells.

I would combine the hash condition with an owner signature. The script could require both a valid preimage and a signature from an authorized public key. This would prevent someone who only learns the secret from redirecting the funds.

For payment or swap applications, I would implement an HTLC-style design. One branch would allow the receiver to spend with the correct preimage before a deadline. A second branch would allow the original sender to recover the funds after the deadline using a signature and CKB's `since` field.

I would also bind the authorization to the intended transaction outputs. This would ensure that the preimage cannot be reused to create a transaction with a different receiver or amount.

On the frontend, I would encode the preimage with `TextEncoder` everywhere, require a minimum byte length, hide the secret while typing, avoid logging it, and clear it from memory and the interface after submission. I would poll the transaction through RPC until it reaches a committed or rejected state. Finally, I would calculate the transaction fee from its serialized size and fee rate and display that same value to the user.

## Conclusion

This tutorial changed my understanding of CKB from separate concepts into a complete transaction lifecycle. I built a Lock Script, compiled it into CKB bytecode, deployed it as a code Cell, used its deployment information in a frontend, funded a protected address, supplied authorization through a witness, and successfully consumed the locked Cell.

The debugging process was also useful because it showed me that building a CKB dApp involves more than writing contract logic. The development environment, build tools, deployment artifacts, RPC connection, transaction construction, Cell dependencies, witness structure, and user interface must all agree. The simple hash lock is not production-ready, but it provided a clear foundation for understanding how more secure CKB Lock Scripts can be designed.
