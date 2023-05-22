import { FC } from 'react';
import { useState, useEffect } from 'react';
import { Box, Heading, Button, Text } from '@chakra-ui/react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { utils } from '@coral-xyz/anchor';
import useAnchorProgram from '../hooks/useAnchorProgram';
import useAnchorProvider from '../hooks/useAnchorProvider';
import { Certification } from '../types/certifications';

export const CertificationEnrollment: FC = () => {
  const [certification, setCertification] = useState<Certification>({});
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useAnchorProvider(connection, wallet);
  const program = useAnchorProgram(provider);

  const certificationAddress = new PublicKey(
    '59BrBEvT8SwRvEq3wnMYAkom29fss2MiFKjt6w3gqQ5R'
  );

  useEffect(() => {
    const getCert = async () => {
      return await program.account.certification.fetch(certificationAddress);
    };

    const cert = getCert().then((cert) => setCertification(cert));
  }, []);

  const handleEnroll = async (event: any) => {
    console.log(
      `Enrolling ${wallet.publicKey} in certification ${certification.id}`
    );

    const [enrollmentPda, enrollBump] = await PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode('enroll'),
        provider.wallet.publicKey.toBuffer(),
        certificationAddress.toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .enroll()
      .accounts({
        enrollment: enrollmentPda,
        user: provider.wallet.publicKey,
        certification: certificationAddress,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    let enrollAccount = await program.account.enrollment.fetch(
      enrollmentPda.toString()
    );

    console.log('Enrollment Account', enrollAccount);
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
        {certification?.year && (
          <Text fontSize={18} mg={6}>
            <Text as='span' fontWeight={500}>
              Year:
            </Text>{' '}
            {certification?.year}
          </Text>
        )}
        <Button
          width='200px'
          colorScheme='orange'
          mt={4}
          onClick={handleEnroll}
        >
          Enroll
        </Button>
      </Box>
    </>
  );
};
