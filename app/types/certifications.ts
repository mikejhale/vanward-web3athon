import { ProgramAccount } from '@coral-xyz/anchor';

export type CertificationType = {
  certification: ProgramAccount;
  requirements?: ProgramAccount[];
};
