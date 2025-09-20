use crate::models::cause::Cause;
use serde::{Deserialize, Serialize};
use surreal_socket::dbrecord::{DBRecord, SsUuid};

#[derive(Deserialize, Serialize, Clone)]
pub struct User {
    pub uuid: SsUuid<User>,
    pub name: String,
    pub username: String,
    pub interests: Vec<Cause>,
    pub manages_orgs: Vec<SsUuid<crate::models::organization::Organization>>,

    #[allow(dead_code)] // hackathon
    pub password_hash: String,
}

impl User {
    pub async fn into_response(self) -> UserResponse {
        let client = crate::surrealdb_client().await.unwrap();
        let mut manages_orgs = Vec::new();

        for org_id in &self.manages_orgs {
            if let Ok(org) = org_id.db_fetch(&client).await {
                manages_orgs.push(org.into());
            }
        }

        UserResponse {
            name: self.name,
            username: self.username,
            interests: self.interests,
            manages_orgs,
        }
    }
}

#[derive(serde::Serialize, utoipa::ToSchema)]
pub struct UserResponse {
    pub name: String,
    pub username: String,
    pub interests: Vec<Cause>,
    pub manages_orgs: Vec<crate::models::organization::OrganizationResponse>,
}

impl DBRecord for User {
    const TABLE_NAME: &'static str = "users";

    fn uuid(&self) -> SsUuid<Self> {
        self.uuid.clone()
    }
}
