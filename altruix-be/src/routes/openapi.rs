use crate::__path_version;
use rocket::response::content::RawHtml;
use rocket::{get, serde::json::Json};
use utoipa::Modify;
use utoipa::OpenApi;
use utoipa::openapi::security::{HttpAuthScheme, HttpBuilder, SecurityScheme};
use utoipa_rapidoc::RapiDoc;

#[derive(OpenApi)]
#[openapi(
    info(
        title = "Altruix API",
        description = "https://github.com/Santiago868/Techhub-2025-Hackathon/tree/main/altruix-be"
    ),
    paths(version, crate::routes::users::login, crate::routes::generic::causes),
    components(schemas(crate::models::user::UserResponse, crate::models::cause::Cause)),
    tags(),
    security(
        ("bearerAuth" = [])
    ),
    modifiers(&BearerTokenSecurity)
)]
pub struct ApiDoc;

#[get("/openapi.json")]
pub fn openapi_route() -> Json<utoipa::openapi::OpenApi> {
    Json(ApiDoc::openapi())
}

#[get("/rapidoc")]
pub fn rapidoc() -> RawHtml<String> {
    RawHtml(RapiDoc::new("/openapi.json").to_html())
}

pub struct BearerTokenSecurity;

impl Modify for BearerTokenSecurity {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        let components = openapi.components.get_or_insert_with(Default::default);

        components.add_security_scheme(
            "bearerAuth",
            SecurityScheme::Http(
                HttpBuilder::new()
                    .scheme(HttpAuthScheme::Bearer)
                    .bearer_format("JWT")
                    .build(),
            ),
        );
    }
}
