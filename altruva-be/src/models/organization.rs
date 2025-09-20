use serde::{Deserialize, Serialize};
use surreal_socket::dbrecord::{DBRecord, SsUuid};
use utoipa::ToSchema;

use crate::models::cause::Cause;

#[derive(Deserialize, Serialize, Clone)]
pub struct Organization {
    pub uuid: SsUuid<Organization>,
    pub name: String,
    pub causes: Vec<Cause>,
    pub location: String,
    pub sponsoring: Vec<Beneficiary>,
}

impl DBRecord for Organization {
    const TABLE_NAME: &'static str = "organizations";

    fn uuid(&self) -> SsUuid<Self> {
        self.uuid.clone()
    }
}

#[derive(Deserialize, Serialize, Clone, ToSchema)]
pub enum Beneficiary {
    // These strings should be UUIDs of the respective type
    Event(String),
    Organization(String),
}

#[derive(Serialize, utoipa::ToSchema)]
pub struct OrganizationResponse {
    pub uuid: String,
    pub name: String,
    pub causes: Vec<Cause>,
    pub location: String,
    pub sponsoring: Vec<Beneficiary>,
}

impl From<Organization> for OrganizationResponse {
    fn from(org: Organization) -> Self {
        OrganizationResponse {
            name: org.name,
            causes: org.causes,
            location: org.location,
            sponsoring: org.sponsoring,
            uuid: org.uuid.to_uuid_string(),
        }
    }
}
