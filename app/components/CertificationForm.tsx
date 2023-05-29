import { FC } from 'react';
import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { web3, utils, BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import useAnchorProgram from '../hooks/useAnchorProgram';
import useAnchorProvider from '../hooks/useAnchorProvider';
import { useRouter } from 'next/router';

export const CertificationForm: FC = () => {
  const router = useRouter();
  const [certId, setCertId] = useState('');
  const [certYear, setCertYear] = useState('');
  const [certTitle, setCertTitle] = useState('');
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useAnchorProvider(connection, wallet);
  const program = useAnchorProgram(provider);

  const handleAddCert = async (event: any) => {
    event.preventDefault();

    const [certificationPda, certBump] = await PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode('certification'),
        utils.bytes.utf8.encode(certId),
        new BN(certYear).toArrayLike(Buffer, 'le', 2),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .addCertification(certId, certYear, certTitle)
      .accounts({
        certification: certificationPda,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log('Account Created (Certification)', certificationPda);
    router.push('/add-requirements?cert=' + certificationPda);
  };

  return (
    <>
      <Box
        p={4}
        display={{ md: 'flex' }}
        bgColor='#fff'
        borderRadius={14}
        margin={2}
      >
        <form onSubmit={handleAddCert}>
          <FormControl mb={6} isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              width='600px'
              id='certTitle'
              value={certTitle}
              maxLength={120}
              onChange={(event) => setCertTitle(event.currentTarget.value)}
            />
          </FormControl>

          <FormControl mb={6} isRequired>
            <FormLabel>ID</FormLabel>
            <Input
              width='260px'
              id='certId'
              value={certId}
              maxLength={24}
              onChange={(event) => setCertId(event.currentTarget.value)}
            />
          </FormControl>

          <FormControl mb={6}>
            <FormLabel>Year</FormLabel>
            <Input
              id='certYear'
              width='80px'
              value={certYear}
              min={2023}
              max={2173}
              type='number'
              onChange={(event) => setCertYear(event.currentTarget.value)}
            />
          </FormControl>

          <Button width='200px' colorScheme='orange' mt={4} type='submit'>
            Add Certification
          </Button>
        </form>
      </Box>
    </>
  );
};
