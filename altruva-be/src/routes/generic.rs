use rocket::{
    http::HeaderMap,
    request::{FromRequest, Outcome},
    response::status,
    serde::json::Json,
};
use surreal_socket::dbrecord::DBRecord;

use crate::{
    ErrorResponse,
    models::{cause::Cause, user::User},
};

pub async fn fake_validate_access_token(
    token: &str,
) -> Result<User, status::Custom<Json<ErrorResponse>>> {
    let client = crate::surrealdb_client().await.unwrap();
    let all_users = User::db_all(&client).await.unwrap();

    let username = match token {
        "w5nnRh8P3VyxJZuVk3xQVYsnfU9RvUzMo8Yd5Yb5fXDp3do2Xb78w3P2t5LQe375" => "chris",
        "JepxMnW6Gy2A4rbwufLt9DBTcLDHmXAF4r38DAvaP5eCAFLB4xmgBcd3qsP6Z5pE" => "arnau",
        "7j8RYjzbs9yx4DKBGtMjEA77HdiNHUroiKpC57tNhDUyixTUWYDmUUSyGoEJzQ42" => "michelle",
        _ => {
            return Err(status::Custom(
                rocket::http::Status::Unauthorized,
                Json(ErrorResponse {
                    error: "Invalid access token".to_string(),
                }),
            ));
        }
    };

    all_users
        .into_iter()
        .find(|u| u.username == username)
        .ok_or_else(|| {
            status::Custom(
                rocket::http::Status::Unauthorized,
                Json(ErrorResponse {
                    error: "User not found".to_string(),
                }),
            )
        })
}

pub struct BearerToken(Option<String>);

impl BearerToken {
    fn from_headermap(headermap: &HeaderMap) -> Self {
        Self(
            headermap
                .get_one("Authorization")
                .and_then(|header_str| header_str.strip_prefix("Bearer "))
                .map(|token| token.to_owned()),
        )
    }

    /// Validate the token and return the user
    pub async fn validate(&self) -> Result<User, status::Custom<Json<ErrorResponse>>> {
        let token = self.0.as_ref().ok_or(status::Custom(
            rocket::http::Status::Unauthorized,
            Json(ErrorResponse {
                error: "Missing or invalid Authorization header".to_string(),
            }),
        ))?;

        fake_validate_access_token(token).await
    }
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for BearerToken {
    type Error = ();
    async fn from_request(request: &'r rocket::request::Request<'_>) -> Outcome<Self, Self::Error> {
        Outcome::Success(BearerToken::from_headermap(request.headers()))
    }
}

/// Get Causes
#[utoipa::path(
    get,
    path = "/causes",
    description = "Get all causes, categorized",
    responses(
        (status = 200, description = "OK", body = CausesResponse),
    ),
    security(),
    tag = ""
)]
#[rocket::get("/causes")]
pub fn causes() -> Result<Json<CausesResponse>, status::Custom<Json<ErrorResponse>>> {
    Ok(Json(CausesResponse {
        causes: vec![
            CauseResponseItem {
                category: "Community & Social Support".to_string(),
                causes: vec![
                    Cause::FoodBanksSoupKitchen,
                    Cause::HomelessShelters,
                    Cause::OrphanagesFosterPrograms,
                ],
            },
            CauseResponseItem {
                category: "Environment & Sustainability".to_string(),
                causes: vec![
                    Cause::BeachPark,
                    Cause::CommunityGardening,
                    Cause::WildlifeRescueSupport,
                ],
            },
            CauseResponseItem {
                category: "Health & Wellness".to_string(),
                causes: vec![Cause::Hospital, Cause::HealthAwareness, Cause::MentalHealth],
            },
            CauseResponseItem {
                category: "Animal Welfare".to_string(),
                causes: vec![Cause::AnimalShelter, Cause::AdoptionEvents],
            },
            CauseResponseItem {
                category: "Emergency & Relief".to_string(),
                causes: vec![Cause::DisasterResponse, Cause::Fundraising, Cause::Training],
            },
        ],
    }))
}

#[derive(serde::Serialize, utoipa::ToSchema)]
pub struct CausesResponse {
    causes: Vec<CauseResponseItem>,
}

#[derive(serde::Serialize, utoipa::ToSchema)]
pub struct CauseResponseItem {
    pub category: String,
    pub causes: Vec<Cause>,
}
