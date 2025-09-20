use rocket::{response::status, serde::json::Json};
use serde::Serialize;
use surreal_socket::dbrecord::DBRecord;

use crate::{
    ErrorResponse,
    models::event::{Event, EventResponse},
};

/// Get all Events
#[utoipa::path(
    get,
    path = "/events",
    description = "Get all events",
    responses(
        (status = 200, description = "OK", body = EventsResponse),
    ),
    security(),
    tag = ""
)]
#[rocket::get("/events")]
pub async fn get_events() -> Result<Json<Vec<EventsResponse>>, status::Custom<Json<ErrorResponse>>>
{
    let client = crate::surrealdb_client().await.unwrap();
    let all_events = Event::db_all(&client).await.unwrap();
    let mut events_response = Vec::new();

    for event in &all_events {
        events_response.push(event.as_response().await);
    }

    Ok(Json(vec![EventsResponse {
        events: events_response,
    }]))
}

#[derive(Serialize, utoipa::ToSchema)]
pub struct EventsResponse {
    events: Vec<EventResponse>,
}
