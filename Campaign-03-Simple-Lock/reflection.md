# Personal Reflection

> **Drafting worksheet:** Rewrite this file completely in your own words
> before submitting. Remove this note and every bracketed prompt. The campaign
> requires a personal, non-AI-generated reflection.

## What I Learned

[Explain what changed in your understanding of CKB. Useful points to consider:
a deployed script is referenced through a code cell and code hash; Cells are
consumed and recreated rather than updated in place; and a lock script validates
whether a transaction is allowed to consume a Cell.]

## What I Debugged

[Describe the problem that was most useful to solve. Facts from this run: the
Unix-style `./node_modules/.bin/esbuild` command failed on Windows, so the build
was changed to the esbuild Node API and `offckb debugger`; `EADDRINUSE` showed
that the Devnet proxy was already running; and deployment had to be launched
from the `simple-lock` directory rather than the repository root.]

## Weaknesses of the `hash_lock` Example

[Give your own assessment. Points you may agree or disagree with: the preimage
becomes public when it is placed in the witness; a short or predictable
preimage can be brute-forced; every Cell using the same hash shares the same
unlock secret; and the example has no owner signature, timeout, or recovery
path if the secret is lost.]

## How I Would Improve It

[Explain which changes you would prioritize. Possible directions include a
high-entropy random preimage with a salt or nonce, combining the hash condition
with an owner signature, binding authorization to the intended transaction,
and adding an HTLC-style timeout and refund path.]
