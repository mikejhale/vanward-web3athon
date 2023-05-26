import {
  Link,
  Flex,
  VStack,
  HStack,
  Text,
  Divider,
  IconButton,
  Card,
  CardBody,
  CardFooter,
  Heading,
} from '@chakra-ui/react';
import { ProgramAccount } from '@coral-xyz/anchor';
import NextLink from 'next/link';
import { RiEdit2Line, RiPlayListAddLine, RiTeamLine } from 'react-icons/ri';

type CertCardProps = {
  id: string;
  year: number;
  title: string;
  address: string;
  requirements?: ProgramAccount[];
};

export const CertificationCard = (props: CertCardProps) => {
  return (
    <Card variant='outline' maxW={640} mb={4}>
      <CardBody>
        <Flex>
          <VStack flex='1' align='flex-start'>
            <Heading as='h2' size='md'>
              {props.title}
            </Heading>
            <HStack alignItems='flex-start'>
              <Text fontWeight={500}>{props.id}</Text>
              {props.year && <Text flex={1}>{props.year}</Text>}
              <NextLink href={'/enroll?cert=' + props.address} passHref>
                <Link color='orange.600'>Enroll</Link>
              </NextLink>
            </HStack>
          </VStack>
          <NextLink href={'/add-certification?cert=' + props.address} passHref>
            <IconButton
              hidden={true}
              variant='outline'
              title='Edit'
              icon={<RiEdit2Line />}
              size='lg'
              aria-label='Edit'
              mr={4}
              colorScheme='orange'
            />
          </NextLink>
          <NextLink href={'/add-requirements?cert=' + props.address} passHref>
            <IconButton
              variant='outline'
              icon={<RiPlayListAddLine />}
              size='lg'
              aria-label='Add Requirement'
              title='Add Requirement'
              mr={4}
              colorScheme='orange'
            />
          </NextLink>
          <NextLink href={'/enrollees?cert=' + props.address} passHref>
            <IconButton
              variant='outline'
              icon={<RiTeamLine />}
              size='lg'
              aria-label='Enrollees'
              title='Enrollees'
              mr={4}
              colorScheme='orange'
            />
          </NextLink>
        </Flex>
      </CardBody>
      <Divider />
      <CardFooter>
        <VStack align='flex-start'>
          <Heading as='h3' size='sm' mb={2}>
            Requirements
          </Heading>
          {props.requirements?.map((r) => (
            <Text key={r.account.module}>
              <strong>{r.account.module}</strong>: {r.account.credits} Credit
              {r.account.credits > 1 ? 's' : ''}
            </Text>
          ))}
        </VStack>
      </CardFooter>
    </Card>
  );
};
