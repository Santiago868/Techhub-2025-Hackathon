use surrealdb::Surreal;

use crate::models::event::Event;

pub async fn tick(client: &Surreal<surrealdb::engine::remote::ws::Client>) {
    let mut response = client
        .query("SELECT * FROM events WHERE date < time::now() AND elapsed = false")
        .await
        .unwrap();

    let unprocessed_events: Vec<Event> = response.take(0).unwrap();

    for mut event in unprocessed_events {
        event.process_elapsed().await;
    }
}
