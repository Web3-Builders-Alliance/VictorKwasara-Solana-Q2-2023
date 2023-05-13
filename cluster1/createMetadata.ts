import {
	Transaction,
	clusterApiUrl,
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
	sendAndConfirmTransaction,
	PublicKey,
} from '@solana/web3.js';
import * as token from '@solana/spl-token';
import wallet from '../wba-wallet.json';
import {
	createCreateMetadataAccountV2Instruction,
  CreateMetadataAccountInstructionAccounts,
  CreateMetadataAccountV3InstructionAccounts,
	createCreateMetadataAccountV3Instruction,
  CreateMetadataAccountV3InstructionArgs,
  DataV2
} from '@metaplex-foundation/mpl-token-metadata';


const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
 // Add the Token Metadata Progra
const token_metadata_program_id = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

let nft_mint = new PublicKey('3jfuH9Eyx28exkT8UK6stRYXDPAtZAXhKw5UJFhmnBU6');
let from_ata = new PublicKey('C1rq6rBEAzwJAyAVFUe3rsK9HS2FsAGCoRTRa8cDv4gv');


( async () => {
  //create authority 
    let authority = Keypair.fromSecretKey(new Uint8Array(wallet));

    const seeds = [
      Buffer.from("metadata"),
      token_metadata_program_id.toBuffer(),
      nft_mint.toBuffer(), 
    ];

    const [metadata_pda] = PublicKey.findProgramAddressSync(seeds, token_metadata_program_id);
   
    let accounts : CreateMetadataAccountV3InstructionAccounts = {
				metadata: metadata_pda,
				mint: nft_mint,
				mintAuthority: authority.publicKey,
				payer: authority.publicKey,
				updateAuthority: authority.publicKey,
			};

    let data: DataV2 = {
				name: 'Mutohwe',
				symbol: 'Mth',
				uri: '',
				sellerFeeBasisPoints: 1000,
				creators: [
					{ address: authority.publicKey, verified: true, share: 100 },
				],
				collection: null,
				uses: null,
		};

    let args: CreateMetadataAccountV3InstructionArgs = {
			createMetadataAccountArgsV3: {
				data,
				isMutable: true,
				collectionDetails: null,
			},
		}; ;

  // create meta data for the mint 
    const instruction = createCreateMetadataAccountV3Instruction(
			 accounts,
			 args
		);

    let tx = new Transaction().add(instruction);

    let hash = await sendAndConfirmTransaction(connection, tx,[authority]);
    
	 console.log(`Success! Check out your TX here:
      https://explorer.solana.com/tx/${hash.toString()}?cluster=devnet`);
 }
)();
