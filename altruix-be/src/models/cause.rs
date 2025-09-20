use std::{fmt::Display, str::FromStr};

use serde::{Deserialize, Deserializer, Serialize, Serializer, de::Unexpected};

use serde::de::Error as DeError;

// In a real application, Causes should be objects with IDs and associated Categories,
// but for this hackathon, we'll just use strings.

#[derive(utoipa::ToSchema)]
pub enum Cause {
    // Community & Social Support
    AssistingAtFoodBanks,
    HelpingAtHomelessShelters,
    SupportingOrphanagesOrFosterPrograms,

    // Environment & Sustainability
    BeachParkCleanups,
    TreePlantingAndCommunityGardening,
    WildlifeRescueSupport,

    // Health & Wellness
    HospitalVolunteeringNonMedicalSupport,
    BloodDrivesAndHealthAwarenessCampaigns,
    MentalHealthPeerSupportGroups,

    // Animal Welfare
    AnimalShelterSupportFeedingWalkingCleaning,
    FosteringPets,
    FundraisingForRescueOrganizations,
    AssistingWithAdoptionEvents,

    // Emergency & Relief
    DisasterResponseVolunteeringSupplyDistributionShelterSupport,
    FundraisingForCrisisRelief,
    TrainingInFirstAidAndEmergencyReadiness,
}

impl Display for Cause {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let display_str = match self {
            // Community & Social Support
            Cause::AssistingAtFoodBanks => "Assisting at Food Banks",
            Cause::HelpingAtHomelessShelters => "Helping at Homeless Shelters",
            Cause::SupportingOrphanagesOrFosterPrograms => {
                "Supporting Orphanages or Foster Programs"
            }

            // Environment & Sustainability
            Cause::BeachParkCleanups => "Beach & Park Cleanups",
            Cause::TreePlantingAndCommunityGardening => "Tree Planting and Community Gardening",
            Cause::WildlifeRescueSupport => "Wildlife Rescue Support",

            // Health & Wellness
            Cause::HospitalVolunteeringNonMedicalSupport => {
                "Hospital Volunteering (Non-Medical Support)"
            }
            Cause::BloodDrivesAndHealthAwarenessCampaigns => {
                "Blood Drives and Health Awareness Campaigns"
            }
            Cause::MentalHealthPeerSupportGroups => "Mental Health Peer Support Groups",

            // Animal Welfare
            Cause::AnimalShelterSupportFeedingWalkingCleaning => {
                "Animal Shelter Support (Feeding, Walking, Cleaning)"
            }
            Cause::FosteringPets => "Fostering Pets",
            Cause::FundraisingForRescueOrganizations => "Fundraising for Rescue Organizations",
            Cause::AssistingWithAdoptionEvents => "Assisting with Adoption Events",

            // Emergency & Relief
            Cause::DisasterResponseVolunteeringSupplyDistributionShelterSupport => {
                "Disaster Response Volunteering (Supply Distribution, Shelter Support)"
            }
            Cause::FundraisingForCrisisRelief => "Fundraising for Crisis Relief",
            Cause::TrainingInFirstAidAndEmergencyReadiness => {
                "Training in First Aid and Emergency Readiness"
            }
        };
        write!(f, "{display_str}")
    }
}

impl FromStr for Cause {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            // Community & Social Support
            "Assisting at Food Banks" => Ok(Cause::AssistingAtFoodBanks),
            "Helping at Homeless Shelters" => Ok(Cause::HelpingAtHomelessShelters),
            "Supporting Orphanages or Foster Programs" => {
                Ok(Cause::SupportingOrphanagesOrFosterPrograms)
            }
            // Environment & Sustainability
            "Beach & Park Cleanups" => Ok(Cause::BeachParkCleanups),
            "Tree Planting and Community Gardening" => Ok(Cause::TreePlantingAndCommunityGardening),
            "Wildlife Rescue Support" => Ok(Cause::WildlifeRescueSupport),
            // Health & Wellness
            "Hospital Volunteering (Non-Medical Support)" => {
                Ok(Cause::HospitalVolunteeringNonMedicalSupport)
            }
            "Blood Drives and Health Awareness Campaigns" => {
                Ok(Cause::BloodDrivesAndHealthAwarenessCampaigns)
            }
            "Mental Health Peer Support Groups" => Ok(Cause::MentalHealthPeerSupportGroups),
            // Animal Welfare
            "Animal Shelter Support (Feeding, Walking, Cleaning)" => {
                Ok(Cause::AnimalShelterSupportFeedingWalkingCleaning)
            }
            "Fostering Pets" => Ok(Cause::FosteringPets),
            "Fundraising for Rescue Organizations" => Ok(Cause::FundraisingForRescueOrganizations),
            "Assisting with Adoption Events" => Ok(Cause::AssistingWithAdoptionEvents),
            // Emergency & Relief
            "Disaster Response Volunteering (Supply Distribution, Shelter Support)" => {
                Ok(Cause::DisasterResponseVolunteeringSupplyDistributionShelterSupport)
            }
            "Fundraising for Crisis Relief" => Ok(Cause::FundraisingForCrisisRelief),
            "Training in First Aid and Emergency Readiness" => {
                Ok(Cause::TrainingInFirstAidAndEmergencyReadiness)
            }
            _ => Err(format!("invalid Cause: {}", s)),
        }
    }
}

impl Serialize for Cause {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}

impl<'de> Deserialize<'de> for Cause {
    fn deserialize<D>(deserializer: D) -> Result<Cause, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        Cause::from_str(&s)
            .map_err(|_| D::Error::invalid_value(Unexpected::Str(&s), &"a valid Cause string"))
    }
}
