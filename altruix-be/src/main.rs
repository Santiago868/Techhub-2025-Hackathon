use chrono::DateTime;
use rocket::{response::Redirect, uri};
use surreal_socket::dbrecord::DBRecord;
use surreal_socket::dbrecord::SsUuid;
use surrealdb::{Surreal, engine::remote::ws::Ws, opt::auth::Root};

use crate::models::cause::Cause;
use crate::models::event::Event;
use crate::models::organization::Beneficiary;
use crate::models::organization::Organization;
use crate::models::user::User;

mod models;
mod routes;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    if std::env::args().any(|arg| arg == "--init") {
        init().await;
    }

    if let Err(e) = rocket::build()
        .mount(
            "/",
            rocket::routes![
                routes::openapi::rapidoc,
                routes::openapi::openapi_route,
                crate::routes::users::login,
                routes::generic::causes,
                version,
                root_redirect,
                crate::routes::events::get_events,
                crate::routes::organizations::get_organizations,
                crate::routes::events::join_event,
                crate::routes::events::leave_event,
            ],
        )
        .launch()
        .await
    {
        panic!("Rocket failed to launch: {}", e);
    }
}

async fn init() {
    println!("Running DB initialization...");
    let helping_hands_uuid = SsUuid::new();
    let green_earth_uuid = SsUuid::new();

    let all_users = vec![
        User {
            uuid: SsUuid::new(),
            name: "Chris".to_string(),
            username: "chris".to_string(),
            password_hash: String::new(),
            interests: vec![Cause::FoodBanksSoupKitchen, Cause::CommunityGardening],
            manages_orgs: vec![helping_hands_uuid.clone(), green_earth_uuid.clone()],
        },
        User {
            uuid: SsUuid::new(),
            name: "Arnau".to_string(),
            username: "arnau".to_string(),
            password_hash: String::new(),
            interests: vec![Cause::MentalHealth, Cause::AnimalShelter],
            manages_orgs: vec![green_earth_uuid.clone()],
        },
        User {
            uuid: SsUuid::new(),
            name: "Michelle".to_string(),
            username: "michelle".to_string(),
            password_hash: String::new(),
            interests: vec![
                Cause::Hospital,
                Cause::BeachPark,
                Cause::WildlifeRescueSupport,
            ],
            manages_orgs: vec![],
        },
    ];

    let client = surrealdb_client()
        .await
        .expect("Failed to connect to SurrealDB");

    User::db_drop_table(&client)
        .await
        .expect("Failed to drop users table");

    for user in &all_users {
        user.db_create(&client)
            .await
            .expect("Failed to create user");
    }

    let beach_cleanup_uuid = SsUuid::new();

    let all_orgs = vec![
        Organization {
            uuid: helping_hands_uuid,
            name: "Helping Hands".to_string(),
            causes: vec![Cause::FoodBanksSoupKitchen, Cause::OrphanagesFosterPrograms],
            location: "123 Main St, CA".to_string(),
            sponsoring: vec![Beneficiary::Event(beach_cleanup_uuid.to_uuid_string())],
        },
        Organization {
            uuid: green_earth_uuid,
            name: "Green Earth".to_string(),
            causes: vec![Cause::CommunityGardening, Cause::WildlifeRescueSupport],
            location: "456 Oak Ave, NY".to_string(),
            sponsoring: vec![],
        },
        Organization {
            uuid: SsUuid::new(),
            name: "Animal Care".to_string(),
            causes: vec![Cause::AnimalShelter, Cause::AdoptionEvents],
            location: "789 Pine Rd, TX".to_string(),
            sponsoring: vec![Beneficiary::Event(beach_cleanup_uuid.to_uuid_string())],
        },
    ];

    Organization::db_drop_table(&client)
        .await
        .expect("Failed to drop organizations table");

    for org in &all_orgs {
        org.db_create(&client)
            .await
            .expect("Failed to create organization");
    }

    let all_events = vec![Event {
        uuid: beach_cleanup_uuid,
        name: "Beach Cleanup".to_string(),
        description: "Join us for a beach cleanup event to help preserve our oceans.".to_string(),
        date: DateTime::parse_from_rfc3339("2023-10-15T10:00:00Z")
            .unwrap()
            .with_timezone(&chrono::Utc),
        location: "Santa Monica Beach, CA".to_string(),
        organization: all_orgs.clone()[1].uuid.clone(),
        causes: vec![Cause::BeachPark],
        attendees: vec![
            all_users.clone()[0].uuid.clone(),
            all_users.clone()[2].uuid.clone(),
        ],
        sponsors: vec![
            all_orgs.clone()[0].uuid.clone(),
            all_orgs.clone()[2].uuid.clone(),
        ],
    }];

    Event::db_drop_table(&client)
        .await
        .expect("Failed to drop events table");

    for event in &all_events {
        event
            .db_create(&client)
            .await
            .expect("Failed to create event");
    }

    println!("Initialization complete.");
}

/// Version
#[utoipa::path(
    post,
    path = "/version",
    description = "Get the API version",
    responses(
        (status = 200, description = "OK", body = String)
    ),
    security(),
    tag = ""
)]
#[rocket::get("/version")]
fn version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

#[rocket::get("/")]
fn root_redirect() -> Redirect {
    Redirect::to(uri!("/rapidoc"))
}

#[derive(serde::Serialize, utoipa::ToSchema)]
struct ErrorResponse {
    error: String,
}

pub async fn surrealdb_client() -> Result<Surreal<surrealdb::engine::remote::ws::Client>, String> {
    let addr = std::env::var("SURREAL_ADDRESS").unwrap_or_else(|_| "localhost:8000".to_string());
    let username = std::env::var("SURREAL_USERNAME").unwrap_or_else(|_| "admin".to_string());
    let password = std::env::var("SURREAL_PASSWORD").expect("SURREAL_PASSWORD must be set");
    let namespace = std::env::var("SURREAL_NAMESPACE").unwrap_or_else(|_| "main".to_string());
    let database = std::env::var("SURREAL_DATABASE").unwrap_or_else(|_| "main".to_string());

    let db = Surreal::new::<Ws>(addr)
        .await
        .map_err(|e| "Error connecting to SurrealDB: ".to_owned() + &e.to_string())?;

    db.signin(Root {
        username: &username,
        password: &password,
    })
    .await
    .map_err(|e| "Error signing in to SurrealDB: ".to_owned() + &e.to_string())?;

    db.use_ns(namespace)
        .use_db(database)
        .await
        .map_err(|e| "Error using namespace/database: ".to_owned() + &e.to_string())?;

    Ok(db)
}
