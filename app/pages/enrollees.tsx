import { useState, useEffect } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { web3, utils, BN, ProgramAccount } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { AppBar } from '../components/AppBar';
import { useRouter } from 'next/router';
import { EnrolleeList } from '../components/EnrolleeList';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import useAnchorProgram from '../hooks/useAnchorProgram';
import useAnchorProvider from '../hooks/useAnchorProvider';
import styles from '../styles/Home.module.css';

const AddRequirements: NextPage = () => {
  const [certification, setCertification] = useState<ProgramAccount>();
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useAnchorProvider(connection, wallet);
  const program = useAnchorProgram(provider);
  const router = useRouter();
  const certificationId = router.query.cert?.toString() as string;

  useEffect(() => {
    const getCert = async () => {
      return await program.account.certification.fetch(certificationId);
    };

    const cert = getCert().then((cert) => setCertification(cert));
  }, []);

  return (
    <div className={styles.App}>
      <Head>
        <title>Vanward - Enrollees</title>
      </Head>
      <AppBar />
      <Box>
        <Heading as='h1' size='xl' ml={8} mt={8}>
          Enrollees
        </Heading>
        <Box p={12}>
          {wallet.publicKey ? (
            <EnrolleeList certification={certificationId} />
          ) : null}
        </Box>
      </Box>
    </div>
  );
};

export default AddRequirements;
