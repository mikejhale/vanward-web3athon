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
        authority: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let certAccount = await program.account.certification.fetch(
      certificationPda
    );

    expect(certAccount.id).to.equal(certificationId);
    expect(certAccount.year).to.equal(certificationYear);
    expect(certAccount.title).to.equal(certificationTitle);
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
        authority: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let reqAccount = await program.account.requirement.fetch(
      requirementPda.toString()
    );
    expect(reqAccount.module).to.equal(certificationId);
    expect(reqAccount.credits).to.equal(credits);

    let certAccount = await program.account.certification.fetch(
      certificationPda.toString()
    );

    expect(certAccount.requirements[0].toString()).to.equal(
      requirementPda.toString()
    );
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
    expect(reqAccounts[0].account.module).to.equal(certificationId);
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
        authority: provider.wallet.publicKey,
        certification: certificationPda,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let enrollAccount = await program.account.enrollment.fetch(
      enrollmentPda.toString()
    );
    expect(enrollAccount.certification.toString()).to.equal(
      certificationPda.toString()
    );
    expect(enrollAccount.complete).to.equal(false);
  });

  it('can mark requirement as complete', async () => {
    const [completePda, completeBump] = await PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode('complete'),
        new PublicKey(enrollPda).toBuffer(),
        new PublicKey(reqPda).toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .completeRequirement()
      .accounts({
        completion: completePda,
        authority: provider.wallet.publicKey,
        enrollment: enrollPda,
        requirement: reqPda,
        certification: certificationPda.toString(),
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    let completeAccount = await program.account.completion.fetch(
      completePda.toString()
    );

    expect(completeAccount.bump).equals(completeBump);
  });

  // test that all certification requirements are complete by enrollee
  it('can check if all requirements are complete', async () => {
    // let cert = await program.account.certification.fetch(
    //   certificationPda.toString()
    // );

    let enroll = await program.account.enrollment.all([
      {
        memcmp: {
          offset: 8 + 32,
          bytes: provider.wallet.publicKey.toBase58(),
        },
      },
    ]);

    expect(enroll.length).to.equal(1);

    let reqs = await program.account.requirement.all([
      {
        memcmp: {
          offset: 8,
          bytes: certificationPda.toBase58(),
        },
      },
    ]);
    expect(reqs.length).to.equal(1);

    const reqAccts = Array.from(reqs, (r) => {
      return {
        pubkey: r.publicKey,
        isWritable: false,
        isSigner: false,
      };
    });

    let completions = await program.account.completion.all([
      {
        memcmp: {
          offset: 8 + 32,
          bytes: enroll[0].publicKey.toBase58(),
        },
      },
    ]);
    expect(completions.length).to.equal(1);

    const compAccts = Array.from(completions, (c) => {
      return {
        pubkey: c.publicKey,
        isWritable: false,
        isSigner: false,
      };
    });

    const tx = await program.methods
      .completeCertification()
      .accounts({
        certification: certificationPda,
        authority: provider.wallet.publicKey,
        enrollment: enroll[0].publicKey,
      })
      .remainingAccounts(reqAccts.concat(compAccts))
      .rpc();

    let complete_enroll = await program.account.enrollment.fetch(
      enroll[0].publicKey.toString()
    );
    expect(complete_enroll.complete).to.equal(true);
  });
});
