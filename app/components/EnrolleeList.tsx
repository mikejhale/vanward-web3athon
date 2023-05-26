import { FC } from 'react';
import { useState, useEffect } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ProgramAccount } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import useAnchorProgram from '../hooks/useAnchorProgram';
import useAnchorProvider from '../hooks/useAnchorProvider';
import useMemcmp from '../hooks/useMemcmp';
import { EnrolleeCard } from './EnrolleeCard';

type EnrolleeListProps = {
  certification: string;
};

export const EnrolleeList = (props: EnrolleeListProps) => {
  const [enrollees, setEnrollees] = useState<ProgramAccount[]>([]);
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

    console.log('enrollees', enrollees);

    getEnrollees().then((e) => setEnrollees(e));
  }, []);

  return (
    <Box p={12}>
      {enrollees.length > 0 ? (
        enrollees.map((c) => (
          <EnrolleeCard
            key={c.account.owner.toString()}
            enrollee={c.account.owner.toString()}
            enrollment={c.publicKey.toString()}
            certification={c.account.certification.toString()}
          />
        ))
      ) : (
        <Text fontSize={18}>
          There are no enrollees to this Certification yet
        </Text>
      )}
    </Box>
  );
};
