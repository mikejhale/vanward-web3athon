use anchor_lang::prelude::*;

use crate::models::*;

#[derive(Accounts)]
pub struct CompleteCertification<'info> {
    #[account(has_one = authority)]
    pub certification: Account<'info, Certification>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        has_one = authority,
        constraint = enrollment.certification.key() == certification.key()
    )]
    pub enrollment: Account<'info, Enrollment>,
}
