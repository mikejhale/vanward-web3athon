import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import idl from '../idl/vanward-idl.json';

const useAnchorProvider = (
  connection: web3.Connection,
  wallet: WalletContextState
) => {
  const provider = new AnchorProvider(
    connection,
    // @ts-ignore
    wallet,
    AnchorProvider.defaultOptions()
  );

  return provider as AnchorProvider;
};

export default useAnchorProvider;
