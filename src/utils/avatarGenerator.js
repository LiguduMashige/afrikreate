/**
 * Generates a DiceBear avatar URL based on ethnicity and name
 * @param {string} name - The name of the person (used as a seed)
 * @param {string} ethnicity - The ethnicity to determine the avatar style
 * @returns {string} - The generated avatar URL
 */
export const getAvatarUrl = (name, ethnicity) => {
  // Map ethnicities to DiceBear styles
  const styleMap = {
    'black': 'avataaars',  // Avataaars has good representation for Black features
    'white': 'avataaars',  // Avataaars also works well for White features
    'indian': 'avataaars', // Avataaars has options that work for Indian features
    'coloured': 'avataaars', // Using avataaars for mixed/coloured as well
    'biracial': 'avataaars', // Using avataaars for biracial representation
    'default': 'avataaars'  // Default fallback
  };

  // Get the appropriate style, defaulting to 'avataaars' if not found
  const style = styleMap[ethnicity.toLowerCase()] || styleMap['default'];
  
  // Encode the name for the seed parameter
  const seed = encodeURIComponent(name);
  
  // Return the DiceBear URL
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&flip=true&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

/**
 * Updates the kreatives data with avatar URLs
 * @param {Array} kreatives - The array of kreative objects
 * @returns {Array} - The updated kreatives array with avatar URLs
 */
export const updateKreativesWithAvatars = (kreatives) => {
  return kreatives.map(kreative => ({
    ...kreative,
    image: getAvatarUrl(kreative.name, kreative.ethnicity || 'default')
  }));
};
