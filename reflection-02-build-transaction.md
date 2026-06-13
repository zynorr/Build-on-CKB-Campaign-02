# Reflection: Building the Transaction

**Step:** [2] Building the Transaction  
**Transaction hash:** `0x14a53d6f5fc6a0a78697a5fba0ca813f4b4c55f17ebd4cdb1eb150569e354910`

## What I Learned

This was the most hands-on step. After encoding the message, I built a CKB transaction that carried the hex data inside `output[0].data`. The key insight here is that **data lives in the output, not in a separate storage layer** — the Cell *is* the storage.

### The Transaction Structure

Unlike Bitcoin where the focus is on UTXO value transfers, a CKB transaction output can carry arbitrary data. I had two outputs:
1. **Output 0** — Contains the encoded message in its `data` field
2. **Output 1** — The change cell returning remaining CKB to the sender

### Balance Management

```
Balance before: 4,199,952,799,997,912 shannons
```

I had to account for capacity — every byte of data in a Cell requires CKB to be locked as capacity. This reinforces CKB's state-as-asset model: storing data isn't free; you must collateralize it.

## Key Takeaways

- **outputData is the storage field** — not witness data, not input scripts. The Cell model stores state in outputs.
- **Capacity constraint** — each output must have enough CKB to cover its data size. The minimum depends on how much data you're storing.
- **Two-output pattern** — one cell for the message, one for the change. This is the standard CKB transaction pattern.

Seeing the transaction hash come back from the devnet was satisfying — proof that the data was actually written to the chain.
