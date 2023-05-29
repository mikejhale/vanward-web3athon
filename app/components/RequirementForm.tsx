import { FC } from 'react';
import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { web3, utils, BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import useAnchorProgram from '../hooks/useAnchorProgram';
import useAnchorProvider from '../hooks/useAnchorProvider';
import { useRouter } from 'next/router';

export const RequirementForm: FC = () => {
  const router = useRouter();
  const [reqModule, setReqModule] = useState('');
  const [reqCredits, setReqCredits] = useState(1);
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useAnchorProvider(connection, wallet);
  const program = useAnchorProgram(provider);
  const certificationAddress = router.query.cert as string;

  // @todo: check for valid certification

  const handleAddReq = async (event: any) => {
    event.preventDefault();

    const [requirementPda, reqBump] = await PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode('requirement'),
        utils.bytes.utf8.encode(reqModule),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    console.log(certificationAddress);

    const tx = await program.methods
      .addRequirement(reqModule, reqCredits)
      .accounts({
        requirement: requirementPda,
        certification: new PublicKey(certificationAddress),
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log('Account Created (Requirement)', tx);
    router.push('/');
  };

  return (
    <>
      <Box p={4} display={{ md: 'flex' }} bgColor='#fff' margin={2}>
        <form onSubmit={handleAddReq}>
          <FormControl mb={6} isRequired>
            <FormLabel>Module</FormLabel>
            <Input
              id='module'
              value={reqModule}
              maxLength={24}
              onChange={(event) => setReqModule(event.currentTarget.value)}
            />
          </FormControl>

          <FormControl mb={6} isRequired>
            <FormLabel>Credits</FormLabel>
            <Input
              id='credits'
              value={reqCredits}
              min={1}
              max={1000}
              type='number'
              onChange={(event) =>
                setReqCredits(parseInt(event.currentTarget.value))
              }
            />
          </FormControl>
          <Button width='full' colorScheme='orange' mt={4} type='submit'>
            Add Requirement
          </Button>
        </form>
      </Box>
    </>
  );
};
