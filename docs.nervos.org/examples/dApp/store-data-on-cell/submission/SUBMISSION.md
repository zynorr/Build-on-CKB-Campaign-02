# Store Data on Cell Tutorial Submission

## Campaign

Complete the Nervos CKB OffCKB quick start and the Store Data on Cell tutorial.

## Environment

- Tutorial: Store Data on Cell
- Local chain: OffCKB devnet
- RPC endpoint: `http://localhost:28114`
- App URL while running locally: `http://localhost:1234`
- Example path: `docs.nervos.org/examples/dApp/store-data-on-cell`
- Proof generated at: `2026-06-13T17:04:55.839Z`

## Proof Screenshots

- Running dApp: [screenshots/00-running-dapp.png](./screenshots/00-running-dapp.png)
- Encode and decode message: [screenshots/01-encode-decode.png](./screenshots/01-encode-decode.png)
- Building the transaction: [screenshots/02-build-transaction.png](./screenshots/02-build-transaction.png)
- Retrieving Live Cell data: [screenshots/03-live-cell.png](./screenshots/03-live-cell.png)

## Proof Details

### Encode and Decode Message

Message:

```text
CKB cell proof: data lives in outputData on local devnet.
```

Encoded hex:

```text
0x434b422063656c6c2070726f6f663a2064617461206c6976657320696e206f757470757444617461206f6e206c6f63616c206465766e65742e
```

Decoded text:

```text
CKB cell proof: data lives in outputData on local devnet.
```

### Building the Transaction

Sender address:

```text
ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqvarm0tahu0qfkq6ktuf3wd8azaas0h24c9myfz6
```

Transaction hash:

```text
0xc7ef814257196daaad7f35cb9629a91bb66ee690a84b47cd7678af81a9347f33
```

Output data:

```text
0x434b422063656c6c2070726f6f663a2064617461206c6976657320696e206f757470757444617461206f6e206c6f63616c206465766e65742e
```

### Retrieving Live Cell Data

Out point:

```text
0xc7ef814257196daaad7f35cb9629a91bb66ee690a84b47cd7678af81a9347f33:0x0
```

Live cell data:

```text
0x434b422063656c6c2070726f6f663a2064617461206c6976657320696e206f757470757444617461206f6e206c6f63616c206465766e65742e
```

Decoded live cell message:

```text
CKB cell proof: data lives in outputData on local devnet.
```

## Reflection

Add your own reflection before submitting the campaign entry. Suggested points to cover in your own words:

- What you learned about the CKB Cell model.
- What stood out about storing data in `outputData`.
- Any setup or debugging detail you personally experienced, such as keeping OffCKB devnet running and using `NETWORK=devnet`.
- How retrieving a Live Cell by `OutPoint` helped connect the write/read flow.
