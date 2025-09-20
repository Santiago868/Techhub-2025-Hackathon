use crate::init_demo::init_demo;
use rocket::{response::Redirect, uri};
use surrealdb::{Surreal, engine::remote::ws::Ws, opt::auth::Root};

mod init_demo;
mod models;
mod routes;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    if std::env::args().any(|arg| arg == "--init") {
        init_demo().await;
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
