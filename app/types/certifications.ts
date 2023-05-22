import { ProgramAccount } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

export type CertificationType = {
  certification: ProgramAccount;
  requirements?: ProgramAccount[];
};

export type Certification = {
  authority: PublicKey;
  bump: number;
  id: string;
  title: string;
  year: number;
};
