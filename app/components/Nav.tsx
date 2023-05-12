import { HStack } from '@chakra-ui/react';
import Link from 'next/link';

export const Nav = () => {
  return (
    <HStack fontSize={24}>
      <Link href='/professionals'>Professionals</Link>
      <Link href='/certifications'>Certifications</Link>
    </HStack>
  );
};
