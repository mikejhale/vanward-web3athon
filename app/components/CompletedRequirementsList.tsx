import { Flex, HStack, Text, Icon, Button } from '@chakra-ui/react';
import { ProgramAccount, web3, utils, BN } from '@coral-xyz/anchor';
import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { RiCheckboxCircleLine, RiCheckLine } from 'react-icons/ri';
import useAnchorProgram from '../hooks/useAnchorProgram';
import useAnchorProvider from '../hooks/useAnchorProvider';
import useMemcmp from '../hooks/useMemcmp';
import { set } from '@coral-xyz/anchor/dist/cjs/utils/features';

type EnrolleeProps = {
  enrollee: string;
  enrollment: string;
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
  const reqFilter = useMemcmp(8, new PublicKey(props.certification).toBase58());
  const [reload, setReload] = useState<boolean>(false);

  //console.log(new PublicKey(props.certification).toBase58());

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
              new PublicKey(props.enrollment).toBuffer(),
              r.publicKey.toBuffer(),
            ],
            program.programId
          );

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

    getCompletedRequirements();
  }, [reload]);

  const markComplete = async (requirement: string) => {
    const [completePda, completeBump] = await PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode('complete'),
        new PublicKey(props.enrollment).toBuffer(),
        new PublicKey(requirement).toBuffer(),
      ],
      program.programId
    );

    console.log('enrollment', props.enrollment);
    console.log('req', requirement);
    console.log('completePda', completePda.toString());

    const tx = await program.methods
      .complete()
      .accounts({
        completion: completePda,
        user: provider.wallet.publicKey,
        owner: props.enrollment,
        requirement: requirement,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    setReload(!reload);
  };

  console.log(props);

  return (
    <Flex direction={'column'} width='100%'>
      {completedReqs.map((r) => (
        <HStack
          mb={6}
          alignItems='center'
          key={r.requirement.publicKey.toString()}
        >
          <HStack flexGrow='1'>
            <Text fontSize={'lg'}>{r.requirement.account.module}</Text>
            {r.completed ? (
              <Icon boxSize={6} color='orange.600' as={RiCheckboxCircleLine} />
            ) : null}
          </HStack>
          {!r.completed ? (
            <Button
              variant='outline'
              flexGrow='1'
              maxWidth={160}
              colorScheme={'orange'}
              leftIcon={<RiCheckLine />}
              onClick={async () => {
                markComplete(r.requirement.publicKey.toString());
              }}
            >
              Mark Complete
            </Button>
          ) : (
            ''
          )}
        </HStack>
      ))}
    </Flex>
  );
};
