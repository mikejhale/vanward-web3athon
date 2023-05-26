import { HStack } from '@chakra-ui/react';
import Link from 'next/link';

export const Nav = () => {
  return (
    <HStack fontSize={24}>
      <Link href='/'>Certifications</Link>
    </HStack>
  );
};
