use crate::contexts::*;
use anchor_lang::prelude::*;

use crate::errors::*;
use crate::models::*;

// add certification
pub fn add_certification(
    ctx: Context<AddCertification>,
    id: String,
    year: u16,
    title: String,
) -> Result<()> {
    let cert = &mut ctx.accounts.certification;
    cert.authority = *ctx.accounts.authority.key;
    cert.id = id;
    cert.year = year;
    cert.title = title;
    cert.bump = *ctx.bumps.get("certification").unwrap();
    cert.requirements = Vec::new();
    Ok(())
}

pub fn complete_certification(ctx: Context<CompleteCertification>) -> Result<()> {
    let certification = &ctx.accounts.certification;
    let enrollment = &mut ctx.accounts.enrollment;

    // check that remaining accounts can be split evenly
    require!(
        ctx.remaining_accounts.len() % 2 == 0,
        RequirementError::RequirementsMismatch
    );

    // split remaining accounts into requirements and completions
    let (requirement_accounts, completion_accounts) = ctx
        .remaining_accounts
        .split_at(ctx.remaining_accounts.len() / 2);

    // get unique requirements
    let mut req_accounts: Vec<AccountInfo> = requirement_accounts.to_vec();
    req_accounts.sort_by(|a, b| a.key.cmp(&b.key));
    req_accounts.dedup_by(|a, b| a.key == b.key);

    // check that the number of requirements is the same as certification requirements
    require!(
        req_accounts.len() == certification.requirements.len(),
        RequirementError::RequirementsMismatch
    );

    // convert completion_accounts to Account<Completion>
    let compl_accounts: Vec<Account<Completion>> = completion_accounts
        .iter()
        .map(|a| Account::try_from(a).unwrap())
        .collect();

    for acct in req_accounts {
        // check that each requirement belongs to the certification
        require!(
            certification.requirements.contains(&acct.key()),
            RequirementError::InvalidRequirement
        );

        // check that each requirement is owned by the authority
        let req: Account<Requirement> = Account::try_from(&ctx.remaining_accounts[0]).unwrap();
        require!(
            req.authority == *ctx.accounts.authority.key,
            RequirementError::InvalidRequirement
        );

        // check that requirement is complete
        require!(
            compl_accounts
                .iter()
                .find(|a| a.requirement == req.key())
                .is_some(),
            RequirementError::IncompleteRequirement
        );
    }

    // mark enrollment as complete
    enrollment.complete = true;

    Ok(())
}
