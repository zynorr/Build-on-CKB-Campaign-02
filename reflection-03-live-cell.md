# Reflection: Retrieving Live Cell Data

**Step:** [3] Retrieving Live Cell Data  
**Out point:** `0x14a53d6f5fc6a0a78697a5fba0ca813f4b4c55f17ebd4cdb1eb150569e354910:0x0`

## What I Learned

This step closed the loop. After writing data into a transaction, I retrieved the live Cell by its OutPoint and decoded the outputData back to text. It confirmed the full write → read cycle on CKB.

### The OutPoint Model

An OutPoint is simply `(transaction_hash : output_index)` — it uniquely identifies a specific Cell output in the history of the chain. By querying the devnet with this OutPoint, I could fetch the live Cell and inspect its contents.

```
Querying → Live Cell → outputData → hexToUtf8 → Original message
```

### Data Persistence Verification

The live cell data matched exactly:

| Stage | Value |
|---|---|
| Original message | `CKB cell proof: data lives in outputData on local devnet.` |
| Encoded on chain | `0x434b422063656c6c2070726f6f663a…` |
| Decoded from live cell | `CKB cell proof: data lives in outputData on local devnet.` |

## Key Takeaways

- **OutPoint is the pointer** — it's how you reference and retrieve live Cells on CKB, similar to how Bitcoin references UTXOs.
- **Data survives on-chain** — once committed in a transaction, the data lives in the Cell's `outputData` until the Cell is consumed.
- **The write/read cycle is clean** — encode → build tx → send → fetch by OutPoint → decode. Each step is explicit and verifiable.

This final step made the entire process click — the Cell model isn't just theoretical; it's a practical way to store and retrieve data on a blockchain.
