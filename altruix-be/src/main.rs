use rocket::{response::Redirect, uri};

mod models;
mod routes;

#[tokio::main]
async fn main() {
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
