import { HStack } from '@chakra-ui/react';
import Link from 'next/link';

export const Nav = () => {
  return (
    <HStack fontSize={24}>
      <Link href='/'>Home</Link>
      <Link href='/add-certification'>Certs</Link>
      <Link href='/add-requirements'>Reqs</Link>
      <Link href='/enroll'>Enroll</Link>
    </HStack>
  );
};
