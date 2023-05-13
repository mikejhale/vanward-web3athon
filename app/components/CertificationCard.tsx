import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  IconButton,
  Card,
  CardBody,
  CardHeader,
  Heading,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { RiEdit2Line, RiListSettingsFill } from 'react-icons/ri';

type CertCardProps = {
  id: string;
  year: number;
  title: string;
  address: string;
};

export const CertificationCard = (props: CertCardProps) => {
  return (
    <Card
      direction={{ base: 'row', sm: 'row' }}
      overflow='hidden'
      variant='outline'
      maxW={640}
      mb={4}
    >
      <CardBody>
        <Flex>
          <VStack flex='1' align='flex-start'>
            <Heading as='h2' size='md'>
              {props.title}
            </Heading>
            <HStack alignItems='flex-start'>
              <Text fontWeight={500}>{props.id}</Text>
              {props.year && <Text flex={1}>({props.year})</Text>}
            </HStack>
          </VStack>
          <NextLink href={'/add-certification?cert=' + props.address} passHref>
            <IconButton
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
              icon={<RiListSettingsFill />}
              size='lg'
              aria-label='Manage Requirements'
              title='Manage Requirements'
              mr={4}
              colorScheme='orange'
            />
          </NextLink>
        </Flex>
      </CardBody>
    </Card>
  );
};
