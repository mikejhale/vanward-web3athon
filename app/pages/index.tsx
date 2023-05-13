import { Box, Heading } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { AppBar } from '../components/AppBar';
import { CertificationList } from '../components/CertificationList';
import styles from '../styles/Home.module.css';
import { useWallet } from '@solana/wallet-adapter-react';

const Home: NextPage = () => {
  const { publicKey } = useWallet();
  return (
    <div className={styles.App}>
      <Head>
        <title>Vanward</title>
      </Head>
      <AppBar />
      <Box>
        <Heading as='h1' size='l' ml={4} mt={8}>
          Certifications
        </Heading>
        {publicKey ? <CertificationList /> : null}
      </Box>
    </div>
  );
};

export default Home;
