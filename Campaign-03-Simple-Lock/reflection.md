# Personal Reflection

> **Entrant drafting notes:** Rewrite these verified facts in your own voice
> before submitting. Remove this notice and any points you did not personally
> observe or agree with. The campaign requires a non-AI-generated reflection.

## What I Learned

Use the following exact facts to explain what changed in your understanding:

- The deployment created a code Cell containing `hash-lock.bc`. Other Cells use
  its out point as a code dependency instead of calling a persistent contract
  account.
- The deployed script uses the `data2` hash type. Its code hash is
  `0xcd262cb39d9e83f63e5415a56a23982fb6ae79b993e3cf371c12fad71dd23519`.
- The deployment transaction is
  `0xcaf34e8e7cf174c567c0fc3f3f7c9ddeec5a1d7a66f0b8a261d4d3d0c5f41fea`,
  and the contract is stored at output index `0`.
- The lock arguments contain the CKB JavaScript VM prefix followed by the
  expected hash. The contract takes the bytes from offset `35` onward as that
  expected hash.
- To unlock a Cell, the contract reads the first group-input witness and uses
  its `lock` field as the preimage. It computes `hashCkb(preimage)` and compares
  the result with the expected hash from the lock arguments.
- A matching hash returns exit code `0`, allowing the input Cell to be
  consumed. A mismatch returns exit code `11`, rejecting the transaction.
- The successful run funded the lock with `300 CKB`, transferred `99 CKB`, and
  left `200.99999 CKB` protected by the same hash lock.

## What I Debugged

Use the points that reflect what you personally found most useful:

- The initial build used the Unix command `./node_modules/.bin/esbuild`.
  Windows rejected it with `'.' is not recognized as an internal or external
  command`.
- The Windows-compatible fix uses esbuild's Node API through `buildSync()` and
  compiles the bundle with `offckb debugger`.
- pnpm initially blocked dependency install scripts. The approved packages were
  `esbuild`, `secp256k1`, `sharp`, and `unrs-resolver`.
- Starting OffCKB again produced `EADDRINUSE` on port `28114`. This did not mean
  the chain had failed; it meant the Devnet proxy was already running. The
  active chain was confirmed with `offckb logs node --tail 8`.
- Running the deploy command from the repository root failed because that
  directory had no `package.json`. Deployment worked after changing to
  `examples/dApp/simple-lock`.
- The deploy script also needed `pathToFileURL(process.argv[1]).href` for its
  ES module entry-point check to work with Windows paths.
- The frontend was changed to use a visible unlock-preimage field instead of a
  browser prompt. This made the complete lock and unlock flow easier to test
  and document.

## Weaknesses of the `hash_lock` Example

Choose the weaknesses you actually consider important and explain why:

- **The secret becomes public:** the preimage is placed in a transaction
  witness. Once a transaction is broadcast, other participants can see it.
- **Reusing a hash is unsafe:** every live Cell protected by the same hash can
  be unlocked with the same preimage. After one spend reveals the secret,
  another party could race to spend the remaining Cells.
- **Weak secrets can be guessed:** the expected hash is public in the lock
  arguments. A short or predictable text preimage can be brute-forced offline.
- **There is no identity check:** possession of the preimage is the only
  authorization. The example does not require an owner signature.
- **The authorization is not bound to an intended payment:** anyone who learns
  the preimage can build a transaction with different recipient outputs.
- **There is no recovery path:** losing the preimage can lock the Cells
  permanently because the example has no timeout or refund branch.
- **The UI exposes the preimage:** the unlock field is a normal text input, so
  the secret is visible on screen.
- **String encoding can disagree:** the hash-generation UI converts JavaScript
  characters with `charCodeAt(0)`, while the unlock witness uses `TextEncoder`
  UTF-8 bytes. Non-ASCII input can therefore produce inconsistent bytes.
- **Confirmation is time-based:** the frontend waits a fixed 10 seconds instead
  of polling `get_transaction`, so a slow block can leave the displayed state
  stale.
- **The displayed fee is inconsistent:** the page says `0.001 CKB`, but the
  transaction builder subtracts `1,000` shannons, which is `0.00001 CKB`.
  The fee is also fixed rather than calculated from transaction size and fee
  rate.

## How I Would Improve It

Select the changes you would prioritize and explain the trade-offs:

- Generate a cryptographically random, high-entropy preimage rather than using
  memorable text.
- Use a unique salt or nonce and a different hash for each locked Cell so one
  revealed secret does not unlock unrelated Cells.
- Combine the hash condition with an owner signature or multisignature check.
- Bind authorization to the intended transaction outputs so a revealed
  preimage cannot redirect the payment.
- Add an HTLC-style timeout and refund branch using CKB's `since` field, giving
  the original owner a recovery route after a deadline.
- Encode the preimage with `TextEncoder` everywhere and validate its byte length
  before creating the lock.
- Use a password-style input, avoid logging the preimage, and clear it from the
  UI after submission.
- Poll transaction status through RPC rather than assuming confirmation after
  10 seconds.
- Calculate and display the same fee from transaction size and the selected fee
  rate.
