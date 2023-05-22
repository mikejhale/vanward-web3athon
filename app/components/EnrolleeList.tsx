import { FC } from 'react';
import { useState, useEffect } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ProgramAccount } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import NextLink from 'next/link';
import useAnchorProgram from '../hooks/useAnchorProgram';
import useAnchorProvider from '../hooks/useAnchorProvider';
import useMemcmp from '../hooks/useMemcmp';
import { CertificationCard } from './CertificationCard';
import { CertificationType } from '../types/certifications';
import { createSecretKey } from 'crypto';

type EnrolleeListProps = {
  certification: string;
};

export const EnrolleeList = (props: EnrolleeListProps) => {
  const [enrollees, setEnrollees] = useState<Enrollee[]>([]);
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useAnchorProvider(connection, wallet);
  const program = useAnchorProgram(provider);
  const enrolleeFilter = useMemcmp(
    72,
    new PublicKey(props.certification).toBase58()
  );

  useEffect(() => {
    const getEnrollees = async () => {
      return await program.account.enrollment.all(enrolleeFilter);
    };

    getEnrollees().then((e) => setEnrollees(e));
  }, []);

  return (
    <Box p={12}>
      {enrollees.length > 0 ? (
        enrollees.map((c) => (
          <Text key={c.account.owner.toString()}>
            {c.account.owner.toString()}
          </Text>
        ))
      ) : (
        <Text fontSize={18}>You haven&apos;t added any Certifications yet</Text>
      )}
    </Box>
  );
};
