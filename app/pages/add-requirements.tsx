import { Box, Heading } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { AppBar } from '../components/AppBar';
import { RequirementForm } from '../components/RequirementForm';
import styles from '../styles/Home.module.css';

const AddRequirements: NextPage = () => {
  return (
    <div className={styles.App}>
      <Head>
        <title>Vanward - Certification Requirements</title>
      </Head>
      <AppBar />
      <Box>
        <Heading as='h1' size='xl' ml={8} mt={8}>
          Add Requirement
        </Heading>
        <Box p={12}>
          <RequirementForm />
        </Box>
      </Box>
    </div>
  );
};

export default AddRequirements;
