import { HStack } from '@chakra-ui/react';
import Link from 'next/link';

export const Nav = () => {
  return (
    <HStack fontSize={24}>
      <Link href='/'>Home</Link>
      <Link href='/add-certification'>Certifications</Link>
      <Link href='/add-requirements'>Requirements</Link>
    </HStack>
  );
};
