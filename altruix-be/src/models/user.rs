use crate::routes::users::Cause;

struct User {
    name: String,
    username: String,
    interests: Vec<Cause>,

    #[allow(dead_code)] // hackathon
    password_hash: String,
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
