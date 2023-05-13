import { Box, Heading } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { AppBar } from '../components/AppBar';
import { CertificationForm } from '../components/CertificationForm';
import styles from '../styles/Home.module.css';

const AddRequirements: NextPage = () => {
  return (
    <div className={styles.App}>
      <Head>
        <title>Vanward</title>
      </Head>
      <AppBar />
      <Heading as='h1' size='l' ml={4} mt={8}>
        Certifications
      </Heading>
      <Box p={12}>ADD REQUIREMENTS</Box>
    </div>
  );
};

export default AddRequirements;
