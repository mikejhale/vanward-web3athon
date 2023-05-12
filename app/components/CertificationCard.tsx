import { Box, HStack, Stack, Text } from '@chakra-ui/react';

type CertCardProps = {
  id: string;
  year: number;
  title: string;
};

export const CertificationCard = (props: CertCardProps) => {
  return (
    <Box
      p={4}
      display={{ md: 'flex' }}
      maxWidth='32rem'
      borderWidth={1}
      margin={2}
      _hover={{}}
    >
      <Stack
        w='full'
        align={{ base: 'center', md: 'stretch' }}
        textAlign={{ base: 'center', md: 'left' }}
        mt={{ base: 4, md: 0 }}
        ml={{ md: 6 }}
        mr={{ md: 6 }}
      >
        <HStack>
          <Text>{props.id}</Text>
          <Text>{props.title}</Text>
          <Text>{props.year}</Text>
        </HStack>
      </Stack>
    </Box>
  );
};
