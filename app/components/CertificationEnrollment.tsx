import { FC } from 'react';
import { useState, useEffect } from 'react';
import { Box, Heading, Button, Text } from '@chakra-ui/react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { utils } from '@coral-xyz/anchor';
import useAnchorProgram from '../hooks/useAnchorProgram';
import useAnchorProvider from '../hooks/useAnchorProvider';
import { useRouter } from 'next/router';

export const CertificationEnrollment: FC = () => {
  const [certification, setCertification] = useState<any>({});
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useAnchorProvider(connection, wallet);
  const program = useAnchorProgram(provider);
  const router = useRouter();

  const certQuery: string = router.query.cert as string;
  console.log(certQuery);

  useEffect(() => {
    if (certQuery) {
      const getCert = async () => {
        return await program.account.certification.fetch(
          new PublicKey(certQuery)
        );
      };

      const cert = getCert().then((cert) => setCertification(cert));
    }
  }, [certQuery]);

  const handleEnroll = async (event: any) => {
    console.log(
      `Enrolling ${wallet.publicKey} in certification ${certification.id}`
    );

    const [enrollmentPda, enrollBump] = await PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode('enroll'),
        provider.wallet.publicKey.toBuffer(),
        new PublicKey(certQuery).toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .enroll()
      .accounts({
        enrollment: enrollmentPda,
        user: provider.wallet.publicKey,
        certification: new PublicKey(certQuery),
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    let enrollAccount = await program.account.enrollment.fetch(
      enrollmentPda.toString()
    );

    console.log('Enrollment Account', enrollAccount);
    router.push('/');
  };

  return (
    <>
      <Box
        p={4}
        display={{ md: 'flex', direction: 'collumn' }}
        bgColor='#fff'
        borderRadius={14}
        margin={2}
      >
        <Heading mb={4} as='h2' size='lg'>
          {certification?.title}
        </Heading>
        <Text fontSize={18} mb={2}>
          <Text as='span' fontWeight={500}>
            ID:
          </Text>{' '}
          {certification?.id}
        </Text>

        {certQuery ? (
          <Button
            width='200px'
            colorScheme='orange'
            mt={4}
            onClick={handleEnroll}
          >
            Enroll
          </Button>
        ) : (
          <Text>Missing Certification id</Text>
        )}
      </Box>
    </>
  );
};
