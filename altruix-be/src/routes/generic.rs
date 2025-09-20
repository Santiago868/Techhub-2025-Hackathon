use rocket::{response::status, serde::json::Json};

use crate::{ErrorResponse, models::cause::Cause};

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
