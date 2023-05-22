use anchor_lang::prelude::*;

// add certification
pub fn add_certification(
    ctx: Context<AddCertification>,
    id: String,
    year: u16,
    title: String,
) -> Result<()> {
    let cert = &mut ctx.accounts.certification;
    cert.authority = *ctx.accounts.user.key;
    cert.id = id;
    cert.year = year;
    cert.title = title;
    cert.bump = *ctx.bumps.get("certification").unwrap();
    Ok(())
}


#[derive(Accounts)]
#[instruction(id: String, year: u16)]
pub struct AddCertification<'info> {
    #[account(init, payer = user, space = 8 + Certification::INIT_SPACE, seeds = [
        b"certification",
        id.as_bytes(),
        year.to_le_bytes().as_ref(),
        user.to_account_info().key.as_ref(),
    ], bump)]
    pub certification: Account<'info, Certification>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

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
}