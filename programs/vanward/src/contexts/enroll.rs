use anchor_lang::prelude::*;

use crate::models::certification::Certification;
use crate::models::enrollment::Enrollment;

#[derive(Accounts)]
pub struct Enroll<'info> {
    #[account(init, payer = authority, space = 8 + Enrollment::INIT_SPACE, seeds = [
        b"enroll",
        authority.to_account_info().key.as_ref(),
        certification.to_account_info().key.as_ref(),
    ], bump)]
    pub enrollment: Account<'info, Enrollment>,
    #[account(has_one = authority)]
    pub certification: Account<'info, Certification>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
