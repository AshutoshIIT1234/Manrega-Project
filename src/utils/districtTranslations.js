// Hindi translations for Uttar Pradesh districts
export const districtNamesHindi = {
  'AGRA': 'आगरा',
  'ALIGARH': 'अलीगढ़',
  'ALLAHABAD': 'इलाहाबाद',
  'PRAYAGRAJ': 'प्रयागराज',
  'AMBEDKAR NAGAR': 'अम्बेडकर नगर',
  'AMETHI': 'अमेठी',
  'AMROHA': 'अमरोहा',
  'AURAIYA': 'औरैया',
  'AZAMGARH': 'आजमगढ़',
  'BAGHPAT': 'बागपत',
  'BAHRAICH': 'बहराइच',
  'BALLIA': 'बलिया',
  'BALRAMPUR': 'बलरामपुर',
  'BANDA': 'बांदा',
  'BARABANKI': 'बाराबंकी',
  'BAREILLY': 'बरेली',
  'BASTI': 'बस्ती',
  'BHADOHI': 'भदोही',
  'BIJNOR': 'बिजनौर',
  'BUDAUN': 'बदायूं',
  'BULANDSHAHR': 'बुलंदशहर',
  'CHANDAULI': 'चंदौली',
  'CHITRAKOOT': 'चित्रकूट',
  'DEORIA': 'देवरिया',
  'ETAH': 'एटा',
  'ETAWAH': 'इटावा',
  'AYODHYA': 'अयोध्या',
  'FAIZABAD': 'फैजाबाद',
  'FARRUKHABAD': 'फर्रुखाबाद',
  'FATEHPUR': 'फतेहपुर',
  'FIROZABAD': 'फिरोजाबाद',
  'GAUTAM BUDDHA NAGAR': 'गौतम बुद्ध नगर',
  'GAUTAM BUDH NAGAR': 'गौतम बुद्ध नगर',
  'GHAZIABAD': 'गाजियाबाद',
  'GHAZIPUR': 'गाजीपुर',
  'GONDA': 'गोंडा',
  'GORAKHPUR': 'गोरखपुर',
  'HAMIRPUR': 'हमीरपुर',
  'HAPUR': 'हापुड़',
  'HARDOI': 'हरदोई',
  'HATHRAS': 'हाथरस',
  'JALAUN': 'जालौन',
  'JAUNPUR': 'जौनपुर',
  'JHANSI': 'झांसी',
  'KANNAUJ': 'कन्नौज',
  'KANPUR DEHAT': 'कानपुर देहात',
  'KANPUR NAGAR': 'कानपुर नगर',
  'KANPUR': 'कानपुर',
  'KASGANJ': 'कासगंज',
  'KAUSHAMBI': 'कौशाम्बी',
  'KUSHINAGAR': 'कुशीनगर',
  'LAKHIMPUR KHERI': 'लखीमपुर खीरी',
  'LAKHIMPUR': 'लखीमपुर',
  'LALITPUR': 'ललितपुर',
  'LUCKNOW': 'लखनऊ',
  'MAHARAJGANJ': 'महाराजगंज',
  'MAHOBA': 'महोबा',
  'MAINPURI': 'मैनपुरी',
  'MATHURA': 'मथुरा',
  'MAU': 'मऊ',
  'MEERUT': 'मेरठ',
  'MIRZAPUR': 'मिर्जापुर',
  'MORADABAD': 'मुरादाबाद',
  'MUZAFFARNAGAR': 'मुजफ्फरनगर',
  'PILIBHIT': 'पीलीभीत',
  'PRATAPGARH': 'प्रतापगढ़',
  'RAE BARELI': 'रायबरेली',
  'RAEBARELI': 'रायबरेली',
  'RAMPUR': 'रामपुर',
  'SAHARANPUR': 'सहारनपुर',
  'SAMBHAL': 'संभल',
  'SANT KABIR NAGAR': 'संत कबीर नगर',
  'SANT RAVIDAS NAGAR': 'संत रविदास नगर',
  'SHAHJAHANPUR': 'शाहजहांपुर',
  'SHAMLI': 'शामली',
  'SHRAVASTI': 'श्रावस्ती',
  'SIDDHARTHNAGAR': 'सिद्धार्थनगर',
  'SITAPUR': 'सीतापुर',
  'SONBHADRA': 'सोनभद्र',
  'SULTANPUR': 'सुल्तानपुर',
  'UNNAO': 'उन्नाव',
  'VARANASI': 'वाराणसी'
};

// Function to get district name in the selected language
export const getDistrictName = (districtName, language) => {
  if (language === 'hi' && districtName) {
    const upperName = districtName.toUpperCase().trim();
    return districtNamesHindi[upperName] || districtName;
  }
  return districtName;
};

// Function to get state name in Hindi
export const getStateName = (stateName, language) => {
  if (language === 'hi') {
    if (stateName === 'UTTAR PRADESH') return 'उत्तर प्रदेश';
    if (stateName === 'Uttar Pradesh') return 'उत्तर प्रदेश';
  }
  return stateName;
};