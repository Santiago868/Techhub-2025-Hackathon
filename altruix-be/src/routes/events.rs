use rocket::{response::status, serde::json::Json};
use serde::Serialize;
use surreal_socket::dbrecord::DBRecord;

use crate::routes::generic::BearerToken;
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

/// Join Event
#[utoipa::path(
    get,
    path = "/events/{event_id}/join",
    params(
        ("event_id" = String, Path, description = "Event ID")
    ),
    description = "Join an event by ID",
    responses(
        (status = 200, description = "OK"),
    ),
    security(
        ("bearerAuth" = [])
    ),
    tag = ""
)]
#[rocket::get("/events/<event_id>/join")]
pub async fn join_event(
    bearer_token: BearerToken,
    event_id: String,
) -> Result<(), status::Custom<Json<ErrorResponse>>> {
    let client = crate::surrealdb_client().await.unwrap();
    let user = bearer_token.validate().await?;

    let mut event = Event::db_get_by_id(&client, &event_id).await.map_err(|_| {
        status::Custom(
            rocket::http::Status::NotFound,
            Json(ErrorResponse {
                error: "Event not found".to_string(),
            }),
        )
    })?;

    if let Some(event) = &mut event {
        if event.attendees.contains(&user.uuid) {
            return Err(status::Custom(
                rocket::http::Status::BadRequest,
                Json(ErrorResponse {
                    error: "User already joined the event".to_string(),
                }),
            ));
        }

        event.attendees.push(user.uuid.clone());

        event.db_overwrite(&client).await.map_err(|_| {
            status::Custom(
                rocket::http::Status::InternalServerError,
                Json(ErrorResponse {
                    error: "Failed to join event".to_string(),
                }),
            )
        })?;
    } else {
        return Err(status::Custom(
            rocket::http::Status::NotFound,
            Json(ErrorResponse {
                error: "Event not found".to_string(),
            }),
        ));
    }

    Ok(())
}

/// Leave Event
#[utoipa::path(
    get,
    path = "/events/{event_id}/leave",
    params(
        ("event_id" = String, Path, description = "Event ID")
    ),
    description = "Leave an event by ID",
    responses(
        (status = 200, description = "OK"),
    ),
    security(
        ("bearerAuth" = [])
    ),
    tag = ""
)]
#[rocket::get("/events/<event_id>/leave")]
pub async fn leave_event(
    bearer_token: BearerToken,
    event_id: String,
) -> Result<(), status::Custom<Json<ErrorResponse>>> {
    let client = crate::surrealdb_client().await.unwrap();
    let user = bearer_token.validate().await?;

    let mut event = Event::db_get_by_id(&client, &event_id).await.map_err(|_| {
        status::Custom(
            rocket::http::Status::NotFound,
            Json(ErrorResponse {
                error: "Event not found".to_string(),
            }),
        )
    })?;

    if let Some(event) = &mut event {
        if !event.attendees.contains(&user.uuid) {
            return Err(status::Custom(
                rocket::http::Status::BadRequest,
                Json(ErrorResponse {
                    error: "User is not an attendee of the event".to_string(),
                }),
            ));
        }

        event.attendees.retain(|attendee| attendee != &user.uuid);

        event.db_overwrite(&client).await.map_err(|_| {
            status::Custom(
                rocket::http::Status::InternalServerError,
                Json(ErrorResponse {
                    error: "Failed to leave event".to_string(),
                }),
            )
        })?;
    } else {
        return Err(status::Custom(
            rocket::http::Status::NotFound,
            Json(ErrorResponse {
                error: "Event not found".to_string(),
            }),
        ));
    }

    Ok(())
}
