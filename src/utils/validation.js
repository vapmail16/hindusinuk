export const validateProfile = (profile) => {
  const errors = {};
  
  // Phone validation
  if (profile.phoneNumber && !/^\+?[\d\s-]{10,}$/.test(profile.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number';
  }

  // Name validation
  if (profile.displayName && (profile.displayName.length < 2 || profile.displayName.length > 50)) {
    errors.displayName = 'Name must be between 2 and 50 characters';
  }

  // Address validation
  if (profile.address && profile.address.length > 200) {
    errors.address = 'Address must not exceed 200 characters';
  }

  return errors;
}; 