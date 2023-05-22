use anchor_lang::prelude::*;

use crate::certification;

// enroll in certification as a professiona;
pub fn enroll(ctx: Context<Enroll>) -> Result<()> {
    let enrollment = &mut ctx.accounts.enrollment;
    enrollment.authority = ctx.accounts.certification.authority;
    enrollment.certification = ctx.accounts.certification.to_account_info().key();
    enrollment.owner = *ctx.accounts.user.key;
    enrollment.bump = *ctx.bumps.get("enrollment").unwrap();
    Ok(())
}

#[derive(Accounts)]
pub struct Enroll<'info> {
    #[account(init, payer = user, space = 8 + Enrollment::INIT_SPACE, seeds = [
        b"enroll",
        user.to_account_info().key.as_ref(),
        certification.to_account_info().key.as_ref(),
    ], bump)]
    pub enrollment: Account<'info, Enrollment>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub certification: Account<'info, certification::Certification>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Enrollment {
    pub authority: Pubkey,
    pub owner: Pubkey,
    pub certification: Pubkey,
    pub bump: u8,
}
