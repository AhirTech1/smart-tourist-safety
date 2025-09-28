const attractions = [
    { id: 1, name: 'City Museum', category: 'history', safetyScore: 9 },
    { id: 2, name: 'Night Market', category: 'shopping', safetyScore: 6 },
    { id: 3, name: 'Central Park', category: 'outdoors', safetyScore: 8 },
    // ... more attractions
];

const getRecommendations = (userPreferences) => {
    // userPreferences could be an object like { preferredCategory: 'history', minSafety: 7 }
    return attractions.filter(attraction => {
        return attraction.category === userPreferences.preferredCategory &&
               attraction.safetyScore >= userPreferences.minSafety;
    });
};

module.exports = { getRecommendations };