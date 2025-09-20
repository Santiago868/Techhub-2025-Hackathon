

interface Cause {
    category: string;
    causes: string[];
}

interface CausesData {
    causes: Cause[];
}

export function checkInterests(user: any, causesData: CausesData) {
    if (!user || !user.interests || !causesData?.causes) {
        return causesData;
    }

    const userInterests = user.interests;
    
    const filteredCauses = causesData.causes.map(category => ({
        ...category,
        causes: category.causes.filter(cause => !userInterests.includes(cause))
    })).filter(category => category.causes.length > 0); 
    return { causes: filteredCauses };
}

export function checkInterestsLegacy(user: any, interests: string[]) {
    if (!user || !user.interests) {
        return interests;
    }

    const userInterests = user.interests;
    const filteredInterests = interests.filter(interest => !userInterests.includes(interest));
    
    return filteredInterests;
}