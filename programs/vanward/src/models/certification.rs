use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Certification {
    pub authority: Pubkey,
    #[max_len(128)]
    pub id: String,
    pub year: u16,
    #[max_len(480)]
    pub title: String,
    pub bump: u8,
    #[max_len(32)]
    pub requirements: Vec<Pubkey>,
}
