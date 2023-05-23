import { Box, Heading } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { web3, utils, BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { AppBar } from '../components/AppBar';
import { CertificationEnrollment } from '../components/CertificationEnrollment';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import useAnchorProgram from '../hooks/useAnchorProgram';
import useAnchorProvider from '../hooks/useAnchorProvider';
import styles from '../styles/Home.module.css';

const AddRequirements: NextPage = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useAnchorProvider(connection, wallet);
  const program = useAnchorProgram(provider);

  const certificationAddress: string =
    'Hrzx3iPMHuteyyRE9uzoYCHMYmkEvNAe4a8Z3spACQak';

  return (
    <div className={styles.App}>
      <Head>
        <title>Vanward - Enroll</title>
      </Head>
      <AppBar />
      <Box>
        <Heading as='h1' size='xl' ml={8} mt={8}>
          Enroll
        </Heading>
        <Box p={12}>
          <CertificationEnrollment />
        </Box>
      </Box>
    </div>
  );
};

export default AddRequirements;
