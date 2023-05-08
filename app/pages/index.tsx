import { Center, Box, Heading } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { AppBar } from '../components/AppBar';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.App}>
      <Head>
        <title>Vanward</title>
      </Head>
      <AppBar />
      <Center>
        <Box>
          <Heading as='h1' size='l' color='white' ml={4} mt={8}>
            Manage Certifications
          </Heading>
        </Box>
      </Center>
    </div>
  );
};

export default Home;
