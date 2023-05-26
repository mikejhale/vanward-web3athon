import { Box, Heading, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { AppBar } from '../components/AppBar';
import { useRouter } from 'next/router';
import { EnrolleeList } from '../components/EnrolleeList';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from '../styles/Home.module.css';

const AddRequirements: NextPage = () => {
  const wallet = useWallet();
  const router = useRouter();
  const certificationId = router.query.cert?.toString() as string;

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
