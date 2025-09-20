use crate::models::organization::OrganizationResponse;
use rocket::{response::status, serde::json::Json};
use serde::Serialize;
use surreal_socket::dbrecord::DBRecord;

use crate::{ErrorResponse, models::organization::Organization};

/// Get all Organizations
#[utoipa::path(
    get,
    path = "/organizations",
    description = "Get all organizations",
    responses(
        (status = 200, description = "OK", body = OrganizationsResponse),
    ),
    security(),
    tag = ""
)]
#[rocket::get("/organizations")]
pub async fn get_organizations()
-> Result<Json<Vec<OrganizationsResponse>>, status::Custom<Json<ErrorResponse>>> {
    let client = crate::surrealdb_client().await.unwrap();
    let all_orgs = Organization::db_all(&client).await.unwrap();
    let mut orgs_response = Vec::new();

    for org in all_orgs {
        orgs_response.push(org.into());
    }

    Ok(Json(vec![OrganizationsResponse {
        organizations: orgs_response,
    }]))
}

#[derive(Serialize, utoipa::ToSchema)]
pub struct OrganizationsResponse {
    organizations: Vec<OrganizationResponse>,
}
