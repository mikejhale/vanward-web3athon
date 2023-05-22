import { Box, Heading } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { web3, utils, BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { AppBar } from '../components/AppBar';
import { useRouter } from 'next/router';
import { EnrolleeList } from '../components/EnrolleeList';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import useAnchorProgram from '../hooks/useAnchorProgram';
import useAnchorProvider from '../hooks/useAnchorProvider';
import styles from '../styles/Home.module.css';

const AddRequirements: NextPage = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useAnchorProvider(connection, wallet);
  const program = useAnchorProgram(provider);
  const router = useRouter();
  const certification = router.query.cert?.toString() as string;

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
            <EnrolleeList certification={certification} />
          ) : null}
        </Box>
      </Box>
    </div>
  );
};

export default AddRequirements;
