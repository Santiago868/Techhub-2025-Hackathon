#[tokio::main]
async fn main() {
    if let Err(e) = rocket::build().mount("/", rocket::routes![]).launch().await {
        panic!("Rocket failed to launch: {}", e);
    }
}
