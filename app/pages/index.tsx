import { Box, Heading, Alert, AlertIcon, Text } from '@chakra-ui/react';
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
        <title>Vanward - Certifications</title>
      </Head>
      <AppBar />
      <Box>
        <Alert p={6} status='warning'>
          <AlertIcon />
          You must be on Devnet for testing
        </Alert>
        <Heading as='h1' size='xl' ml={8} mt={8}>
          Certifications
        </Heading>

        {publicKey ? (
          <CertificationList />
        ) : (
          <Text mt={8} ml={8}>
            Connect your wallet first
          </Text>
        )}
      </Box>
    </div>
  );
};

export default Home;
