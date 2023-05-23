use anchor_lang::prelude::*;

// add professional
pub fn add_professional(ctx: Context<AddProfessional>, id: String) -> Result<()> {
    let pro = &mut ctx.accounts.professional;
    pro.authority = *ctx.accounts.user.key;
    pro.id = id;
    pro.bump = *ctx.bumps.get("professional").unwrap();
    Ok(())
}

#[derive(Accounts)]
pub struct AddProfessional<'info> {
    #[account(init, payer = user, space = 8 + Professional::INIT_SPACE, seeds = [
        b"professional",
        owner.to_account_info().key.as_ref(),
        user.to_account_info().key.as_ref(),
    ], bump)]
    pub professional: Account<'info, Professional>,
    #[account(mut)]
    pub user: Signer<'info>,
    /// CHECK: Needed for the seed for the Professional PDA
    pub owner: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Professional {
    pub authority: Pubkey,
    pub owner: Pubkey,
    #[max_len(128)]
    pub id: String,
    pub bump: u8,
}
