use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Enrollment {
    pub authority: Pubkey,
    pub owner: Pubkey,
    pub certification: Pubkey,
    pub complete: bool,
    pub bump: u8,
}
