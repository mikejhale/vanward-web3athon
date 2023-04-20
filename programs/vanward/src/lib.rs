use anchor_lang::prelude::*;

declare_id!("AKUscwsW639dX2X8YRSes9mqx221HU1ti9ZDGdX6iVYV");

#[program]
pub mod vanward {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
