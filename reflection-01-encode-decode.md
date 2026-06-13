# Reflection: Encode and Decode Message

**Step:** [1] Encode and Decode Message  
**Message:** `CKB cell proof: data lives in outputData on local devnet.`

## What I Learned

This step introduced me to how CKB handles data at the most basic level — as raw bytes. Unlike traditional databases where you store structured data in typed fields, a CKB Cell treats everything as a byte array. To store a human-readable message on-chain, you first convert it to a hex-encoded string.

The flow was straightforward:

```javascript
const encoded = utf8ToHex(message);
// → 0x434b422063656c6c…

const decoded = hexToUtf8(encoded);
// → "CKB cell proof: data lives in outputData on local devnet."
```

## Key Takeaways

- **Cells store raw bytes** — there's no built-in string type. Everything is hex under the hood.
- **Round-trip verification** is essential — encoding and decoding confirmed the data survived intact before we ever sent it to the chain.
- The `utf8ToHex` / `hexToUtf8` helpers in the CKB SDK make the conversion seamless, but it's important to understand what's happening underneath.

This foundation made the next step — actually putting data into a transaction — feel natural.
