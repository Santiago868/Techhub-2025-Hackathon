use crate::models::cause::Cause;
use serde::{Deserialize, Serialize};
use surreal_socket::dbrecord::{DBRecord, SsUuid};

#[derive(Deserialize, Serialize)]
pub struct User {
    pub uuid: SsUuid<User>,
    pub name: String,
    pub username: String,
    pub interests: Vec<Cause>,

    #[allow(dead_code)] // hackathon
    pub password_hash: String,
}

#[derive(serde::Serialize, utoipa::ToSchema)]
pub struct UserResponse {
    pub name: String,
    pub username: String,
    pub interests: Vec<Cause>,
}

impl From<User> for UserResponse {
    fn from(user: User) -> Self {
        UserResponse {
            name: user.name,
            username: user.username,
            interests: user.interests,
        }
    }
}

impl DBRecord for User {
    const TABLE_NAME: &'static str = "users";

    fn uuid(&self) -> SsUuid<Self> {
        self.uuid.clone()
    }
}
