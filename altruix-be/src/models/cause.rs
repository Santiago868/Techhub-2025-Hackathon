use serde::de::{Error as DeError, Unexpected};
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use std::{fmt::Display, str::FromStr};

macro_rules! cause_enum {
    ( $( $variant:ident => $label:expr ),+ $(,)? ) => {
        #[derive(utoipa::ToSchema, Clone, Debug, PartialEq, Eq, Hash)]
        pub enum Cause { $( $variant, )+ }

        impl Cause {
            pub const fn as_str(&self) -> &'static str {
                match self {
                    $( Self::$variant => $label, )+
                }
            }
        }

        impl Display for Cause {
            fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                f.write_str(self.as_str())
            }
        }

        impl FromStr for Cause {
            type Err = String;
            fn from_str(s: &str) -> Result<Self, Self::Err> {
                match s {
                    $( $label => Ok(Self::$variant), )+
                    _ => Err(format!("invalid Cause: {}", s)),
                }
            }
        }

        impl Serialize for Cause {
            fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
            where S: Serializer {
                serializer.serialize_str(self.as_str())
            }
        }

        impl<'de> Deserialize<'de> for Cause {
            fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
            where D: Deserializer<'de> {
                let s = String::deserialize(deserializer)?;
                match s.as_str() {
                    $( $label => Ok(Self::$variant), )+
                    _ => Err(D::Error::invalid_value(Unexpected::Str(&s), &"a valid Cause string")),
                }
            }
        }
    };
}

cause_enum! {
    // Community & Social Support
    FoodBanksSoupKitchen => "Food Bank/Soup Kitchen",
    HomelessShelters => "Homeless Shelters",
    OrphanagesFosterPrograms => "Orphanages/Foster Care",

    // Environment & Sustainability
    BeachPark => "Beach & Park",
    CommunityGardening => "Community Gardening",
    WildlifeRescueSupport => "Wildlife Rescue Support",

    // Health & Wellness
    Hospital => "Hospital/Medical Center",
    HealthAwareness => "Community Health Awareness",
    MentalHealth => "Mental Health Peer Support Groups",

    // Animal Welfare
    AnimalShelter => "Animal Shelter",
    AdoptionEvents => "Adoption Events",

    // Emergency & Relief
    DisasterResponse => "Disaster Response Volunteering",
    Fundraising => "Fundraising",
    Training => "First Aid Training",
}
