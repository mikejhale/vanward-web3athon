use anchor_lang::prelude::*;

declare_id!("AKUscwsW639dX2X8YRSes9mqx221HU1ti9ZDGdX6iVYV");

#[program]
pub mod vanward {
    use super::*;

    // add certification
    pub fn add_certification(
        ctx: Context<AddCertification>,
        id: String,
        year: u16,
        title: String,
        bump: u8,
    ) -> Result<()> {
        let cert = &mut ctx.accounts.certification;
        cert.authority = *ctx.accounts.user.key;
        cert.id = id;
        cert.year = year;
        cert.title = title;
        cert.bump = bump;
        Ok(())
    }

    // add requirement
    pub fn add_requirement(
        ctx: Context<AddRequirement>,
        module: String,
        credits: u8,
        bump: u8,
    ) -> Result<()> {
        let req: &mut Account<Requirement> = &mut ctx.accounts.requirement;
        req.authority = *ctx.accounts.user.key;
        req.owner = *ctx.accounts.certification.to_account_info().key;
        req.module = module;
        req.credits = credits;
        req.bump = bump;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(id: String, year: u16)]
pub struct AddCertification<'info> {
    #[account(init, payer = user, space = 256, seeds = [
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

#[derive(Accounts)]
#[instruction(module: String)]
pub struct AddRequirement<'info> {
    #[account(init, payer = user, space = 256, seeds = [
        b"requirement",
        module.as_bytes(),
        user.to_account_info().key.as_ref(),
    ], bump)]
    pub requirement: Account<'info, Requirement>,
    pub certification: Account<'info, Certification>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Certification {
    pub authority: Pubkey,
    pub id: String,
    pub year: u16,
    pub title: String,
    pub bump: u8,
}

#[account]
pub struct Requirement {
    pub owner: Pubkey,
    pub authority: Pubkey,
    pub module: String,
    pub credits: u8,
    pub bump: u8,
}
