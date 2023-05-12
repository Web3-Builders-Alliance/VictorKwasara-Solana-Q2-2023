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
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as token from '@solana/spl-token';
import vaultS from './wba-vault.json';

//We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a devnet connection
const connection = new Connection('https://api.devnet.solana.com');

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

console.log("vaul state =========== " , vaultState.publicKey.toString());

const vaultAuth = PublicKey.findProgramAddressSync(
	[Buffer.from('auth'), vaultState.publicKey.toBuffer()],
	programId
)[0];

const vault = PublicKey.findProgramAddressSync(
	[Buffer.from('vault'), vaultAuth.toBuffer()],
	programId
)[0];

let mint = new PublicKey('GHjdqeHLqEobRYDEeoYEY5ECxjeFkDRZarstCMKetWax');
let from_ata = new PublicKey('5harpvYMm4QCNiVaHb5Sg7RqDaC6ey9QbEuCDcwwpTHy');

(async () => {
	let m = await token.getMint(provider.connection, mint);
	console.log('The mint account info: ===> ', m);
	let ata = await token.getAccount(provider.connection, from_ata);
	console.log('The ata account info: ===> ', ata);

	let vaultAta = await token.getOrCreateAssociatedTokenAccount(
		provider.connection,
		keypair,
		mint,
		vaultAuth,
		true
	);

	let va = await token.getAccount(provider.connection, vaultAta.address);
	console.log('The vaultAta account info: ===> ', va);

	const tx = await program.methods
		.withdrawSpl(new BN(100000))
		.accounts({
			owner: keypair.publicKey,
			ownerAta: from_ata,
			vaultState: vaultState.publicKey,
			tokenMint: mint,
			vaultAuth,
			vaultAta: vaultAta.address,
			tokenProgram: token.TOKEN_PROGRAM_ID,
			associatedTokenProgram: token.ASSOCIATED_TOKEN_PROGRAM_ID,
			systemProgram: SystemProgram.programId,
		})
		.signers([keypair])
		.rpc();
	console.log(
		`The tokens have been withdrawn, checkout the explorer! https://explorer.solana.com/tx/${tx.toString()}?cluster=devnet`
	);
})();
