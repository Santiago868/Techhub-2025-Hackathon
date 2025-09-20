use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use surreal_socket::dbrecord::{DBRecord, SsUuid};

use crate::models::{
    cause::Cause,
    organization::{Organization, OrganizationResponse},
    user::User,
};

#[derive(Deserialize, Serialize)]
pub struct Event {
    pub uuid: SsUuid<Event>,
    pub organization: SsUuid<Organization>,
    pub description: String,
    pub name: String,
    pub date: DateTime<Utc>,
    pub attendees: Vec<SsUuid<User>>,
    pub sponsors: Vec<SsUuid<Organization>>,
    pub location: String,
    pub causes: Vec<Cause>,
    pub elapsed: bool,
}

impl Event {
    pub async fn as_response(&self) -> EventResponse {
        let client = crate::surrealdb_client().await.unwrap();
        let org = self.organization.db_fetch(&client).await.unwrap();

        let mut sponsors = Vec::new();

        for sponsor_id in &self.sponsors {
            if let Ok(sponsor) = sponsor_id.db_fetch(&client).await {
                sponsors.push(sponsor.into());
            }
        }

        EventResponse {
            uuid: self.uuid.to_uuid_string(),
            name: self.name.clone(),
            organization: org.into(),
            description: self.description.clone(),
            timestamp: self.date.timestamp_millis(),
            attendees_count: self.attendees.len() as i64,
            sponsors,
            location: self.location.clone(),
            causes: self.causes.clone(),
            elapsed: self.elapsed,
        }
    }

    pub async fn process_elapsed(&mut self) {
        let now = Utc::now();
        if self.date < now && !self.elapsed {
            self.elapsed = true;
            let client = crate::surrealdb_client().await.unwrap();
            let _ = self.db_overwrite(&client).await;
            for attendee in &self.attendees {
                let mut attendee_user = attendee.db_fetch(&client).await.unwrap();
                attendee_user.points += 10; // arbitrary
                let _ = attendee_user.db_overwrite(&client).await;
            }
        }
    }
}

impl DBRecord for Event {
    const TABLE_NAME: &'static str = "events";

    fn uuid(&self) -> SsUuid<Self> {
        self.uuid.clone()
    }
}

#[derive(Serialize, utoipa::ToSchema)]
pub struct EventResponse {
    pub uuid: String,
    pub name: String,
    pub organization: OrganizationResponse,
    pub description: String,
    pub timestamp: i64,
    pub attendees_count: i64,
    pub sponsors: Vec<OrganizationResponse>,
    pub location: String,
    pub causes: Vec<Cause>,
    pub elapsed: bool,
}
