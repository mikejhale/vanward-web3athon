import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
  setProvider,
  workspace,
} from '@coral-xyz/anchor';
import { expect } from 'chai';
import { Vanward } from '../target/types/vanward';

describe('vanward', async () => {
  const certificationId = 'CERT' + (Math.floor(Math.random() * 90000) + 10000);
  const certificationTitle = 'My Certification for 2024';
  const certificationYear = 2024;

  // Configure the client to use the local cluster.
  const provider = AnchorProvider.env();
  setProvider(provider);
  const program = workspace.Vanward as Program<Vanward>;

  const [certificationPda, certBump] =
    await web3.PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode('certification'),
        utils.bytes.utf8.encode(certificationId),
        new BN(certificationYear).toBuffer('le', 2),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

  const module = 'Week 1';
  const credits = 1;

  const [requirementPda, reqBump] = await web3.PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('requirement'),
      utils.bytes.utf8.encode(module),
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

  it('can add a requirement', async () => {
    const module = 'Week 1';
    const credits = 1;

    const [requirementPda, reqBump] =
      await web3.PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode('requirement'),
          utils.bytes.utf8.encode(certificationId),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

    const tx = await program.methods
      .addRequirement(certificationId, credits, reqBump)
      .accounts({
        requirement: requirementPda,
        certification: certificationPda,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let reqAccount = await program.account.requirement.fetch(requirementPda);
    expect(reqAccount.module).equals(certificationId);
    expect(reqAccount.credits).equals(credits);
  });

  it('can get certification requirements', async () => {
    let reqAccounts = await program.account.requirement.all([
      {
        memcmp: {
          offset: 8,
          bytes: certificationPda.toBase58(),
        },
      },
    ]);

    expect(reqAccounts[0].account.module).equals(certificationId);
  });
});
