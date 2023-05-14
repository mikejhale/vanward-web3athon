import { FC } from 'react';
import { useState, useEffect } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ProgramAccount } from '@coral-xyz/anchor';
import NextLink from 'next/link';
import useAnchorProgram from '../hooks/useAnchorProgram';
import useAnchorProvider from '../hooks/useAnchorProvider';
import useMemcmp from '../hooks/useMemcmp';
import { CertificationCard } from './CertificationCard';

export const CertificationRequirementsList: FC = () => {
  const [certifications, setCertifications] = useState<ProgramAccount[]>([]);
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useAnchorProvider(connection, wallet);
  const program = useAnchorProgram(provider);
  const certFilter = useMemcmp(8, provider.wallet.publicKey.toBase58());

  useEffect(() => {
    console.log('getting certifications...');
    program.account.certification.all(certFilter).then((certs) => {
      setCertifications(certs);

      certs.forEach((c) => {
        const reqFilter = [
          {
            memcmp: {
              offset: 8,
              bytes: c.publicKey.toBase58(),
            },
          },
        ];

        program.account.requirement.all(reqFilter).then((reqs) => {
          console.log(reqs);
        });
      });
    });
  }, []);

  const handleAddNewCertification = () => {
    console.log('add new certification');
  };

  return (
    <Box p={12}>
      <NextLink href='/add-certification' passHref>
        <Button colorScheme={'orange'} mb={8}>
          Add New Certification
        </Button>
      </NextLink>
      {certifications.length > 0 ? (
        certifications.map((c) => (
          <CertificationCard
            key={c.account.id}
            id={c.account.id}
            year={c.account.year}
            title={c.account.title}
            address={c.publicKey.toString()}
            requirements={c.requirements}
          />
        ))
      ) : (
        <Text fontSize={18}>You haven&apos;t added any Certifications yet</Text>
      )}
    </Box>
  );
};
