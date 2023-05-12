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
	createCreateMetadataAccountV3Instruction,
   CreateMetadataAccountV3InstructionArgs
} from '@metaplex-foundation/mpl-token-metadata';
import { connect } from 'http2';
 const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
 // Add the Token Metadata Program
const token_metadata_program_id = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
( async () => {
  //create authority 
  let authority = Keypair.fromSecretKey(new Uint8Array(wallet));
  
  //create nft mint
  let nft_mint = await token.createMint(
    connection,
    authority,
    authority.publicKey,
    authority.publicKey,
    0
    );
    const seeds = [
      Buffer.from("metadata"),
      token_metadata_program_id.toBuffer(),
      nft_mint.toBuffer(), 
    ];

    const [metadata_pda] = PublicKey.findProgramAddressSync(seeds, token_metadata_program_id);

  // create meta data for the mint 
    const instruction = createCreateMetadataAccountV3Instruction(
			{
				metadata: metadata_pda,
				mint: nft_mint,
				mintAuthority: authority.publicKey,
				payer: authority.publicKey,
				updateAuthority: authority.publicKey,
			},
			{
				CreateMetadataAccountArgsV3 :{

        },
				isMutable: true,
			}
		);


 }
)();
