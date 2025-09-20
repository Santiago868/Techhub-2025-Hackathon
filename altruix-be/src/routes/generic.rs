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
#[rocket::get("/login")]
pub fn causes() -> Result<Json<CausesResponse>, status::Custom<Json<ErrorResponse>>> {
    Ok(Json(CausesResponse {
        causes: vec![
            CauseResponseItem {
                category: "Community & Social Support".to_string(),
                causes: vec![
                    Cause::AssistingAtFoodBanks,
                    Cause::HelpingAtHomelessShelters,
                    Cause::SupportingOrphanagesOrFosterPrograms,
                ],
            },
            CauseResponseItem {
                category: "Environment & Sustainability".to_string(),
                causes: vec![
                    Cause::BeachParkCleanups,
                    Cause::TreePlantingAndCommunityGardening,
                    Cause::WildlifeRescueSupport,
                ],
            },
            CauseResponseItem {
                category: "Health & Wellness".to_string(),
                causes: vec![
                    Cause::HospitalVolunteeringNonMedicalSupport,
                    Cause::BloodDrivesAndHealthAwarenessCampaigns,
                    Cause::MentalHealthPeerSupportGroups,
                ],
            },
            CauseResponseItem {
                category: "Animal Welfare".to_string(),
                causes: vec![
                    Cause::AnimalShelterSupportFeedingWalkingCleaning,
                    Cause::FosteringPets,
                    Cause::FundraisingForRescueOrganizations,
                    Cause::AssistingWithAdoptionEvents,
                ],
            },
            CauseResponseItem {
                category: "Emergency & Relief".to_string(),
                causes: vec![
                    Cause::DisasterResponseVolunteeringSupplyDistributionShelterSupport,
                    Cause::FundraisingForCrisisRelief,
                    Cause::TrainingInFirstAidAndEmergencyReadiness,
                ],
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
