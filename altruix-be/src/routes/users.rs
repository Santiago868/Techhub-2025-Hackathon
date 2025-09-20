use rocket::{response::status, serde::json::Json};

use crate::{ErrorResponse, models::cause::Cause, models::user::UserResponse};

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
pub fn login(
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

    match request.username.as_str() {
        "chris" => Ok(Json(LoginResponse {
            access_token: "w5nnRh8P3VyxJZuVk3xQVYsnfU9RvUzMo8Yd5Yb5fXDp3do2Xb78w3P2t5LQe375"
                .to_string(),
            user: UserResponse {
                name: "Chris".to_string(),
                username: "chris".to_string(),
                interests: vec![
                    Cause::AssistingAtFoodBanks,
                    Cause::TreePlantingAndCommunityGardening,
                ],
            },
        })),
        "arnau" => Ok(Json(LoginResponse {
            access_token: "JepxMnW6Gy2A4rbwufLt9DBTcLDHmXAF4r38DAvaP5eCAFLB4xmgBcd3qsP6Z5pE"
                .to_string(),
            user: UserResponse {
                name: "Arnau".to_string(),
                username: "arnau".to_string(),
                interests: vec![Cause::MentalHealthPeerSupportGroups, Cause::FosteringPets],
            },
        })),
        "michelle" => Ok(Json(LoginResponse {
            access_token: "7j8RYjzbs9yx4DKBGtMjEA77HdiNHUroiKpC57tNhDUyixTUWYDmUUSyGoEJzQ42"
                .to_string(),
            user: UserResponse {
                name: "Michelle".to_string(),
                username: "michelle".to_string(),
                interests: vec![
                    Cause::HospitalVolunteeringNonMedicalSupport,
                    Cause::DisasterResponseVolunteeringSupplyDistributionShelterSupport,
                ],
            },
        })),
        _ => Err(status::Custom(
            rocket::http::Status::Unauthorized,
            Json(ErrorResponse {
                error: "Invalid username or password".to_string(),
            }),
        )),
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
