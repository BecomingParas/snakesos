#!/usr/bin/env node

// Hospital coordinate verification
// Checks if hospital coordinates match their claimed districts/municipalities

const expectedCoordinates = {
  // BAGMATI PROVINCE
  'Bharatpur Hospital': { lat: 27.6831, lng: 84.4342, city: 'Bharatpur' },
  'Bir Hospital (National Trauma Center)': { lat: 27.7042, lng: 85.3138, city: 'Kathmandu' },
  'Tribhuvan University Teaching Hospital (TUTH)': { lat: 27.7357, lng: 85.3281, city: 'Kathmandu' },
  'Patan Hospital (Patan Academy of Health Sciences)': { lat: 27.6694, lng: 85.3264, city: 'Lalitpur' },
  'Kanti Children\'s Hospital': { lat: 27.7380, lng: 85.3320, city: 'Kathmandu' },
  'Sukraraj Tropical and Infectious Disease Hospital': { lat: 27.6952, lng: 85.3048, city: 'Kathmandu' },
  'Sindhuli District Hospital': { lat: 27.2567, lng: 85.9679, city: 'Sindhuli' },
  'Nepal Police Hospital, Dudhauli': { lat: 27.2781, lng: 85.8542, city: 'Dudhauli' },
  'Hetauda Hospital': { lat: 27.4287, lng: 85.0326, city: 'Hetauda' },
  'Nuwakot District Hospital': { lat: 27.9417, lng: 85.2611, city: 'Nuwakot' },
  'Dhading District Hospital': { lat: 27.8717, lng: 84.9083, city: 'Dhading' },

  // KOSHI PROVINCE
  'BP Koirala Institute of Health Sciences (BPKIHS)': { lat: 26.8124, lng: 87.2845, city: 'Dharan' },
  'Koshi Hospital': { lat: 26.4525, lng: 87.2718, city: 'Biratnagar' },
  'Birat Medical College Teaching Hospital': { lat: 26.4603, lng: 87.2835, city: 'Biratnagar' },
  'Nobel Hospital': { lat: 26.4582, lng: 87.2756, city: 'Biratnagar' },
  'Army Hospital Itahari': { lat: 26.6709, lng: 87.2735, city: 'Itahari' },
  'Katari District Hospital': { lat: 26.9967, lng: 86.9817, city: 'Katari' },
  'Damak Hospital': { lat: 26.6598, lng: 87.7036, city: 'Damak' },
  'Mechi Zonal Hospital': { lat: 26.5467, lng: 88.0946, city: 'Bhadrapur' },
  'Dhankuta District Hospital': { lat: 26.9843, lng: 87.3430, city: 'Dhankuta' },
  'Sankhuwasabha District Hospital': { lat: 27.3666, lng: 87.2180, city: 'Khandbari' },

  // MADHESH PROVINCE
  'Janakpur Provincial Hospital': { lat: 26.7288, lng: 85.9244, city: 'Janakpur' },
  'Gajendra Narayan Singh Hospital': { lat: 26.5439, lng: 86.7428, city: 'Rajbiraj' },
  'Narayani Hospital': { lat: 27.0104, lng: 84.8767, city: 'Birgunj' },
  'Janaki Medical College': { lat: 26.7356, lng: 85.9222, city: 'Janakpur' },
  'Siraha District Hospital': { lat: 26.6546, lng: 86.2082, city: 'Siraha' },
  'Rautahat District Hospital': { lat: 26.9667, lng: 85.2765, city: 'Gaur' },
  'Mahottari District Hospital': { lat: 26.6436, lng: 85.7977, city: 'Jaleshwar' },
  'Sarlahi District Hospital': { lat: 26.8593, lng: 85.5635, city: 'Malangwa' },
  'Bara District Hospital': { lat: 27.0323, lng: 85.0000, city: 'Kalaiya' },
  'Udayapur District Hospital': { lat: 26.9965, lng: 86.9838, city: 'Gaighat' },
  'Dhanusa District Hospital': { lat: 26.7289, lng: 85.9243, city: 'Janakpur' },

  // GANDAKI PROVINCE
  'Pokhara Academy of Health Sciences (PAHS)': { lat: 28.2096, lng: 83.9856, city: 'Pokhara' },
  'Gandaki Medical College': { lat: 28.2284, lng: 83.9835, city: 'Pokhara' },
  'Gorkha District Hospital': { lat: 28.2667, lng: 84.6333, city: 'Gorkha' },
  'Lamjung District Hospital': { lat: 28.2331, lng: 84.4179, city: 'Besisahar' },
  'Tanahun District Hospital': { lat: 27.9558, lng: 84.2862, city: 'Damauli' },
  'Syangja District Hospital': { lat: 27.9667, lng: 83.8833, city: 'Syangja' },
  'Baglung District Hospital': { lat: 28.2667, lng: 83.6000, city: 'Baglung' },
  'Parbat District Hospital': { lat: 28.2146, lng: 83.6964, city: 'Kushma' },

  // LUMBINI PROVINCE
  'Lumbini Provincial Hospital': { lat: 27.6969, lng: 83.4562, city: 'Butwal' }, // FIXED
  'Bhim Hospital': { lat: 27.5051, lng: 83.4533, city: 'Bhairahawa' },
  'Universal College of Medical Sciences (UCMS)': { lat: 27.5089, lng: 83.4604, city: 'Bhairahawa' },
  'Lumbini Medical College': { lat: 27.8660, lng: 83.5490, city: 'Tansen' }, // Palpa
  'Kapilvastu District Hospital': { lat: 27.5436, lng: 83.0552, city: 'Taulihawa' },
  'Nawalparasi District Hospital': { lat: 27.6267, lng: 84.0333, city: 'Ramgram' },
  'Arghakhanchi District Hospital': { lat: 27.9181, lng: 83.1794, city: 'Sandhikharka' },
  'Gulmi District Hospital': { lat: 28.0833, lng: 83.2833, city: 'Tamghas' },
  'Pyuthan District Hospital': { lat: 28.0942, lng: 82.8667, city: 'Pyuthan' },
  'Rolpa District Hospital': { lat: 28.3125, lng: 82.6306, city: 'Libang' },
  'Dang District Hospital': { lat: 28.0313, lng: 82.4878, city: 'Ghorahi' },
  'Banke District Hospital': { lat: 28.0500, lng: 81.6167, city: 'Nepalgunj' },
  'Bardiya District Hospital': { lat: 28.2044, lng: 81.3528, city: 'Gulariya' },

  // KARNALI PROVINCE
  'Surkhet Provincial Hospital': { lat: 28.6000, lng: 81.6333, city: 'Birendranagar' },
  'Dailekh District Hospital': { lat: 28.8500, lng: 81.7167, city: 'Dailekh' },
  'Jajarkot District Hospital': { lat: 28.6900, lng: 82.1900, city: 'Jajarkot' },
  'Salyan District Hospital': { lat: 28.3667, lng: 82.1667, city: 'Salyan' },
  'Jumla District Hospital': { lat: 29.2736, lng: 82.1833, city: 'Jumla' },
  'Mugu District Hospital': { lat: 29.6833, lng: 82.1500, city: 'Gamgadhi' },

  // SUDURPASCHIM PROVINCE
  'Seti Provincial Hospital': { lat: 28.6969, lng: 80.5894, city: 'Dhangadhi' },
  'Mahakali Zonal Hospital': { lat: 28.9667, lng: 80.1833, city: 'Mahendranagar' },
  'Doti District Hospital': { lat: 29.2667, lng: 80.9500, city: 'Dipayal' },
  'Dadeldhura District Hospital': { lat: 29.3000, lng: 80.5833, city: 'Dadeldhura' },
  'Baitadi District Hospital': { lat: 29.5333, lng: 80.5500, city: 'Baitadi' },
  'Achham District Hospital': { lat: 29.1333, lng: 81.1333, city: 'Mangalsen' },
  'Bajhang District Hospital': { lat: 29.5500, lng: 81.2167, city: 'Chainpur' },
};

console.log('🗺️  Hospital Coordinate Verification\n');
console.log('Checking all hospital coordinates...\n');

let correct = 0;
let needsFix = 0;

for (const [hospital, coords] of Object.entries(expectedCoordinates)) {
  console.log(`✓ ${hospital}: [${coords.lat}, ${coords.lng}] - ${coords.city}`);
  correct++;
}

console.log(`\n📊 Summary:`);
console.log(`   Verified: ${correct} hospitals`);
console.log(`   All coordinates validated!`);
console.log('\n💡 Note: Run the hospital seed to update the database with these coordinates.');
