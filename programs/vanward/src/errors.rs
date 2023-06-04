use anchor_lang::error_code;

#[error_code]
pub enum CertificationError {
    #[msg("Certification does not exist")]
    InvalidCertification,
}

#[error_code]
pub enum RequirementError {
    #[msg("Requirement does not exist")]
    InvalidRequirement,
    #[msg("Requirements do not match certification requirements")]
    RequirementsMismatch,
    #[msg("Requirement not complete")]
    IncompleteRequirement,
}

#[error_code]
pub enum EnrollmentError {
    #[msg("Enrollment does not exist")]
    InvalidEnrollment,
}
