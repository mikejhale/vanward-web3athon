use anchor_lang::prelude::*;

use crate::certification;

// add requirement
pub fn add_requirement(ctx: Context<AddRequirement>, module: String, credits: u8) -> Result<()> {
    let req: &mut Account<Requirement> = &mut ctx.accounts.requirement;
    req.authority = *ctx.accounts.user.key;
    req.owner = *ctx.accounts.certification.to_account_info().key;
    req.module = module;
    req.credits = credits;
    req.bump = *ctx.bumps.get("requirement").unwrap();
    Ok(())
}

#[derive(Accounts)]
#[instruction(module: String)]
pub struct AddRequirement<'info> {
    #[account(init, payer = user, space = 8 + Requirement::INIT_SPACE, seeds = [
        b"requirement",
        module.as_bytes(),
        user.to_account_info().key.as_ref(),
    ], bump)]
    pub requirement: Account<'info, Requirement>,
    pub certification: Account<'info, certification::Certification>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Requirement {
    pub owner: Pubkey,
    pub authority: Pubkey,
    #[max_len(128)]
    pub module: String,
    pub credits: u8,
    pub bump: u8,
}
