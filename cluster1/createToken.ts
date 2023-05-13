import {
	Transaction,
	clusterApiUrl,
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
	sendAndConfirmTransaction,
	PublicKey,
} from '@solana/web3.js';
import * as token from "@solana/spl-token" ;
import wallet from '../wba-wallet.json';

// Create a keypair to use as a mint acc 


(async () => {
  // let mintAccount =  new Keypair() ;

 const connection = new Connection(clusterApiUrl('devnet'),'confirmed');
 // iniitialize a mint  account set wallet to authority 
 const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
 
 let mint = await token.createMint(
    connection,	
	  keypair,
		keypair.publicKey,
		keypair.publicKey,
    6, 
	);

  console.log("The mint is ", mint.toString())

  let associatedAccount = await token.createAssociatedTokenAccount(connection,keypair,mint,keypair.publicKey);

  let t  = await  token.mintTo(
    connection,
    keypair,
    mint,
    associatedAccount,
    keypair.publicKey,  
    10000000 
  ) ;

  console.log('The ata  is:', associatedAccount.toString());

  console.log(`Success! Check out your TX here:
      https://explorer.solana.com/tx/${t}?cluster=devnet`);

 
  }
// Wallet key to use for creating an associated account 
)();
