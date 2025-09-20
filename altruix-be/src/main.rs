use rocket::{response::Redirect, uri};
use surreal_socket::dbrecord::DBRecord;
use surreal_socket::dbrecord::SsUuid;
use surrealdb::{Surreal, engine::remote::ws::Ws, opt::auth::Root};

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
    let all_users = vec![
        User {
            uuid: SsUuid::new(),
            name: "Chris".to_string(),
            username: "chris".to_string(),
            password_hash: String::new(),
            interests: vec![
                models::cause::Cause::AssistingAtFoodBanks,
                models::cause::Cause::TreePlantingAndCommunityGardening,
            ],
        },
        User {
            uuid: SsUuid::new(),
            name: "Arnau".to_string(),
            username: "arnau".to_string(),
            password_hash: String::new(),
            interests: vec![
                models::cause::Cause::MentalHealthPeerSupportGroups,
                models::cause::Cause::FosteringPets,
            ],
        },
        User {
            uuid: SsUuid::new(),
            name: "Michelle".to_string(),
            username: "michelle".to_string(),
            password_hash: String::new(),
            interests: vec![
                models::cause::Cause::HospitalVolunteeringNonMedicalSupport,
                models::cause::Cause::BeachParkCleanups,
                models::cause::Cause::AnimalShelterSupportFeedingWalkingCleaning,
            ],
        },
    ];

    let client = surrealdb_client()
        .await
        .expect("Failed to connect to SurrealDB");

    User::db_drop_table(&client)
        .await
        .expect("Failed to drop users table");

    for user in all_users {
        user.db_create(&client)
            .await
            .expect("Failed to create user");
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
