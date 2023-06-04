use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Requirement {
    pub certification: Pubkey,
    pub authority: Pubkey,
    #[max_len(128)]
    pub module: String,
    pub credits: u8,
    pub bump: u8,
}
