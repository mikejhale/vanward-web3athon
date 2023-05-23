import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
  setProvider,
  workspace,
} from '@coral-xyz/anchor';
import { PublicKey, Keypair } from '@solana/web3.js';
import { expect } from 'chai';
import { Vanward } from '../target/types/vanward';
const crypto = require('crypto');

describe('vanward', async () => {
  const certificationId = 'CERT' + (Math.floor(Math.random() * 90000) + 10000);
  const certificationTitle = 'My Other Certification - 2023';
  const certificationYear = 2024;

  // Configure the client to use the local cluster.
  const provider = AnchorProvider.env();
  setProvider(provider);
  const program = workspace.Vanward as Program<Vanward>;

  let certPda = '';
  let enrollPda = '';
  let reqPda = '';

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

  certPda = certificationPda.toString();

  it('can add a certification', async () => {
    const tx = await program.methods
      .addCertification(certificationId, certificationYear, certificationTitle)
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

  it('can add an enrollment', async () => {
    const [enrollmentPda, enrollBump] =
      await web3.PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode('enroll'),
          provider.wallet.publicKey.toBuffer(),
          certificationPda.toBuffer(),
        ],
        program.programId
      );

    enrollPda = enrollmentPda.toString();

    const tx = await program.methods
      .enroll()
      .accounts({
        enrollment: enrollmentPda,
        user: provider.wallet.publicKey,
        certification: certificationPda,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let enrollAccount = await program.account.enrollment.fetch(
      enrollmentPda.toString()
    );
    expect(enrollAccount.certification.toString()).equals(
      certificationPda.toString()
    );
  });

  it('can add a requirement', async () => {
    const module = 'Week 1';
    const credits = 1;

    const [requirementPda, requirementBump] =
      await web3.PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode('requirement'),
          utils.bytes.utf8.encode(certificationId),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

    reqPda = requirementPda.toString();

    const tx = await program.methods
      .addRequirement(certificationId, credits)
      .accounts({
        requirement: requirementPda,
        certification: certificationPda,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let reqAccount = await program.account.requirement.fetch(
      requirementPda.toString()
    );
    expect(reqAccount.module).equals(certificationId);
    expect(reqAccount.credits).equals(credits);
  });

  it('can mark as complete', async () => {
    const [completePda, completeBump] = await PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode('complete'),
        new PublicKey(enrollPda).toBuffer(),
        new PublicKey(reqPda).toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .complete()
      .accounts({
        completion: completePda,
        user: provider.wallet.publicKey,
        owner: enrollPda,
        requirement: reqPda,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let completeAccount = await program.account.completion.fetch(
      completePda.toString()
    );

    expect(completeAccount.bump).equals(completeBump);
  });

  //console.log(completePda.toString());

  /*
  it('can add mark a requirement complete', async () => {
    const [completePda, completeBump] = await PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode('complete'),
        new PublicKey(enrollPda).toBuffer(),
        new PublicKey(reqPda).toBuffer(),
      ],
      program.programId
    );

    console.log(completePda.toString());

    const tx = await program.methods
      .complete()
      .accounts({
        completion: completePda,
        user: provider.wallet.publicKey,
        owner: enrollPda,
        requirement: reqPda,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let completeAccount = await program.account.completion.fetch(completePda);

    expect(completeAccount.bump).equals(completeBump);
  });



  it('can add a requirement', async () => {
    const module = 'Week 1';
    const credits = 1;

    const [requirementPda, reqPda] =
      await web3.PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode('requirement'),
          utils.bytes.utf8.encode(certificationId),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

    const tx = await program.methods
      .addRequirement(certificationId, credits)
      .accounts({
        requirement: requirementPda,
        certification: certificationPda,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let reqAccount = await program.account.requirement.fetch(
      requirementPda.toString()
    );
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

  it('can add an enrollment', async () => {
    const [enrollmentPda, enrollBump] =
      await web3.PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode('enroll'),
          provider.wallet.publicKey.toBuffer(),
          certificationPda.toBuffer(),
        ],
        program.programId
      );

    const tx = await program.methods
      .enroll()
      .accounts({
        enrollment: enrollmentPda,
        user: provider.wallet.publicKey,
        certification: certificationPda,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let enrollAccount = await program.account.enrollment.fetch(
      enrollmentPda.toString()
    );
    expect(enrollAccount.certification.toString()).equals(
      certificationPda.toString()
    );
  });


  it('can add a professional by Address', async () => {
    const userKeypair = Keypair.generate();

    const professionalPda, proBump =
      await web3.PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode('professional'),
          userKeypair.publicKey.toBuffer(),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

    const tx = await program.methods
      .addProfessional(userKeypair.publicKey.toString(), proBump)
      .accounts({
        professional: professionalPda,
        user: provider.wallet.publicKey,
        owner: userKeypair.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let proAccount = await program.account.professional.fetch(professionalPda);
    expect(proAccount.id).equals(userKeypair.publicKey.toString());
  });

  */
});
