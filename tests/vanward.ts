import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
} from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import Web3 from 'web3';
import { expect } from 'chai';
import { Vanward } from '../target/types/vanward';

describe('vanward', async () => {
  const certificationId = 'CERT' + (Math.floor(Math.random() * 90000) + 10000);
  const certificationTitle = 'My Certification for 2024';
  const certificationYear = 2024;

  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Vanward as Program<Vanward>;

  const [certificationPda, certBump] =
    await anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('certification'),
        anchor.utils.bytes.utf8.encode(certificationId),
        new anchor.BN(certificationYear).toBuffer('le', 2),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

  it('can add a certification', async () => {
    const tx = await program.methods
      .addCertification(
        certificationId,
        certificationYear,
        certificationTitle,
        certBump
      )
      .accounts({
        certification: certificationPda,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let certAccount = await program.account.certification.fetch(
      certificationPda
    );
    expect(certAccount.id).equals(certificationId);
    expect(certAccount.year).equals(certificationYear);
    expect(certAccount.title).equals(certificationTitle);
  });
});
