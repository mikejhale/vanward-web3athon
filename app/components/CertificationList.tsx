import { FC } from 'react';
import { useState, useEffect } from 'react';
import { Box, Text, Button, Spinner } from '@chakra-ui/react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import NextLink from 'next/link';
import useAnchorProgram from '../hooks/useAnchorProgram';
import useAnchorProvider from '../hooks/useAnchorProvider';
import useMemcmp from '../hooks/useMemcmp';
import { CertificationCard } from './CertificationCard';
import { CertificationType } from '../types/certifications';

export const CertificationList: FC = () => {
  const [certifications, setCertifications] = useState<CertificationType[]>([]);
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useAnchorProvider(connection, wallet);
  const program = useAnchorProgram(provider);
  const certFilter = useMemcmp(8, provider.wallet.publicKey.toBase58());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let certsWithReqs: CertificationType[] = [];

    const getCerts = async () => {
      return await program.account.certification.all(certFilter);
    };

    const getReqs = async () => {
      const certs = await getCerts();

      for (const c of certs) {
        let cr: CertificationType = { certification: c };

        const reqFilter = [
          {
            memcmp: {
              offset: 8,
              bytes: c.publicKey.toBase58(),
            },
          },
        ];

        cr.requirements = await program.account.requirement.all(reqFilter);

        certsWithReqs.push(cr);
      }
      setCertifications(certsWithReqs);
      setIsLoading(false);
    };

    getReqs();
  }, []);

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
            key={c.certification.account.id}
            id={c.certification.account.id}
            year={c.certification.account.year}
            title={c.certification.account.title}
            address={c.certification.publicKey.toString()}
            requirements={c.requirements}
          />
        ))
      ) : (
        <Text fontSize={18}>You haven&apos;t added any Certifications yet</Text>
      )}
    </Box>
  );
};
