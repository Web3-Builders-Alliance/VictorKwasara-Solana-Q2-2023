import {Keypair} from "@solana/web3.js";
import fs from "fs" ;

let paths = ['./cluster1/wba-vault.json'];
//Generate a new Keypair 
let kp = Keypair.generate() ;

console.log(`You've generated a new Solana wallet: ${kp.publicKey.toBase58()}
To save your wallet, copy and paste the following into a JSON file:

[${kp.secretKey}]
`)

fs.writeFileSync('./cluster1/wba-vault.json', `[${kp.secretKey}]`);