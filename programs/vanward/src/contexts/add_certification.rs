use anchor_lang::prelude::*;

use crate::models::certification::Certification;

#[derive(Accounts)]
#[instruction(id: String, year: u16)]
pub struct AddCertification<'info> {
    #[account(init, payer = authority, space = 8 + Certification::INIT_SPACE, seeds = [
        b"certification",
        id.as_bytes(),
        year.to_le_bytes().as_ref(),
        authority.to_account_info().key.as_ref(),
    ], bump)]
    pub certification: Account<'info, Certification>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
