const { ccc } = require("@ckb-ccc/core");
const systemScripts = require("./system-scripts.json");

const DEVNET_SCRIPTS = {
  [ccc.KnownScript.Secp256k1Blake160]:
    systemScripts.devnet.secp256k1_blake160_sighash_all.script,
  [ccc.KnownScript.Secp256k1Multisig]:
    systemScripts.devnet.secp256k1_blake160_multisig_all.script,
  [ccc.KnownScript.AnyoneCanPay]: systemScripts.devnet.anyone_can_pay.script,
  [ccc.KnownScript.OmniLock]: systemScripts.devnet.omnilock.script,
  [ccc.KnownScript.XUdt]: systemScripts.devnet.xudt.script,
  [ccc.KnownScript.NervosDao]: systemScripts.devnet.dao.script,
};

const client = new ccc.ClientPublicTestnet({
  url: "http://localhost:28114",
  scripts: DEVNET_SCRIPTS,
});

const accounts = [
  {
    label: "store-data-on-cell",
    privateKey:
      "0x59ddda57ba06d6e9c5fa9040bdb98b4b098c2fce6520d39f51bc5e825364697a",
    message:
      process.env.MESSAGE ||
      "CKB cell proof: data lives in outputData on local devnet.",
  },
];

function utf8ToHex(utf8String) {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(utf8String);
  return (
    "0x" +
    Array.prototype.map
      .call(uint8Array, (byte) => ("0" + (byte & 0xff).toString(16)).slice(-2))
      .join("")
  );
}

function hexToUtf8(hexString) {
  const decoder = new TextDecoder("utf-8");
  const bytes = hexString.match(/[\da-f]{2}/gi) || [];
  return decoder.decode(new Uint8Array(bytes.map((h) => parseInt(h, 16))));
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForLiveCell(txHash, index = "0x0") {
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const cell = await client.getCellLive({ txHash, index }, true);
    if (cell) return cell;
    await sleep(1000);
  }

  throw new Error(`Live cell not found for ${txHash}:${index}`);
}

async function runProof({ label, privateKey, message }) {
  const encoded = utf8ToHex(message);
  const decoded = hexToUtf8(encoded);
  const signer = new ccc.SignerCkbPrivateKey(client, privateKey);
  const address = await signer.getAddressObjSecp256k1();
  const balance = await client.getBalance([address.script]);

  console.log(`\n=== ${label} ===`);
  console.log("[1] Encode and decode message");
  console.log(`message: ${message}`);
  console.log(`encoded hex: ${encoded}`);
  console.log(`decoded text: ${decoded}`);

  console.log("\n[2] Building the transaction");
  console.log(`sender address: ${address.toString()}`);
  console.log(`balance before: ${balance.toString()} shannons`);

  const tx = ccc.Transaction.from({
    outputs: [{ lock: address.script }],
    outputsData: [encoded],
  });

  await tx.completeInputsByCapacity(signer);
  await tx.completeFeeBy(signer, 1000);

  console.log(`output[0].data: ${tx.outputsData[0]}`);
  console.log(`outputs count: ${tx.outputs.length}`);

  const txHash = await signer.sendTransaction(tx);
  console.log(`tx hash: ${txHash}`);

  console.log("\n[3] Retrieving Live Cell data");
  const cell = await waitForLiveCell(txHash, "0x0");
  const liveData = cell.outputData;
  console.log(`out point: ${txHash}:0x0`);
  console.log(`live cell data: ${liveData}`);
  console.log(`decoded live cell message: ${hexToUtf8(liveData)}`);
}

async function main() {
  console.log("Store Data on Cell campaign proof");
  console.log(`devnet RPC: http://localhost:28114`);
  console.log(`created at: ${new Date().toISOString()}`);

  for (const account of accounts) {
    await runProof(account);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
