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
import { ProgramAccount } from '@coral-xyz/anchor';
import NextLink from 'next/link';
import { RiEdit2Line, RiPlayListAddLine, RiTeamLine } from 'react-icons/ri';
import { CompletedRequirementsList } from './CompletedRequirementsList';

type EnrolleeProps = {
  enrollee: string;
  certification: string;
};

export const EnrolleeCard = (props: EnrolleeProps) => {
  return (
    <Card variant='outline' maxW={640} mb={4}>
      <CardBody>
        <Flex>
          <VStack flex='1' align='flex-start'>
            <Heading as='h2' size='md'>
              {props.enrollee}
            </Heading>
          </VStack>
        </Flex>
      </CardBody>
      <Divider />
      <CardFooter>
        <VStack align='flex-start'>
          <Heading as='h3' size='sm' mb={2}>
            Completed Requirements:
          </Heading>
          <CompletedRequirementsList
            enrollee={props.enrollee}
            certification={props.certification.toString()}
          />
        </VStack>
      </CardFooter>
    </Card>
  );
};
