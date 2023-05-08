import { FC } from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Textarea,
  Switch,
  usePortalManager,
} from '@chakra-ui/react';
import * as web3 from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { MOVIE_REVIEW_PROGRAM_ID } from '../utils/constants';

export const Form: FC = () => {
  const [proId, setProId] = useState('');
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!publicKey) {
      alert('Please connect your wallet!');
      return;
    }

    //const movie = new Movie(title, rating, description, publicKey)
    //handleTransactionSubmit(movie)
  };

  return (
    <Box
      p={4}
      display={{ md: 'flex' }}
      maxWidth='32rem'
      borderWidth={1}
      margin={2}
      justifyContent='center'
    >
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel color='gray.200'>Professional ID</FormLabel>
          <Input
            id='title'
            color='gray.400'
            onChange={(event) => setProId(event.currentTarget.value)}
          />
        </FormControl>

        <Button width='full' mt={4} type='submit'>
          Add
        </Button>
      </form>
    </Box>
  );
};
