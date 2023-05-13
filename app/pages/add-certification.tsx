import { Box, Heading } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { AppBar } from '../components/AppBar';
import { CertificationForm } from '../components/CertificationForm';
import styles from '../styles/Home.module.css';
import { useWallet } from '@solana/wallet-adapter-react';

const AddCertification: NextPage = () => {
  const { publicKey } = useWallet();
  return (
    <div className={styles.App}>
      <Head>
        <title>Vanward</title>
      </Head>
      <AppBar />
      <Box p={12}>
        <Heading as='h1' size='l' ml={4} mt={8}>
          Add Certification
        </Heading>
        <CertificationForm />
      </Box>
    </div>
  );
};

export default AddCertification;
