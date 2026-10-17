import { Booth } from '../types/electoral';
import { inferBoothCoordinatesAndSector } from './form20Store';

interface ACMetaConfig {
  acNumber: number;
  acName: string;
  winnerCand: string;
  winnerParty: string;
  runnerCand: string;
  runnerParty: string;
  thirdCand: string;
  thirdParty: string;
  fourthCand: string;
  fourthParty: string;
  overallWinShare: number;
  overallRunShare: number;
  boothTemplates: {
    name: string;
    locationName: string;
    subLocality?: string;
    community: string;
    // Bias factors for booth: >1 means winner overperformed, <1 means runner overperformed
    winnerBias: number;
    baseTurnout: number;
  }[];
}

const SIDDHARTHNAGAR_ACS_CONFIG: Record<number, ACMetaConfig> = {
  // AC 302: Shohratgarh
  302: {
    acNumber: 302,
    acName: 'Shohratgarh',
    winnerCand: 'Vinay Verma',
    winnerParty: 'AD_S',
    runnerCand: 'Prem Chand Nishad',
    runnerParty: 'SBSP',
    thirdCand: 'Chaudhary Ravindra Pratap',
    thirdParty: 'BSP',
    fourthCand: 'Radha Raman Pandey',
    fourthParty: 'INDIA_INC',
    overallWinShare: 37.46,
    overallRunShare: 22.56,
    boothTemplates: [
      // Shohratgarh Municipal Core (Central)
      { name: 'Prathmik Vidyalaya Shohratgarh Nagar Ward 1 (Purab)', locationName: 'Shohratgarh Municipal Core', community: 'OBC & Trader Composite', winnerBias: 1.35, baseTurnout: 54.2 },
      { name: 'Prathmik Vidyalaya Shohratgarh Nagar Ward 2 (Paschim)', locationName: 'Shohratgarh Municipal Core', community: 'Upper Castes (Brahmin / Bania)', winnerBias: 1.40, baseTurnout: 56.1 },
      { name: 'Kanya Purva Madhyamik Vidyalaya Shohratgarh Ward 3', locationName: 'Shohratgarh Municipal Core', community: 'OBC (Kurmi, Maurya)', winnerBias: 1.30, baseTurnout: 55.0 },
      { name: 'Tahsil Parisar Shohratgarh Administrative Block', locationName: 'Shohratgarh Municipal Core', community: 'General & Service Composite', winnerBias: 1.25, baseTurnout: 53.4 },
      { name: 'Prathmik Vidyalaya Station Road Shohratgarh', locationName: 'Shohratgarh Municipal Core', community: 'Trader & Muslim Minority', winnerBias: 0.95, baseTurnout: 52.8 },
      { name: 'Purva Madhyamik Vidyalaya Shohratgarh Khas Room 1', locationName: 'Shohratgarh Municipal Core', community: 'OBC (Kurmi / Yadav)', winnerBias: 1.20, baseTurnout: 54.6 },
      { name: 'Purva Madhyamik Vidyalaya Shohratgarh Khas Room 2', locationName: 'Shohratgarh Municipal Core', community: 'OBC & SC Mixed', winnerBias: 1.15, baseTurnout: 53.9 },

      // Barhni Nepal Frontier Sector (West)
      { name: 'Prathmik Vidyalaya Barhni Station Road Ward 1', locationName: 'Barhni Nepal Frontier Sector', community: 'Traders & Border Transporters', winnerBias: 1.28, baseTurnout: 55.7 },
      { name: 'Kanya Purva Madhyamik Vidyalaya Barhni Bazar (North)', locationName: 'Barhni Nepal Frontier Sector', community: 'Muslim Minority & Traders', winnerBias: 0.82, baseTurnout: 58.2 },
      { name: 'Prathmik Vidyalaya Thana Barhni Border Gate', locationName: 'Barhni Nepal Frontier Sector', community: 'General Composite', winnerBias: 1.32, baseTurnout: 51.5 },
      { name: 'Nagar Panchayat Karyalaya Barhni Ward 3', locationName: 'Barhni Nepal Frontier Sector', community: 'OBC (Maurya / Bania)', winnerBias: 1.25, baseTurnout: 53.0 },
      { name: 'Prathmik Vidyalaya Purani Badhni Room 1', locationName: 'Barhni Nepal Frontier Sector', community: 'Muslim & SC Composite', winnerBias: 0.88, baseTurnout: 56.4 },
      { name: 'Prathmik Vidyalaya Purani Badhni Room 2', locationName: 'Barhni Nepal Frontier Sector', community: 'SC (Jatav / Pasi)', winnerBias: 0.85, baseTurnout: 54.1 },
      { name: 'Gram Panchayat Bhawan Barhni Rural West', locationName: 'Barhni Nepal Frontier Sector', community: 'OBC (Kurmi / Nishad)', winnerBias: 1.05, baseTurnout: 52.0 },

      // Northern Terai Foothills (North)
      { name: 'Prathmik Vidyalaya Mudila Terai Border (North)', locationName: 'Northern Terai Foothills', community: 'OBC (Tharu / Kurmi / Nishad)', winnerBias: 1.12, baseTurnout: 51.2 },
      { name: 'Prathmik Vidyalaya Gajraula Khas', locationName: 'Northern Terai Foothills', community: 'OBC (Kurmi / Maurya)', winnerBias: 1.22, baseTurnout: 50.8 },
      { name: 'Purva Madhyamik Vidyalaya Madhavpur Terai', locationName: 'Northern Terai Foothills', community: 'SC (Pasi / Chamar)', winnerBias: 0.90, baseTurnout: 49.6 },
      { name: 'Prathmik Vidyalaya Dhenglapur Uttar', locationName: 'Northern Terai Foothills', community: 'OBC (Nishad / Kewat)', winnerBias: 0.82, baseTurnout: 53.1 },
      { name: 'Prathmik Vidyalaya Shankerpur Terai Forest Marg', locationName: 'Northern Terai Foothills', community: 'OBC & Tribal Mix', winnerBias: 1.08, baseTurnout: 48.9 },
      { name: 'Gram Panchayat Bhawan Baghaura Border Belt', locationName: 'Northern Terai Foothills', community: 'SC & OBC Composite', winnerBias: 0.94, baseTurnout: 50.5 },

      // Khuniyaon Agricultural Plains (South)
      { name: 'Gram Panchayat Bhawan Khuniyaon (South)', locationName: 'Khuniyaon Agricultural Plains', community: 'OBC (Kurmi, Yadav)', winnerBias: 1.18, baseTurnout: 53.5 },
      { name: 'Prathmik Vidyalaya Khuniaon Buzurg Room 1', locationName: 'Khuniyaon Agricultural Plains', community: 'OBC (Kurmi / Patel)', winnerBias: 1.34, baseTurnout: 54.8 },
      { name: 'Prathmik Vidyalaya Khuniaon Buzurg Room 2', locationName: 'Khuniyaon Agricultural Plains', community: 'OBC (Kurmi, Maurya)', winnerBias: 1.30, baseTurnout: 52.6 },
      { name: 'Purva Madhyamik Vidyalaya Bhatwanwa', locationName: 'Khuniyaon Agricultural Plains', community: 'OBC (Nishad / Mallah)', winnerBias: 0.78, baseTurnout: 55.4 },
      { name: 'Prathmik Vidyalaya Sikahara Dakshin', locationName: 'Khuniyaon Agricultural Plains', community: 'SC (Jatav / Dhobi)', winnerBias: 0.86, baseTurnout: 49.8 },
      { name: 'Prathmik Vidyalaya Karahi Khas Agrarian', locationName: 'Khuniyaon Agricultural Plains', community: 'OBC (Kurmi, Yadav)', winnerBias: 1.14, baseTurnout: 51.7 },
      { name: 'Gram Panchayat Bhawan Bankata South', locationName: 'Khuniyaon Agricultural Plains', community: 'OBC (Yadav / Maurya)', winnerBias: 0.84, baseTurnout: 53.2 },

      // Chilhiya / East Border Belt (East)
      { name: 'Prathmik Vidyalaya Chilhiya (East) Room 1', locationName: 'Chilhiya / East Border Belt', community: 'Upper Castes & OBC', winnerBias: 1.26, baseTurnout: 54.0 },
      { name: 'Prathmik Vidyalaya Chilhiya (East) Room 2', locationName: 'Chilhiya / East Border Belt', community: 'SC (Chamar / Pasi)', winnerBias: 0.92, baseTurnout: 51.8 },
      { name: 'Purva Madhyamik Vidyalaya Parsa Buzurg', locationName: 'Chilhiya / East Border Belt', community: 'OBC (Kurmi, Bania)', winnerBias: 1.28, baseTurnout: 53.6 },
      { name: 'Prathmik Vidyalaya Bardiha Purab', locationName: 'Chilhiya / East Border Belt', community: 'OBC (Maurya / Nishad)', winnerBias: 0.98, baseTurnout: 52.1 },
      { name: 'Prathmik Vidyalaya Semra Chilhiya Naugarh Marg', locationName: 'Chilhiya / East Border Belt', community: 'General & OBC Composite', winnerBias: 1.20, baseTurnout: 50.9 },
      { name: 'Gram Panchayat Bhawan Parsa Khas', locationName: 'Chilhiya / East Border Belt', community: 'OBC (Kurmi / Yadav)', winnerBias: 1.15, baseTurnout: 52.4 },
      { name: 'Prathmik Vidyalaya Dhebarua Purvi Marg', locationName: 'Chilhiya / East Border Belt', community: 'Muslim & OBC Composite', winnerBias: 0.88, baseTurnout: 55.2 },
      { name: 'Kanya Pathshala Chilhiya Bazar', locationName: 'Chilhiya / East Border Belt', community: 'Traders & OBC Composite', winnerBias: 1.24, baseTurnout: 53.8 }
    ]
  },

  // AC 303: Kapilvastu (SC)
  303: {
    acNumber: 303,
    acName: 'Kapilvastu',
    winnerCand: 'Shyam Dhani',
    winnerParty: 'NDA_BJP',
    runnerCand: 'Vinay Paswan',
    runnerParty: 'SP',
    thirdCand: 'Kanhaiya Prasad',
    thirdParty: 'BSP',
    fourthCand: 'Devendra Singh Guddu',
    fourthParty: 'INDIA_INC',
    overallWinShare: 48.72,
    overallRunShare: 36.46,
    boothTemplates: [
      // Naugarh District HQ & Rail Corridor (South-West)
      { name: 'Prathmik Vidyalaya Naugarh Collectorate Campus', locationName: 'Naugarh District HQ & Rail Corridor', community: 'Government Staff & General', winnerBias: 1.38, baseTurnout: 57.2 },
      { name: 'Purva Madhyamik Vidyalaya Naugarh Railway Colony', locationName: 'Naugarh District HQ & Rail Corridor', community: 'Railway Staff & General', winnerBias: 1.32, baseTurnout: 58.5 },
      { name: 'Kendriya Vidyalaya Siddharthnagar District HQ', locationName: 'Naugarh District HQ & Rail Corridor', community: 'General (Brahmin / Kayastha)', winnerBias: 1.42, baseTurnout: 60.1 },
      { name: 'Vikas Bhawan Meeting Hall Naugarh', locationName: 'Naugarh District HQ & Rail Corridor', community: 'Civil Services & Composite', winnerBias: 1.30, baseTurnout: 56.4 },
      { name: 'Nagar Palika Parishad Naugarh Ward 1 (Station)', locationName: 'Naugarh District HQ & Rail Corridor', community: 'Trader & Bania Composite', winnerBias: 1.35, baseTurnout: 55.8 },
      { name: 'Nagar Palika Parishad Naugarh Ward 2 (Civil Lines)', locationName: 'Naugarh District HQ & Rail Corridor', community: 'Upper Castes (Thakur / Brahmin)', winnerBias: 1.40, baseTurnout: 59.0 },
      { name: 'Prathmik Vidyalaya District Hospital Parisar Naugarh', locationName: 'Naugarh District HQ & Rail Corridor', community: 'Service Class & OBC', winnerBias: 1.26, baseTurnout: 56.3 },
      { name: 'Purva Madhyamik Vidyalaya Police Lines Naugarh', locationName: 'Naugarh District HQ & Rail Corridor', community: 'Police Families & Staff', winnerBias: 1.36, baseTurnout: 62.0 },

      // Kapilvastu & Piprahwa Heritage Belt (North-East)
      { name: 'Prathmik Vidyalaya Piprahwa Buddha Stupa Ward', locationName: 'Kapilvastu & Piprahwa Heritage Belt', community: 'Heritage Tourism & OBC', winnerBias: 1.25, baseTurnout: 56.8 },
      { name: 'Purva Madhyamik Vidyalaya Kapilvastu Khas (North-East)', locationName: 'Kapilvastu & Piprahwa Heritage Belt', community: 'SC (Jatav / Pasi)', winnerBias: 0.95, baseTurnout: 54.2 },
      { name: 'Archaeological Museum Campus Kapilvastu', locationName: 'Kapilvastu & Piprahwa Heritage Belt', community: 'General & Staff', winnerBias: 1.30, baseTurnout: 57.0 },
      { name: 'Prathmik Vidyalaya Ganwaria Buddhist Ruins', locationName: 'Kapilvastu & Piprahwa Heritage Belt', community: 'OBC (Kurmi / Maurya)', winnerBias: 1.15, baseTurnout: 53.6 },
      { name: 'Gram Panchayat Bhawan Piprahwa Rural', locationName: 'Kapilvastu & Piprahwa Heritage Belt', community: 'SC (Chamar / Balmiki)', winnerBias: 0.92, baseTurnout: 52.8 },
      { name: 'Prathmik Vidyalaya Mahilwar Khas', locationName: 'Kapilvastu & Piprahwa Heritage Belt', community: 'OBC (Yadav / Kurmi)', winnerBias: 0.88, baseTurnout: 55.0 },

      // Birdpur Central Block (Central)
      { name: 'Prathmik Vidyalaya Birdpur Estate (Central) Room 1', locationName: 'Birdpur Central Block', community: 'Estate Settlers & OBC', winnerBias: 1.22, baseTurnout: 54.9 },
      { name: 'Prathmik Vidyalaya Birdpur Estate (Central) Room 2', locationName: 'Birdpur Central Block', community: 'SC (Pasi / Jatav)', winnerBias: 0.98, baseTurnout: 53.5 },
      { name: 'Block Development Office Campus Birdpur', locationName: 'Birdpur Central Block', community: 'General & Service Composite', winnerBias: 1.20, baseTurnout: 55.4 },
      { name: 'Kanya Pathshala Birdpur No. 1', locationName: 'Birdpur Central Block', community: 'OBC (Maurya / Patel)', winnerBias: 1.18, baseTurnout: 56.2 },
      { name: 'Purva Madhyamik Vidyalaya Mahuwa Buzurg', locationName: 'Birdpur Central Block', community: 'OBC (Yadav / Nishad)', winnerBias: 0.84, baseTurnout: 57.0 },
      { name: 'Prathmik Vidyalaya Hata Bazar Birdpur', locationName: 'Birdpur Central Block', community: 'Traders & Muslim Minority', winnerBias: 0.82, baseTurnout: 58.6 },

      // Uska Bazar Commercial Mandi Sector (South-East)
      { name: 'Kanya Pathshala Uska Bazar Mandi Parishad', locationName: 'Uska Bazar Commercial Mandi Sector', community: 'Grain Traders (Bania / Gupta)', winnerBias: 1.45, baseTurnout: 61.2 },
      { name: 'Prathmik Vidyalaya Uska Station Marg (South-East)', locationName: 'Uska Bazar Commercial Mandi Sector', community: 'Commercial Workers & OBC', winnerBias: 1.28, baseTurnout: 56.0 },
      { name: 'Nagar Panchayat Bhawan Uska Bazar Ward 2', locationName: 'Uska Bazar Commercial Mandi Sector', community: 'Traders & Composite', winnerBias: 1.34, baseTurnout: 58.4 },
      { name: 'Purva Madhyamik Vidyalaya Retwa Uska', locationName: 'Uska Bazar Commercial Mandi Sector', community: 'OBC (Kurmi / Yadav)', winnerBias: 0.96, baseTurnout: 54.7 },
      { name: 'Gram Panchayat Bhawan Uska Rural East', locationName: 'Uska Bazar Commercial Mandi Sector', community: 'SC (Jatav / Dhobi)', winnerBias: 0.90, baseTurnout: 52.4 },

      // Mohana Nepal Border Post (North)
      { name: 'Prathmik Vidyalaya Mohana Nepal Border Post (North)', locationName: 'Mohana Nepal Border Post', community: 'Border Guard Families & OBC', winnerBias: 1.24, baseTurnout: 53.0 },
      { name: 'Thana Mohana Border Police Parisar', locationName: 'Mohana Nepal Border Post', community: 'Security Staff & General', winnerBias: 1.35, baseTurnout: 56.8 },
      { name: 'Purva Madhyamik Vidyalaya Sohas Frontier', locationName: 'Mohana Nepal Border Post', community: 'OBC (Nishad / Kewat)', winnerBias: 0.85, baseTurnout: 51.5 },
      { name: 'Prathmik Vidyalaya Alidapur Khas Room 1', locationName: 'Mohana Nepal Border Post', community: 'SC (Paswan / Chamar)', winnerBias: 0.86, baseTurnout: 53.8 },
      { name: 'Prathmik Vidyalaya Alidapur Khas Room 2', locationName: 'Mohana Nepal Border Post', community: 'OBC (Kurmi / Maurya)', winnerBias: 1.10, baseTurnout: 52.1 },
      { name: 'Gram Panchayat Bhawan Kakrahwa Border Gate', locationName: 'Mohana Nepal Border Post', community: 'Custom Clearance & Muslim Mix', winnerBias: 0.90, baseTurnout: 54.9 }
    ]
  },

  // AC 304: Bansi
  304: {
    acNumber: 304,
    acName: 'Bansi',
    winnerCand: 'Jai Pratap Singh',
    winnerParty: 'NDA_BJP',
    runnerCand: 'Monu Dubey',
    runnerParty: 'SP',
    thirdCand: 'Radheshyam Pandey',
    thirdParty: 'BSP',
    fourthCand: 'Kiran Shukla',
    fourthParty: 'INDIA_INC',
    overallWinShare: 44.82,
    overallRunShare: 34.04,
    boothTemplates: [
      // Bansi Historical Rapti Riverfront (Central)
      { name: 'Nagar Palika Karyalaya Bansi Ward 1 (Rapti Riverfront)', locationName: 'Bansi Historical Rapti Riverfront', community: 'Urban Brahmin / Kayastha', winnerBias: 1.36, baseTurnout: 53.0 },
      { name: 'Prathmik Vidyalaya Bansi Rajmahal Gate', locationName: 'Bansi Historical Rapti Riverfront', community: 'Royal Lineage & Upper Castes', winnerBias: 1.48, baseTurnout: 55.4 },
      { name: 'Purva Madhyamik Vidyalaya Bansi Tahsil Marg', locationName: 'Bansi Historical Rapti Riverfront', community: 'Civil Service & Lawyers', winnerBias: 1.28, baseTurnout: 51.2 },
      { name: 'Ratan Sen Inter College Bansi Main Parisar', locationName: 'Bansi Historical Rapti Riverfront', community: 'Academic Staff & Composite', winnerBias: 1.32, baseTurnout: 52.8 },
      { name: 'Kanya Pathshala Bansi Purana Bazar', locationName: 'Bansi Historical Rapti Riverfront', community: 'Traders & Bania', winnerBias: 1.35, baseTurnout: 54.6 },
      { name: 'Prathmik Vidyalaya Rapti Ghat Colony', locationName: 'Bansi Historical Rapti Riverfront', community: 'OBC (Nishad / Mallah)', winnerBias: 0.90, baseTurnout: 48.7 },
      { name: 'Nagar Palika Parishad Bansi Ward 4', locationName: 'Bansi Historical Rapti Riverfront', community: 'Muslim Minority & Weavers', winnerBias: 0.72, baseTurnout: 56.0 },

      // Mithwal Northern Agrarian Plains (North-East)
      { name: 'Prathmik Vidyalaya Mithwal Block HQ (North-East)', locationName: 'Mithwal Northern Agrarian Plains', community: 'OBC (Kurmi / Maurya)', winnerBias: 1.24, baseTurnout: 50.8 },
      { name: 'Kanya Pathshala Mithwal Khas', locationName: 'Mithwal Northern Agrarian Plains', community: 'Upper Castes (Brahmin / Rajput)', winnerBias: 1.30, baseTurnout: 51.5 },
      { name: 'Purva Madhyamik Vidyalaya Bhadokhar', locationName: 'Mithwal Northern Agrarian Plains', community: 'OBC (Yadav / Kurmi)', winnerBias: 0.88, baseTurnout: 52.4 },
      { name: 'Prathmik Vidyalaya Pachperwa Marg North', locationName: 'Mithwal Northern Agrarian Plains', community: 'SC (Jatav / Pasi)', winnerBias: 0.92, baseTurnout: 47.9 },
      { name: 'Gram Panchayat Bhawan Belauri Buzurg', locationName: 'Mithwal Northern Agrarian Plains', community: 'OBC (Maurya / Kushwaha)', winnerBias: 1.18, baseTurnout: 49.6 },
      { name: 'Prathmik Vidyalaya Basantpur Mithwal', locationName: 'Mithwal Northern Agrarian Plains', community: 'OBC (Kurmi, Yadav)', winnerBias: 0.95, baseTurnout: 48.2 },

      // Khesraha South-East Delta (South-East)
      { name: 'Gram Panchayat Bhawan Khesraha (South-East)', locationName: 'Khesraha South-East Delta', community: 'OBC (Kurmi / Patel)', winnerBias: 1.15, baseTurnout: 51.2 },
      { name: 'Prathmik Vidyalaya Khesraha Dakshini Room 1', locationName: 'Khesraha South-East Delta', community: 'OBC (Yadav / Ahir)', winnerBias: 0.75, baseTurnout: 54.8 },
      { name: 'Prathmik Vidyalaya Khesraha Dakshini Room 2', locationName: 'Khesraha South-East Delta', community: 'Muslim & SC Composite', winnerBias: 0.70, baseTurnout: 55.6 },
      { name: 'Purva Madhyamik Vidyalaya Semariyawan Border Khesraha', locationName: 'Khesraha South-East Delta', community: 'Muslim Weavers (Ansari)', winnerBias: 0.65, baseTurnout: 57.2 },
      { name: 'Thana Khesraha Parisar', locationName: 'Khesraha South-East Delta', community: 'General Staff', winnerBias: 1.25, baseTurnout: 50.0 },
      { name: 'Prathmik Vidyalaya Tilakpur South', locationName: 'Khesraha South-East Delta', community: 'SC (Chamar / Dhobi)', winnerBias: 0.86, baseTurnout: 48.4 },
      { name: 'Gram Panchayat Bhawan Majhariya Buzurg', locationName: 'Khesraha South-East Delta', community: 'OBC (Yadav / Maurya)', winnerBias: 0.80, baseTurnout: 52.1 },

      // Western Canal Farmlands (West)
      { name: 'Prathmik Vidyalaya Belbanwa (West)', locationName: 'Western Canal Farmlands', community: 'OBC (Kurmi / Patel)', winnerBias: 1.20, baseTurnout: 49.8 },
      { name: 'Purva Madhyamik Vidyalaya Tilkar Farmlands', locationName: 'Western Canal Farmlands', community: 'Upper Castes (Thakur / Rajput)', winnerBias: 1.34, baseTurnout: 52.0 },
      { name: 'Prathmik Vidyalaya Narkatha Buzurg', locationName: 'Western Canal Farmlands', community: 'SC (Jatav / Pasi)', winnerBias: 0.90, baseTurnout: 47.6 },
      { name: 'Gram Panchayat Bhawan Sonkhar Canal Road', locationName: 'Western Canal Farmlands', community: 'OBC (Nishad / Mallah)', winnerBias: 0.88, baseTurnout: 48.5 },
      { name: 'Prathmik Vidyalaya Pipra Gautam West', locationName: 'Western Canal Farmlands', community: 'Upper Castes (Brahmin)', winnerBias: 1.38, baseTurnout: 53.4 },
      { name: 'Kanya Pathshala Narkatha', locationName: 'Western Canal Farmlands', community: 'OBC (Maurya / Kurmi)', winnerBias: 1.12, baseTurnout: 48.0 }
    ]
  },

  // AC 305: Itwa
  305: {
    acNumber: 305,
    acName: 'Itwa',
    winnerCand: 'Mata Prasad Pandey',
    winnerParty: 'SP',
    runnerCand: 'Satish Chandra Dwiwedi',
    runnerParty: 'NDA_BJP',
    thirdCand: 'Hari Shankar Singh',
    thirdParty: 'BSP',
    fourthCand: 'Arshad Khurshid',
    fourthParty: 'INDIA_INC',
    overallWinShare: 38.54,
    overallRunShare: 37.55,
    boothTemplates: [
      // Itwa Tahsil Municipal Core (Central)
      { name: 'Prathmik Vidyalaya Itwa Khas (Central Core)', locationName: 'Itwa Tahsil Municipal Core', community: 'Brahmin & Trader Composite', winnerBias: 0.92, baseTurnout: 52.4 },
      { name: 'Purva Madhyamik Vidyalaya Itwa Tahsil Parisar', locationName: 'Itwa Tahsil Municipal Core', community: 'Advocates & Service Class', winnerBias: 0.98, baseTurnout: 50.8 },
      { name: 'Kanya Pathshala Itwa Bazar Ward 3', locationName: 'Itwa Tahsil Municipal Core', community: 'Traders (Bania / Gupta)', winnerBias: 0.82, baseTurnout: 53.6 },
      { name: 'Nagar Panchayat Karyalaya Itwa Ward 1', locationName: 'Itwa Tahsil Municipal Core', community: 'Muslim Minority & Weavers', winnerBias: 1.35, baseTurnout: 56.8 },
      { name: 'Nagar Panchayat Karyalaya Itwa Ward 2', locationName: 'Itwa Tahsil Municipal Core', community: 'Brahmin & Upper Castes', winnerBias: 0.78, baseTurnout: 54.0 },
      { name: 'Community Health Centre Parisar Itwa', locationName: 'Itwa Tahsil Municipal Core', community: 'Medical Staff & Composite', winnerBias: 1.02, baseTurnout: 49.5 },
      { name: 'Purva Madhyamik Vidyalaya College Road Itwa', locationName: 'Itwa Tahsil Municipal Core', community: 'Youth & Academic Composite', winnerBias: 1.08, baseTurnout: 51.0 },

      // Biskohar Western Border Mandi (West)
      { name: 'Prathmik Vidyalaya Biskohar Border Mandi (West) Room 1', locationName: 'Biskohar Western Border Mandi', community: 'Galla Mandi Traders (Bania)', winnerBias: 0.85, baseTurnout: 54.2 },
      { name: 'Prathmik Vidyalaya Biskohar Border Mandi (West) Room 2', locationName: 'Biskohar Western Border Mandi', community: 'Muslim Traders & Artisans', winnerBias: 1.42, baseTurnout: 58.0 },
      { name: 'Purva Madhyamik Vidyalaya Biskohar Balrampur Marg', locationName: 'Biskohar Western Border Mandi', community: 'OBC (Kurmi / Maurya)', winnerBias: 1.05, baseTurnout: 51.4 },
      { name: 'Nagar Panchayat Bhawan Biskohar Ward 2', locationName: 'Biskohar Western Border Mandi', community: 'SC (Jatav / Dhobi)', winnerBias: 1.12, baseTurnout: 48.6 },
      { name: 'Thana Biskohar Police Gate Parisar', locationName: 'Biskohar Western Border Mandi', community: 'Security & General', winnerBias: 0.80, baseTurnout: 49.8 },
      { name: 'Prathmik Vidyalaya Biskohar Paschim Mandi', locationName: 'Biskohar Western Border Mandi', community: 'OBC (Yadav / Ahir)', winnerBias: 1.40, baseTurnout: 55.2 },

      // Bhanwapur Southern Green Belt (South)
      { name: 'Gram Panchayat Bhawan Bhanwapur (South)', locationName: 'Bhanwapur Southern Green Belt', community: 'OBC (Yadav / Kurmi)', winnerBias: 1.38, baseTurnout: 53.6 },
      { name: 'Prathmik Vidyalaya Bhanwapur Primary Room 1', locationName: 'Bhanwapur Southern Green Belt', community: 'OBC (Yadav / Ahir)', winnerBias: 1.45, baseTurnout: 54.8 },
      { name: 'Prathmik Vidyalaya Bhanwapur Primary Room 2', locationName: 'Bhanwapur Southern Green Belt', community: 'SC (Pasi / Jatav)', winnerBias: 1.15, baseTurnout: 48.9 },
      { name: 'Block Development Office Campus Bhanwapur', locationName: 'Bhanwapur Southern Green Belt', community: 'General & Service Composite', winnerBias: 0.95, baseTurnout: 50.2 },
      { name: 'Purva Madhyamik Vidyalaya Sikri Farmlands', locationName: 'Bhanwapur Southern Green Belt', community: 'OBC (Kurmi / Maurya)', winnerBias: 0.96, baseTurnout: 49.4 },
      { name: 'Prathmik Vidyalaya Pipra Kalan South', locationName: 'Bhanwapur Southern Green Belt', community: 'Brahmin (Pandey / Shukla)', winnerBias: 0.74, baseTurnout: 52.8 },
      { name: 'Gram Panchayat Bhawan Ramwapur Dakshin', locationName: 'Bhanwapur Southern Green Belt', community: 'Muslim & OBC Composite', winnerBias: 1.30, baseTurnout: 53.0 },

      // Trilokpur Northern Ridge (North-East)
      { name: 'Prathmik Vidyalaya Trilokpur (North-East)', locationName: 'Trilokpur Northern Ridge', community: 'Upper Castes (Brahmin / Rajput)', winnerBias: 0.70, baseTurnout: 51.5 },
      { name: 'Purva Madhyamik Vidyalaya Gokulpur Khas', locationName: 'Trilokpur Northern Ridge', community: 'OBC (Kurmi / Patel)', winnerBias: 0.92, baseTurnout: 48.7 },
      { name: 'Thana Trilokpur Gate Parisar', locationName: 'Trilokpur Northern Ridge', community: 'General Staff', winnerBias: 0.75, baseTurnout: 50.0 },
      { name: 'Prathmik Vidyalaya Khokhraj North', locationName: 'Trilokpur Northern Ridge', community: 'SC (Jatav / Chamar)', winnerBias: 1.10, baseTurnout: 47.8 },
      { name: 'Gram Panchayat Bhawan Jogia Road Junction', locationName: 'Trilokpur Northern Ridge', community: 'OBC (Maurya / Kushwaha)', winnerBias: 0.88, baseTurnout: 49.2 },

      // Eastern Khuniyaon Border (East)
      { name: 'Prathmik Vidyalaya Khuniyaon Marg East', locationName: 'Eastern Khuniyaon Border', community: 'OBC (Kurmi / Yadav)', winnerBias: 1.14, baseTurnout: 50.6 },
      { name: 'Purva Madhyamik Vidyalaya Parsa Belwa', locationName: 'Eastern Khuniyaon Border', community: 'Muslim & OBC Composite', winnerBias: 1.28, baseTurnout: 54.0 },
      { name: 'Prathmik Vidyalaya Dharauli Purab', locationName: 'Eastern Khuniyaon Border', community: 'SC (Pasi / Dhobi)', winnerBias: 1.08, baseTurnout: 48.0 },
      { name: 'Gram Panchayat Bhawan Pachmohini', locationName: 'Eastern Khuniyaon Border', community: 'Brahmin & OBC Mix', winnerBias: 0.82, baseTurnout: 51.2 }
    ]
  },

  // AC 306: Domariyaganj
  306: {
    acNumber: 306,
    acName: 'Domariyaganj',
    winnerCand: 'Saiyada Khatoon',
    winnerParty: 'SP',
    runnerCand: 'Raghvendra Pratap Singh',
    runnerParty: 'NDA_BJP',
    thirdCand: 'Ashok Kumar Tewari',
    thirdParty: 'BSP',
    fourthCand: 'Kanti Pandey',
    fourthParty: 'INDIA_INC',
    overallWinShare: 41.19,
    overallRunShare: 40.82,
    boothTemplates: [
      // Domariyaganj Municipal Rapti Hub (Central)
      { name: 'Nagar Panchayat Bhawan Domariyaganj Ward 1', locationName: 'Domariyaganj Municipal Rapti Hub', community: 'Muslim Minority & Traders', winnerBias: 1.48, baseTurnout: 58.4 },
      { name: 'Purva Madhyamik Vidyalaya Domariyaganj Rapti Bridge', locationName: 'Domariyaganj Municipal Rapti Hub', community: 'Upper Castes (Thakur / Rajput)', winnerBias: 0.68, baseTurnout: 55.2 },
      { name: 'Prathmik Vidyalaya Domariyaganj Tahsil Road', locationName: 'Domariyaganj Municipal Rapti Hub', community: 'Lawyers & Service Class', winnerBias: 0.95, baseTurnout: 51.0 },
      { name: 'Nagar Panchayat Domariyaganj Ward 3 (Gandhi Nagar)', locationName: 'Domariyaganj Municipal Rapti Hub', community: 'Traders (Bania / Gupta)', winnerBias: 0.72, baseTurnout: 53.6 },
      { name: 'Community Hospital Road Primary School Domariyaganj', locationName: 'Domariyaganj Municipal Rapti Hub', community: 'Mixed Urban Composite', winnerBias: 1.05, baseTurnout: 50.8 },
      { name: 'Thana Domariyaganj Police Colony', locationName: 'Domariyaganj Municipal Rapti Hub', community: 'Security Staff & General', winnerBias: 0.70, baseTurnout: 52.0 },
      { name: 'Kanya Purva Madhyamik Vidyalaya Domariyaganj Ward 5', locationName: 'Domariyaganj Municipal Rapti Hub', community: 'Muslim Minority & Artisans', winnerBias: 1.52, baseTurnout: 59.2 },

      // Hallaur Eastern Cultural Belt (East)
      { name: 'Islamia Senior Secondary School Hallaur (East) Room 1', locationName: 'Hallaur Eastern Cultural Belt', community: 'Muslim Minority (Syed / Sheikh / Pathan)', winnerBias: 1.62, baseTurnout: 62.4 },
      { name: 'Islamia Senior Secondary School Hallaur (East) Room 2', locationName: 'Hallaur Eastern Cultural Belt', community: 'Muslim Minority (Ansari / Shafi)', winnerBias: 1.58, baseTurnout: 61.0 },
      { name: 'Prathmik Vidyalaya Hallaur Purva', locationName: 'Hallaur Eastern Cultural Belt', community: 'Muslim & Weaver Artisans', winnerBias: 1.55, baseTurnout: 60.5 },
      { name: 'Nagar Panchayat Hallaur Ward 2 Central', locationName: 'Hallaur Eastern Cultural Belt', community: 'Muslim Minority Cultural Hub', winnerBias: 1.50, baseTurnout: 59.8 },
      { name: 'Purva Madhyamik Vidyalaya Biyara Khas', locationName: 'Hallaur Eastern Cultural Belt', community: 'OBC (Kurmi / Maurya)', winnerBias: 0.92, baseTurnout: 50.2 },
      { name: 'Prathmik Vidyalaya Bayara Bazar', locationName: 'Hallaur Eastern Cultural Belt', community: 'Traders & Bania', winnerBias: 0.76, baseTurnout: 53.0 },
      { name: 'Gram Panchayat Bhawan Bhaisahi East', locationName: 'Hallaur Eastern Cultural Belt', community: 'SC (Jatav / Chamar)', winnerBias: 1.15, baseTurnout: 48.7 },

      // Bharatbhari Historic Lake Sanctuary (South)
      { name: 'Prathmik Vidyalaya Bharatbhari Historic Lake (South)', locationName: 'Bharatbhari Historic Lake Sanctuary', community: 'Upper Castes (Thakur / Rajput)', winnerBias: 0.62, baseTurnout: 54.0 },
      { name: 'Gram Panchayat Bhawan Bharatbhari', locationName: 'Bharatbhari Historic Lake Sanctuary', community: 'Hindu Pilgrimage & Upper Castes', winnerBias: 0.60, baseTurnout: 55.6 },
      { name: 'Purva Madhyamik Vidyalaya Bharatbhari Temple Road', locationName: 'Bharatbhari Historic Lake Sanctuary', community: 'Brahmin & Rajput', winnerBias: 0.64, baseTurnout: 53.2 },
      { name: 'Prathmik Vidyalaya Ahirauli South (Basti Highway)', locationName: 'Bharatbhari Historic Lake Sanctuary', community: 'OBC (Yadav / Ahir)', winnerBias: 1.35, baseTurnout: 52.8 },
      { name: 'Gram Panchayat Bhawan Basti Border Checkpost', locationName: 'Bharatbhari Historic Lake Sanctuary', community: 'General & Highway Transporters', winnerBias: 0.85, baseTurnout: 49.5 },
      { name: 'Kanya Pathshala Bharatbhari Mandir Ward', locationName: 'Bharatbhari Historic Lake Sanctuary', community: 'Upper Castes (Thakur / Bania)', winnerBias: 0.65, baseTurnout: 52.4 },

      // Bhanwapur Northern Agricultural Zone (North)
      { name: 'Prathmik Vidyalaya Semra Bhanwapur Marg (North)', locationName: 'Bhanwapur Northern Agricultural Zone', community: 'OBC (Kurmi / Patel)', winnerBias: 0.94, baseTurnout: 49.2 },
      { name: 'Purva Madhyamik Vidyalaya Bargadwa North', locationName: 'Bhanwapur Northern Agricultural Zone', community: 'SC (Pasi / Jatav)', winnerBias: 1.12, baseTurnout: 47.8 },
      { name: 'Gram Panchayat Bhawan Gaura Khas', locationName: 'Bhanwapur Northern Agricultural Zone', community: 'OBC (Yadav / Maurya)', winnerBias: 1.25, baseTurnout: 51.4 },
      { name: 'Prathmik Vidyalaya Majhariya Farmlands', locationName: 'Bhanwapur Northern Agricultural Zone', community: 'OBC (Nishad / Mallah)', winnerBias: 1.05, baseTurnout: 48.9 },

      // Western Rapti Floodplain (West)
      { name: 'Prathmik Vidyalaya Alinagar Rapti Basin (West)', locationName: 'Western Rapti Floodplain', community: 'Muslim & Farmer Composite', winnerBias: 1.36, baseTurnout: 54.5 },
      { name: 'Purva Madhyamik Vidyalaya Utraula Border Road', locationName: 'Western Rapti Floodplain', community: 'OBC (Yadav / Kurmi)', winnerBias: 1.18, baseTurnout: 51.0 },
      { name: 'Prathmik Vidyalaya Pipra Ramkishun West', locationName: 'Western Rapti Floodplain', community: 'SC (Chamar / Balmiki)', winnerBias: 1.10, baseTurnout: 48.2 },
      { name: 'Gram Panchayat Bhawan Bharthan Basin', locationName: 'Western Rapti Floodplain', community: 'OBC (Nishad / Kevat)', winnerBias: 0.98, baseTurnout: 49.6 }
    ]
  }
};

/**
 * Build rich, geographically positioned Form 20 booth array for Siddharthnagar ACs (302-306)
 */
export function getPreloadedSiddharthnagarBooths(acNumber: number): Booth[] {
  const config = SIDDHARTHNAGAR_ACS_CONFIG[acNumber];
  if (!config) return [];

  const booths: Booth[] = [];

  config.boothTemplates.forEach((template, idx) => {
    const boothNum = idx + 1;
    const boothId = boothNum.toString().padStart(3, '0');

    // Intelligent geographical placement engine
    const geo = inferBoothCoordinatesAndSector(
      template.name,
      template.locationName,
      boothNum,
      acNumber
    );

    // Elector calibration: typical UP assembly booth has ~750 - 1050 voters
    const registeredElectors = Math.round(820 + (Math.sin(boothNum * 1.7) * 90) + (boothNum % 4) * 25);
    const turnoutPct = Number(Math.max(42.0, Math.min(68.5, template.baseTurnout + (Math.cos(boothNum) * 1.8))).toFixed(2));
    const totalVotesPolled = Math.round(registeredElectors * (turnoutPct / 100));

    // Calculate candidate votes based on bias and overall party shares
    const winRatio = Math.max(0.18, Math.min(0.68, (config.overallWinShare / 100) * template.winnerBias));
    const winVotes = Math.round(totalVotesPolled * winRatio);

    // Runner votes: inverse bias to preserve realism
    const runBias = 2.0 - template.winnerBias;
    const runRatio = Math.max(0.15, Math.min(0.62, (config.overallRunShare / 100) * runBias));
    const runVotes = Math.round(totalVotesPolled * runRatio);

    const remainingVotes = Math.max(30, totalVotesPolled - winVotes - runVotes);
    const thirdVotes = Math.round(remainingVotes * 0.72);
    const fourthVotes = Math.max(5, remainingVotes - thirdVotes - Math.round(totalVotesPolled * 0.008));
    const notaVotes = Math.max(4, totalVotesPolled - winVotes - runVotes - thirdVotes - fourthVotes);
    const validVotes = totalVotesPolled - notaVotes;

    // Determine actual booth winner and runner up
    let winningCand = config.winnerCand;
    let winningParty = config.winnerParty;
    let winningVotes = winVotes;
    let runnerCand = config.runnerCand;
    let runnerParty = config.runnerParty;
    let runnerVotes = runVotes;

    if (runVotes > winVotes) {
      winningCand = config.runnerCand;
      winningParty = config.runnerParty;
      winningVotes = runVotes;
      runnerCand = config.winnerCand;
      runnerParty = config.winnerParty;
      runnerVotes = winVotes;
    }

    const margin = winningVotes - runnerVotes;
    const marginPct = Number(((margin / totalVotesPolled) * 100).toFixed(2));

    const candidateVotes: Record<string, number> = {
      [config.winnerCand]: winVotes,
      [config.runnerCand]: runVotes,
      [config.thirdCand]: thirdVotes,
      [config.fourthCand]: fourthVotes
    };

    booths.push({
      id: boothId,
      number: boothNum,
      name: template.name,
      locationName: geo.sectorName,
      wardZone: geo.zoneDirection,
      boothType: geo.boothType,
      registeredElectors,
      totalVotesPolled,
      turnoutPercentage: turnoutPct,
      validVotes,
      rejectedVotes: 0,
      notaVotes,
      candidateVotes,
      winningPartyId: winningParty,
      winningCandidateId: winningCand,
      runnerUpPartyId: runnerParty,
      runnerUpCandidateId: runnerCand,
      winningMargin: margin,
      winningMarginPercentage: marginPct,
      dominantCommunity: template.community,
      spatialX: geo.x,
      spatialY: geo.y,
      sectorId: geo.sectorId,
      sectorName: geo.sectorName,
      historicalResults: {
        2017: {
          year: 2017,
          turnoutPercentage: Number((turnoutPct - 1.4).toFixed(1)),
          winningPartyId: winningParty === 'SP' ? 'NDA_BJP' : winningParty,
          winningCandidateName: winningCand,
          winningMargin: Math.round(margin * 1.08),
          totalVotesPolled: Math.round(totalVotesPolled * 0.94)
        }
      }
    });
  });

  return booths;
}
