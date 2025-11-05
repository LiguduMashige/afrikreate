const fs = require('fs');
const path = require('path');

// Load the kreatives data
const kreativesPath = path.join(__dirname, '../src/data/kreatives.json');
const kreatives = require(kreativesPath);

// Function to generate DiceBear avatar URL
function getAvatarUrl(name, ethnicity) {
  const styleMap = {
    'black': 'avataaars',
    'white': 'avataaars',
    'indian': 'avataaars',
    'coloured': 'avataaars',
    'biracial': 'avataaars',
    'default': 'avataaars'
  };

  const style = styleMap[ethnicity?.toLowerCase()] || styleMap['default'];
  const seed = encodeURIComponent(name);
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&flip=true&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

// Update each kreative with a new avatar URL
const updatedKreatives = kreatives.map(kreative => ({
  ...kreative,
  image: getAvatarUrl(kreative.name, kreative.ethnicity || 'default')
}));

// Save the updated data back to the file
fs.writeFileSync(
  kreativesPath,
  JSON.stringify(updatedKreatives, null, 2),
  'utf8'
);

console.log('Successfully updated kreatives with DiceBear avatars!');
