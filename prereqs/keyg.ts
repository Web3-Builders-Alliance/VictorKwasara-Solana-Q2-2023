import {Keypair, PublicKey} from "@solana/web3.js";
import * as dotenv from 'dotenv';
import fs from "fs" ;
import bs58 from "bs58";
dotenv.config() ;
if (process.env.SECRET_KEY != null) {
  let sk = bs58.decode(process.env.SECRET_KEY);
     fs.writeFileSync(
				'../wba-wallet.json',
				`[${Keypair.fromSecretKey(sk).secretKey}]`
			);
}









