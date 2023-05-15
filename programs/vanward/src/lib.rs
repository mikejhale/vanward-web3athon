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

    // add professional
    pub fn add_professional(ctx: Context<AddProfessional>, id: String, bump: u8) -> Result<()> {
        let pro = &mut ctx.accounts.professional;
        pro.authority = *ctx.accounts.user.key;
        pro.id = id;
        pro.bump = bump;
        Ok(())
    }

    // enroll in certification as a professiona;
    pub fn enroll(ctx: Context<Enroll>, bump: u8) -> Result<()> {
        let enrollment = &mut ctx.accounts.enrollment;
        enrollment.authority = ctx.accounts.certification.authority;
        enrollment.certification = ctx.accounts.certification.to_account_info().key();
        enrollment.owner = *ctx.accounts.user.key;
        enrollment.bump = bump;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(id: String, year: u16)]
pub struct AddCertification<'info> {
    #[account(init, payer = user, space = 8 + 32 + 96 + 2 + 480 + 1, seeds = [
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
    #[account(init, payer = user, space = 8 + 32 + 32 + 480 + 1 + 1, seeds = [
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

#[derive(Accounts)]
pub struct AddProfessional<'info> {
    #[account(init, payer = user, space = 8 + 44 + 128 + 1, seeds = [
        b"professional",
        owner.to_account_info().key.as_ref(),
        user.to_account_info().key.as_ref(),
    ], bump)]
    pub professional: Account<'info, Professional>,
    #[account(mut)]
    pub user: Signer<'info>,
    /// CHECK: Needed for the seed for the Professional PDA
    pub owner: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Enroll<'info> {
    #[account(init, payer = user, space = 8 + 32 + 32 + 32 + 1, seeds = [
        b"enroll",
        user.to_account_info().key.as_ref(),
        certification.to_account_info().key.as_ref(),
    ], bump)]
    pub enrollment: Account<'info, Enrollment>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub certification: Account<'info, Certification>,
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

#[account]
pub struct Professional {
    pub authority: Pubkey,
    pub owner: Pubkey,
    pub id: String,
    pub bump: u8,
}

#[account]
pub struct Enrollment {
    pub authority: Pubkey,
    pub owner: Pubkey,
    pub certification: Pubkey,
    pub bump: u8,
}
