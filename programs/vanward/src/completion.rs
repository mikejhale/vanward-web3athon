use anchor_lang::prelude::*;

use crate::enrollment::Enrollment;
use crate::requirement::Requirement;

// enroll in certification as a professiona;
pub fn complete(ctx: Context<CompleteRequirement>) -> Result<()> {
    let completion = &mut ctx.accounts.completion;
    completion.authority = *ctx.accounts.user.key;
    completion.owner = *ctx.accounts.owner.to_account_info().key;
    completion.requirement = *ctx.accounts.requirement.to_account_info().key;
    completion.bump = *ctx.bumps.get("completion").unwrap();
    Ok(())
}

#[derive(Accounts)]
pub struct CompleteRequirement<'info> {
    #[account(init, payer = user, space = 8 + Completion::INIT_SPACE, seeds = [
            b"complete",
            owner.to_account_info().key.as_ref(),
            requirement.to_account_info().key.as_ref(),
    ], bump)]
    pub completion: Account<'info, Completion>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub owner: Account<'info, Enrollment>,
    pub requirement: Account<'info, Requirement>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Completion {
    pub authority: Pubkey,
    pub owner: Pubkey,
    pub requirement: Pubkey,
    pub bump: u8,
}
