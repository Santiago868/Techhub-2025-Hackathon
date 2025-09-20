use rocket::{response::status, serde::json::Json};
use surreal_socket::dbrecord::DBRecord;

use crate::{
    ErrorResponse,
    models::user::{User, UserResponse},
};

/// Log in
#[utoipa::path(
    post,
    path = "/login",
    description = "Log in",
    request_body(content = LoginRequest, content_type = "application/json"),
    responses(
        (status = 200, description = "OK", body = LoginResponse),
        (status = 401, description = "Unauthorized", body = ErrorResponse),
    ),
    security(),
    tag = ""
)]
#[rocket::post("/login", data = "<request>")]
pub async fn login(
    request: Json<LoginRequest>,
) -> Result<Json<LoginResponse>, status::Custom<Json<ErrorResponse>>> {
    if request.password != "password" {
        return Err(status::Custom(
            rocket::http::Status::Unauthorized,
            Json(ErrorResponse {
                error: "Invalid username or password".to_string(),
            }),
        ));
    }

    let client = crate::surrealdb_client().await.unwrap();
    let all_users = User::db_all(&client).await.unwrap();

    // fake oauth. hackathon
    if let Some(user) = all_users
        .into_iter()
        .find(|u| u.username == request.username)
    {
        match user.username.as_str() {
            "chris" => Ok(Json(LoginResponse {
                access_token: "w5nnRh8P3VyxJZuVk3xQVYsnfU9RvUzMo8Yd5Yb5fXDp3do2Xb78w3P2t5LQe375"
                    .to_string(),
                user: user.into(),
            })),
            "arnau" => Ok(Json(LoginResponse {
                access_token: "JepxMnW6Gy2A4rbwufLt9DBTcLDHmXAF4r38DAvaP5eCAFLB4xmgBcd3qsP6Z5pE"
                    .to_string(),
                user: user.into(),
            })),
            "michelle" => Ok(Json(LoginResponse {
                access_token: "7j8RYjzbs9yx4DKBGtMjEA77HdiNHUroiKpC57tNhDUyixTUWYDmUUSyGoEJzQ42"
                    .to_string(),
                user: user.into(),
            })),
            _ => Err(status::Custom(
                rocket::http::Status::Unauthorized,
                Json(ErrorResponse {
                    error: "Invalid username or password".to_string(),
                }),
            )),
        }
    } else {
        Err(status::Custom(
            rocket::http::Status::Unauthorized,
            Json(ErrorResponse {
                error: "Invalid username or password".to_string(),
            }),
        ))
    }
}

#[derive(serde::Deserialize, utoipa::ToSchema)]
pub struct LoginRequest {
    username: String,
    password: String,
}

// login response
#[derive(serde::Serialize, utoipa::ToSchema)]
pub struct LoginResponse {
    access_token: String,
    user: UserResponse,
}
