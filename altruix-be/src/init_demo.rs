use chrono::{DateTime, Utc};
use surreal_socket::dbrecord::{DBRecord, SsUuid};

use crate::models::cause::Cause;
use crate::models::event::Event;
use crate::models::organization::{Beneficiary, Organization};
use crate::models::user::User;
use crate::surrealdb_client;

pub async fn init_demo() {
    println!("Running DB initialization (manual)…");
    let client = surrealdb_client().await.expect("connect SurrealDB");

    // Users
    let u_chris: SsUuid<User> = SsUuid::new();
    let u_michelle: SsUuid<User> = SsUuid::new();
    let u_arnau: SsUuid<User> = SsUuid::new();
    let u_taylor: SsUuid<User> = SsUuid::new();
    let u_jordan: SsUuid<User> = SsUuid::new();

    // Orgs
    let o_helping_hands: SsUuid<Organization> = SsUuid::new(); // Chris manager
    let o_green_earth: SsUuid<Organization> = SsUuid::new(); // Chris manager
    let o_animal_care: SsUuid<Organization> = SsUuid::new(); // Arnau manager
    let o_park_pals: SsUuid<Organization> = SsUuid::new(); // extra

    // Events
    let e_beach_cleanup: SsUuid<Event> = SsUuid::new(); // hosted by Helping Hands
    let e_garden_day: SsUuid<Event> = SsUuid::new(); // hosted by Green Earth
    let e_adoption_fair: SsUuid<Event> = SsUuid::new(); // hosted by Animal Care
    let e_park_revive: SsUuid<Event> = SsUuid::new(); // hosted by Park Pals

    // Users (Chris manages 2 orgs; Arnau manages 1; Michelle none)
    let users = vec![
        User {
            uuid: u_chris.clone(),
            name: "Chris".into(),
            username: "chris".into(),
            password_hash: String::new(),
            interests: vec![Cause::CommunityGardening, Cause::FoodBanksSoupKitchen],
            manages_orgs: vec![o_helping_hands.clone(), o_green_earth.clone()],
        },
        User {
            uuid: u_michelle.clone(),
            name: "Michelle".into(),
            username: "michelle".into(),
            password_hash: String::new(),
            interests: vec![
                Cause::BeachPark,
                Cause::Hospital,
                Cause::WildlifeRescueSupport,
            ],
            manages_orgs: vec![],
        },
        User {
            uuid: u_arnau.clone(),
            name: "Arnau".into(),
            username: "arnau".into(),
            password_hash: String::new(),
            interests: vec![Cause::MentalHealth, Cause::AnimalShelter],
            manages_orgs: vec![o_animal_care.clone()],
        },
        User {
            uuid: u_taylor.clone(),
            name: "Taylor".into(),
            username: "taylor".into(),
            password_hash: String::new(),
            interests: vec![Cause::HealthAwareness],
            manages_orgs: vec![],
        },
        User {
            uuid: u_jordan.clone(),
            name: "Jordan".into(),
            username: "jordan".into(),
            password_hash: String::new(),
            interests: vec![Cause::DisasterResponse, Cause::Fundraising],
            manages_orgs: vec![],
        },
    ];

    let orgs = vec![
        Organization {
            uuid: o_helping_hands.clone(),
            name: "Helping Hands".into(),
            causes: vec![Cause::FoodBanksSoupKitchen, Cause::OrphanagesFosterPrograms],
            location: "Santa Monica, CA".into(),
            sponsoring: vec![
                Beneficiary::Event(e_beach_cleanup.to_uuid_string()),
                Beneficiary::Event(e_park_revive.to_uuid_string()),
            ],
        },
        Organization {
            uuid: o_green_earth.clone(),
            name: "Green Earth".into(),
            causes: vec![Cause::CommunityGardening, Cause::WildlifeRescueSupport],
            location: "Portland, OR".into(),
            sponsoring: vec![Beneficiary::Event(e_garden_day.to_uuid_string())],
        },
        Organization {
            uuid: o_animal_care.clone(),
            name: "Animal Care".into(),
            causes: vec![Cause::AnimalShelter, Cause::AdoptionEvents],
            location: "Austin, TX".into(),
            sponsoring: vec![
                Beneficiary::Event(e_adoption_fair.to_uuid_string()),
                Beneficiary::Event(e_park_revive.to_uuid_string()),
            ],
        },
        Organization {
            uuid: o_park_pals.clone(),
            name: "Park Pals".into(),
            causes: vec![Cause::BeachPark, Cause::CommunityGardening],
            location: "Brooklyn, NY".into(),
            sponsoring: vec![Beneficiary::Event(e_park_revive.to_uuid_string())],
        },
    ];

    // Helper for dates
    let d = |days_from_now: i64| {
        Utc::now()
            .checked_add_signed(chrono::Duration::days(days_from_now))
            .unwrap_or_else(Utc::now)
    };

    let events = vec![
        Event {
            uuid: e_beach_cleanup.clone(),
            name: "Community Beach Cleanup".into(),
            description: "Help keep the shoreline clean and protect marine life.".into(),
            date: DateTime::<Utc>::from(d(3)),
            location: "Santa Monica Beach, CA".into(),
            organization: o_helping_hands.clone(),
            causes: vec![Cause::BeachPark],
            attendees: vec![u_chris.clone(), u_michelle.clone(), u_taylor.clone()],
            sponsors: vec![o_helping_hands.clone(), o_animal_care.clone()],
        },
        Event {
            uuid: e_garden_day.clone(),
            name: "Neighborhood Gardening Day".into(),
            description: "Plant, mulch, and prep beds for spring veggies.".into(),
            date: DateTime::<Utc>::from(d(7)),
            location: "Portland, OR".into(),
            organization: o_green_earth.clone(),
            causes: vec![Cause::CommunityGardening],
            attendees: vec![u_michelle.clone(), u_jordan.clone()],
            sponsors: vec![o_green_earth.clone()],
        },
        Event {
            uuid: e_adoption_fair.clone(),
            name: "Pet Adoption Fair".into(),
            description: "Meet adoptable pets and support local shelters.".into(),
            date: DateTime::<Utc>::from(d(12)),
            location: "Austin, TX".into(),
            organization: o_animal_care.clone(),
            causes: vec![Cause::AdoptionEvents, Cause::AnimalShelter],
            attendees: vec![u_arnau.clone(), u_michelle.clone()],
            sponsors: vec![o_animal_care.clone()],
        },
        Event {
            uuid: e_park_revive.clone(),
            name: "Park Revival Day".into(),
            description: "Trail cleanup, tree care, and picnic tables refresh.".into(),
            date: DateTime::<Utc>::from(d(16)),
            location: "Prospect Park, Brooklyn, NY".into(),
            organization: o_park_pals.clone(),
            causes: vec![Cause::BeachPark, Cause::CommunityGardening],
            attendees: vec![u_taylor.clone(), u_jordan.clone()],
            sponsors: vec![o_park_pals.clone(), o_helping_hands.clone()],
        },
    ];

    User::db_drop_table(&client).await.expect("drop users");
    Organization::db_drop_table(&client)
        .await
        .expect("drop orgs");
    Event::db_drop_table(&client).await.expect("drop events");

    for u in &users {
        u.db_create(&client).await.expect("create user");
    }
    for o in &orgs {
        o.db_create(&client).await.expect("create org");
    }
    for e in &events {
        e.db_create(&client).await.expect("create event");
    }

    println!("Initialization complete (manual).");
}
