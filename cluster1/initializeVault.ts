import { Connection, Keypair, SystemProgram, PublicKey } from '@solana/web3.js';
import {
	Program,
	Wallet,
	AnchorProvider,
	Address,
	BN,
} from '@project-serum/anchor';
import { WbaVault, IDL } from '../programs/wba_vault';
import wallet from '../wba-wallet.json';
import vaultS from './wba-vault.json';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as token from '@solana/spl-token';

//We're going to import our keypair from the wallet file 
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a devnet connection 
const connection = new Connection("https://api.devnet.solana.com");

const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: 'confirmed',
});

//Create our program 
const program = new Program<WbaVault>(
  IDL,
	'D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o' as Address,
	provider
  );
  
  const programId = new PublicKey('D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o');
  
  const vaultState = Keypair.fromSecretKey(new Uint8Array(vaultS));
  
  
  const vaultAuth = PublicKey.findProgramAddressSync([Buffer.from("auth"), vaultState.publicKey.toBuffer()], programId)[0];
  
  const vault = PublicKey.findProgramAddressSync([Buffer.from("vault"), vaultAuth.toBuffer()], programId)[0];
  
 ( async () => {
  console.log('Inside the initialize function');

  const tx =  await program.methods.initialize(
  ).accounts({
    owner: keypair.publicKey,
    vaultState: vaultState.publicKey,
    vaultAuth,
    vault,   
  }).signers([vaultState]).rpc() ;

  console.log(
		`The Account has been initialized, checkout the explorer! https://explorer.solana.com/tx/${tx.toString()}?cluster=devnet`
	);

})();