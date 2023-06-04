use crate::contexts::*;
use crate::models::*;
use anchor_lang::prelude::*;

// add requirement
pub fn add_requirement(ctx: Context<AddRequirement>, module: String, credits: u8) -> Result<()> {
    let req: &mut Account<Requirement> = &mut ctx.accounts.requirement;
    req.authority = *ctx.accounts.authority.key;
    req.certification = *ctx.accounts.certification.to_account_info().key;
    req.module = module;
    req.credits = credits;
    req.bump = *ctx.bumps.get("requirement").unwrap();

    let cert = &mut ctx.accounts.certification;
    cert.requirements
        .push(*ctx.accounts.requirement.to_account_info().key);

    Ok(())
}

pub fn complete_requirement(ctx: Context<CompleteRequirement>) -> Result<()> {
    let completion = &mut ctx.accounts.completion;
    completion.authority = *ctx.accounts.authority.key;
    completion.enrollment = *ctx.accounts.enrollment.to_account_info().key;
    completion.requirement = *ctx.accounts.requirement.to_account_info().key;
    completion.bump = *ctx.bumps.get("completion").unwrap();

    // TODO: if this is the last requirement then complete_certification

    Ok(())
}
