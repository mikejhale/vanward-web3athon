import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Divider,
  Icon,
  IconButton,
  Card,
  CardBody,
  CardFooter,
  Heading,
  propNames,
} from '@chakra-ui/react';
import { ProgramAccount, web3, utils, BN } from '@coral-xyz/anchor';
import NextLink from 'next/link';
import { FC } from 'react';
import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { RiCloseCircleLine, RiCheckboxCircleLine } from 'react-icons/ri';
import useAnchorProgram from '../hooks/useAnchorProgram';
import useAnchorProvider from '../hooks/useAnchorProvider';
import useMemcmp from '../hooks/useMemcmp';
import { CertificationCard } from './CertificationCard';
import { CertificationType } from '../types/certifications';

type EnrolleeProps = {
  enrollee: string;
  certification: string;
};

type CompletedRequirement = {
  requirement: ProgramAccount;
  completed: boolean;
};

export const CompletedRequirementsList = (props: EnrolleeProps) => {
  const [completedReqs, setCompletedReqs] = useState<CompletedRequirement[]>(
    []
  );
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useAnchorProvider(connection, wallet);
  const program = useAnchorProgram(provider);
  const reqFilter = useMemcmp(40, provider.wallet.publicKey.toBase58());

  useEffect(() => {
    const getRequirements = async () => {
      return await program.account.requirement.all(reqFilter);
    };

    const getCompletedRequirements = async () => {
      const reqs = await getRequirements();
      let completedReqsList: CompletedRequirement[] = [];

      for (const r of reqs) {
        let cr: CompletedRequirement = { requirement: r, completed: false };

        const [completePda, completeBump] =
          await PublicKey.findProgramAddressSync(
            [
              utils.bytes.utf8.encode('complete'),
              new PublicKey(props.enrollee).toBuffer(),
              r.publicKey.toBuffer(),
            ],
            program.programId
          );

        //console.log(new PublicKey(props.enrollee).toBuffer());
        //console.log(r.publicKey.toBuffer());
        console.log(completePda.toString());

        const completion = await program.account.completion.fetchNullable(
          completePda
        );

        if (completion) {
          cr.completed = true;
        }

        completedReqsList.push(cr);
      }

      //const completedReqs = reqs.filter((r) => r.completed);
      setCompletedReqs(completedReqsList);
    };

    // for each requirement:

    // get for enrollee

    //getRequirements().then((reqs) => setRequirements(reqs));

    getCompletedRequirements();
  }, []);

  console.log(completedReqs);

  return (
    <Flex>
      <HStack flex='1' align='middle'>
        {completedReqs.map((r) => (
          <>
            <Text key={r.requirement.account.publicKey}>
              {r.requirement.account.module}
            </Text>
            <Icon
              color='red'
              as={r.completed ? RiCheckboxCircleLine : RiCloseCircleLine}
            />
          </>
        ))}
      </HStack>
    </Flex>
  );
};
