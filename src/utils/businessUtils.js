export const generateSearchKeywords = (business) => {
  const searchableFields = [
    business.name,
    business.description,
    business.category,
    business.address
  ].filter(Boolean); // Remove any undefined/null values

  const words = searchableFields
    .join(' ')
    .toLowerCase()
    .split(/\s+/); // Split on any whitespace

  const keywords = new Set(); // Use Set to avoid duplicates

  // Add full words
  words.forEach(word => keywords.add(word));

  // Add partial matches for each word
  words.forEach(word => {
    for (let i = 1; i <= word.length; i++) {
      keywords.add(word.substring(0, i));
    }
  });

  return Array.from(keywords);
};

export const prepareBusinessData = (businessData, userId) => {
  return {
    ...businessData,
    searchKeywords: generateSearchKeywords(businessData),
    nameLower: businessData.name.toLowerCase(),
    status: 'pending',  // Default status for new businesses
    ownerId: userId,    // Store the creator's ID
    createdAt: businessData.createdAt || new Date(),
    updatedAt: new Date()
  };
};

export const BUSINESS_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  INACTIVE: 'inactive'
}; 