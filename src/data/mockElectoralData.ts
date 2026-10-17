import { Party, StateData, Constituency } from '../types/electoral';
import { MAHARASHTRA_STATE_DATA } from './maharashtraStateModule';
import { UTTAR_PRADESH_STATE_DATA } from './uttarPradeshStateModule';
import { MADHYA_PRADESH_STATE_DATA } from './madhyaPradeshStateModule';
import { getStoredBoothsForAC } from './form20Store';

export const DEFAULT_CONSTITUENCY_ID = 'MH_227_KARJAT_JAMKHED';

export const PARTIES: Record<string, Party> = {
  'NDA_BJP': {
    id: 'NDA_BJP',
    name: 'Bharatiya Janata Party',
    shortName: 'BJP',
    color: '#ea580c', // Saffron / Orange
    bgLight: '#fff7ed',
    alliance: 'National Democratic Alliance (NDA)',
    flagSymbol: 'Lotus'
  },
  'INDIA_INC': {
    id: 'INDIA_INC',
    name: 'Indian National Congress',
    shortName: 'INC',
    color: '#0284c7', // Sky / Royal Blue
    bgLight: '#f0f9ff',
    alliance: 'INDIA Alliance / MVA',
    flagSymbol: 'Hand'
  },
  'NCP_SP': {
    id: 'NCP_SP',
    name: 'NCP (Sharadchandra Pawar)',
    shortName: 'NCP-SP',
    color: '#059669', // Emerald Green
    bgLight: '#ecfdf5',
    alliance: 'Maha Vikas Aghadi / INDIA',
    flagSymbol: 'Man Blowing Trumpet (Tutari)'
  },
  'NCP_AP': {
    id: 'NCP_AP',
    name: 'Nationalist Congress Party',
    shortName: 'NCP',
    color: '#16a34a', // Green
    bgLight: '#f0fdf4',
    alliance: 'Mahayuti / NDA',
    flagSymbol: 'Clock'
  },
  'SS_UBT': {
    id: 'SS_UBT',
    name: 'Shiv Sena (Uddhav Balasaheb Thackeray)',
    shortName: 'SS(UBT)',
    color: '#d97706', // Amber / Flame
    bgLight: '#fffbeb',
    alliance: 'Maha Vikas Aghadi / INDIA',
    flagSymbol: 'Flaming Torch (Mashal)'
  },
  'SHS': {
    id: 'SHS',
    name: 'Shiv Sena',
    shortName: 'SHS',
    color: '#b45309', // Dark Saffron
    bgLight: '#fef3c7',
    alliance: 'Mahayuti / NDA',
    flagSymbol: 'Bow & Arrow'
  },
  'SP': {
    id: 'SP',
    name: 'Samajwadi Party',
    shortName: 'SP',
    color: '#dc2626', // Red
    bgLight: '#fef2f2',
    alliance: 'Maha Vikas Aghadi / INDIA',
    flagSymbol: 'Bicycle'
  },
  'CPIM': {
    id: 'CPIM',
    name: 'Communist Party of India (Marxist)',
    shortName: 'CPI(M)',
    color: '#b91c1c',
    bgLight: '#fef2f2',
    alliance: 'Maha Vikas Aghadi / INDIA',
    flagSymbol: 'Hammer, Sickle & Star'
  },
  'AIMIM': {
    id: 'AIMIM',
    name: 'All India Majlis-e-Ittehadul Muslimeen',
    shortName: 'AIMIM',
    color: '#047857',
    bgLight: '#ecfdf5',
    alliance: 'Unaligned / Others',
    flagSymbol: 'Kite'
  },
  'RYSP': {
    id: 'RYSP',
    name: 'Rashtriya Yuva Swabhiman Party',
    shortName: 'RYSP',
    color: '#475569',
    bgLight: '#f8fafc',
    alliance: 'Mahayuti / NDA',
    flagSymbol: 'Helicopter'
  },
  'PWPI': {
    id: 'PWPI',
    name: 'Peasants and Workers Party of India',
    shortName: 'PWPI',
    color: '#be123c',
    bgLight: '#fff1f2',
    alliance: 'Unaligned / Others',
    flagSymbol: 'Eagle'
  },
  'JSS': {
    id: 'JSS',
    name: 'Jan Surajya Shakti',
    shortName: 'JSS',
    color: '#7c3aed',
    bgLight: '#f5f3ff',
    alliance: 'Mahayuti / NDA',
    flagSymbol: 'Cup & Saucer'
  },
  'RSVA': {
    id: 'RSVA',
    name: 'Rashtriya Samajik Vikas Aghadi',
    shortName: 'RSVA',
    color: '#6366f1',
    bgLight: '#eef2ff',
    alliance: 'Mahayuti / NDA',
    flagSymbol: 'Torch'
  },
  'RSPS': {
    id: 'RSPS',
    name: 'Rashtriya Samaj Paksha',
    shortName: 'RSPS',
    color: '#ca8a04',
    bgLight: '#fefce8',
    alliance: 'Mahayuti / NDA',
    flagSymbol: 'Whistle'
  },
  'AAP': {
    id: 'AAP',
    name: 'Aam Aadmi Party',
    shortName: 'AAP',
    color: '#0891b2',
    bgLight: '#ecfeff',
    alliance: 'INDIA Alliance',
    flagSymbol: 'Broom'
  },
  'BSP': {
    id: 'BSP',
    name: 'Bahujan Samaj Party',
    shortName: 'BSP',
    color: '#2563eb', // Royal Blue
    bgLight: '#eff6ff',
    alliance: 'Unaligned / Others',
    flagSymbol: 'Elephant'
  },
  'GGP': {
    id: 'GGP',
    name: 'Gondwana Gantantra Party',
    shortName: 'GGP',
    color: '#15803d', // Green
    bgLight: '#f0fdf4',
    alliance: 'Unaligned / Regional',
    flagSymbol: 'Saw'
  },
  'BHRTADVSIP': {
    id: 'BHRTADVSIP',
    name: 'Bharat Adivasi Party',
    shortName: 'BAP',
    color: '#e11d48', // Rose Red
    bgLight: '#fff1f2',
    alliance: 'Tribal / Regional',
    flagSymbol: 'Hockey & Ball'
  },
  'ASPKR': {
    id: 'ASPKR',
    name: 'Aazad Samaj Party (Kanshi Ram)',
    shortName: 'ASP(KR)',
    color: '#0284c7', // Sky Blue
    bgLight: '#f0f9ff',
    alliance: 'Unaligned',
    flagSymbol: 'Kettle'
  },
  'CPI': {
    id: 'CPI',
    name: 'Communist Party of India',
    shortName: 'CPI',
    color: '#b91c1c',
    bgLight: '#fef2f2',
    alliance: 'Left Front',
    flagSymbol: 'Ears of Corn & Sickle'
  },
  'SDPI': {
    id: 'SDPI',
    name: 'Social Democratic Party of India',
    shortName: 'SDPI',
    color: '#047857',
    bgLight: '#ecfdf5',
    alliance: 'Unaligned',
    flagSymbol: 'Star'
  },
  'JD_S': {
    id: 'JD_S',
    name: 'Janata Dal (Secular)',
    shortName: 'JD(S)',
    color: '#15803d',
    bgLight: '#f0fdf4',
    alliance: 'NDA Alliance',
    flagSymbol: 'Farmer Woman'
  },
  'IND_OTH': {
    id: 'IND_OTH',
    name: 'Independents & Others',
    shortName: 'IND/OTH',
    color: '#64748b', // Slate Gray
    bgLight: '#f8fafc',
    alliance: 'Independent / Others',
    flagSymbol: 'Various Symbols'
  },
  'BJP': {
    id: 'BJP',
    name: 'Bharatiya Janata Party',
    shortName: 'BJP',
    color: '#ea580c',
    bgLight: '#fff7ed',
    alliance: 'National Democratic Alliance (NDA)',
    flagSymbol: 'Lotus'
  },
  'INC': {
    id: 'INC',
    name: 'Indian National Congress',
    shortName: 'INC',
    color: '#0284c7',
    bgLight: '#f0f9ff',
    alliance: 'INDIA Alliance',
    flagSymbol: 'Hand'
  },
  'AAAP': {
    id: 'AAAP',
    name: 'Aam Aadmi Party',
    shortName: 'AAP',
    color: '#0891b2',
    bgLight: '#ecfeff',
    alliance: 'INDIA Alliance',
    flagSymbol: 'Broom'
  },
  'NOTA': {
    id: 'NOTA',
    name: 'None of the Above',
    shortName: 'NOTA',
    color: '#94a3b8',
    bgLight: '#f1f5f9',
    alliance: 'None',
    flagSymbol: 'NOTA'
  },
  'RLD': {
    id: 'RLD',
    name: 'Rashtriya Lok Dal',
    shortName: 'RLD',
    color: '#15803d',
    bgLight: '#f0fdf4',
    alliance: 'National Democratic Alliance (NDA)',
    flagSymbol: 'Handpump'
  },
  'AD_S': {
    id: 'AD_S',
    name: 'Apna Dal (Sonelal)',
    shortName: 'AD(S)',
    color: '#7c3aed',
    bgLight: '#f5f3ff',
    alliance: 'National Democratic Alliance (NDA)',
    flagSymbol: 'Cup & Saucer'
  },
  'NISHAD': {
    id: 'NISHAD',
    name: 'Nirbal Indian Shoshit Hamara Aam Dal',
    shortName: 'NISHAD',
    color: '#0284c7',
    bgLight: '#f0f9ff',
    alliance: 'National Democratic Alliance (NDA)',
    flagSymbol: 'Boat with Oars'
  },
  'SBSP': {
    id: 'SBSP',
    name: 'Suheldev Bharatiya Samaj Party',
    shortName: 'SBSP',
    color: '#ca8a04',
    bgLight: '#fefce8',
    alliance: 'National Democratic Alliance (NDA)',
    flagSymbol: 'Walking Stick'
  },
  'JDL': {
    id: 'JDL',
    name: 'Jansatta Dal (Loktantrik)',
    shortName: 'JDL',
    color: '#d97706',
    bgLight: '#fffbeb',
    alliance: 'Regional Independent',
    flagSymbol: 'Saw'
  },
  'AD_K': {
    id: 'AD_K',
    name: 'Apna Dal (Kamerawadi)',
    shortName: 'AD(K)',
    color: '#059669',
    bgLight: '#ecfdf5',
    alliance: 'INDIA Alliance / SP+',
    flagSymbol: 'Cup & Saucer'
  },
  'JD_U': {
    id: 'JD_U',
    name: 'Janata Dal (United)',
    shortName: 'JD(U)',
    color: '#16a34a',
    bgLight: '#f0fdf4',
    alliance: 'National Democratic Alliance (NDA)',
    flagSymbol: 'Arrow'
  }
};

export const STATES_DATA: StateData[] = [
  UTTAR_PRADESH_STATE_DATA,
  MAHARASHTRA_STATE_DATA,
  MADHYA_PRADESH_STATE_DATA,
  {
    id: 'KA',
    name: 'Karnataka',
    code: 'KA',
    districts: [
      {
        id: 'KA_MYSURU',
        name: 'Mysuru',
        constituencies: [
          {
            id: 'KA_221_VARUNA',
            number: 221,
            name: 'Varuna',
            stateId: 'KA',
            stateName: 'Karnataka',
            districtId: 'KA_MYSURU',
            districtName: 'Mysuru',
            reservationCategory: 'GEN',
            totalBooths: 284,
            currentYear: 2023,
            demographicSources: [
              {
                id: 'chanakya_ka_2023',
                name: 'Chanakya Political Research (Karnataka Cell)',
                type: 'STATE_SURVEY',
                year: 2023,
                sampleSize: '12,000 respondents in Varuna AC',
                reliabilityScore: '94.2%',
                description: 'Pre-poll booth-level caste balance mapping.'
              }
            ],
            activeDemographicSourceId: 'chanakya_ka_2023',
            demographics: [
              {
                communityName: 'Lingayat',
                category: 'GENERAL',
                percentage: 31.5,
                populationEstimate: 81900,
                sourceTag: 'Chanakya Political Research (2023)',
                confidence: 'HIGH',
                trendNote: 'Split between Somanna (BJP) and Siddaramaiah local goodwill.'
              },
              {
                communityName: 'Kuruba (AHINDA Core)',
                category: 'OBC',
                percentage: 26.8,
                populationEstimate: 69680,
                sourceTag: 'Chanakya Political Research (2023)',
                confidence: 'HIGH',
                trendNote: 'Massive consolidation behind Siddaramaiah.'
              },
              {
                communityName: 'SC (Left & Right)',
                category: 'SC',
                percentage: 19.2,
                populationEstimate: 49920,
                sourceTag: 'Chanakya Political Research (2023)',
                confidence: 'HIGH',
                trendNote: 'Crucial support for Congress AHINDA consolidation.'
              },
              {
                communityName: 'Vokkaliga',
                category: 'GENERAL',
                percentage: 12.0,
                populationEstimate: 31200,
                sourceTag: 'Chanakya Political Research (2023)',
                confidence: 'MEDIUM',
                trendNote: 'Divided between JD(S) and BJP.'
              },
              {
                communityName: 'ST (Nayaka)',
                category: 'ST',
                percentage: 6.5,
                populationEstimate: 16900,
                sourceTag: 'Chanakya Political Research (2023)',
                confidence: 'HIGH',
                trendNote: 'Traditional Congress leaning.'
              },
              {
                communityName: 'Muslim & Others',
                category: 'MINORITY',
                percentage: 4.0,
                populationEstimate: 10400,
                sourceTag: 'Chanakya Political Research (2023)',
                confidence: 'HIGH',
                trendNote: 'High turnout for Congress.'
              }
            ],
            elections: {
              2023: {
                year: 2023,
                electionType: 'Assembly (Vidhan Sabha)',
                totalElectors: 260000,
                totalPolled: 218400,
                turnoutPercentage: 84.0,
                winningPartyId: 'INDIA_INC',
                winningCandidateId: 'cand_siddaramaiah',
                winningMargin: 46163,
                winningMarginPercentage: 21.1,
                candidates: [
                  {
                    id: 'cand_siddaramaiah',
                    name: 'Siddaramaiah',
                    partyId: 'INDIA_INC',
                    votes: 119816,
                    voteSharePercentage: 54.8,
                    status: 'WON',
                    photoUrl: 'https://ui-avatars.com/api/?name=SA&background=0284c7&color=FFFFFF&bold=true&size=128&format=svg'
                  },
                  {
                    id: 'cand_v_somanna',
                    name: 'V. Somanna',
                    partyId: 'NDA_BJP',
                    votes: 73653,
                    voteSharePercentage: 33.7,
                    status: 'RUNNER_UP',
                    photoUrl: 'https://ui-avatars.com/api/?name=VS&background=ea580c&color=FFFFFF&bold=true&size=128&format=svg'
                  },
                  {
                    id: 'cand_bharati_shankar',
                    name: 'Dr. Bharati Shankar',
                    partyId: 'JD_S',
                    votes: 10220,
                    voteSharePercentage: 4.7,
                    status: 'LOST',
                    photoUrl: 'https://ui-avatars.com/api/?name=BS&background=15803d&color=FFFFFF&bold=true&size=128&format=svg'
                  }
                ],
                partyBreakdown: [
                  { partyId: 'INDIA_INC', votes: 119816, voteSharePercentage: 54.8, boothsLedCount: 198 },
                  { partyId: 'NDA_BJP', votes: 73653, voteSharePercentage: 33.7, boothsLedCount: 82 },
                  { partyId: 'JD_S', votes: 10220, voteSharePercentage: 4.7, boothsLedCount: 4 }
                ]
              }
            },
            booths: []
          }
        ]
      }
    ]
  }
];

export function getConstituencyById(constituencyId: string): Constituency {
  let matched: Constituency | undefined;

  for (const state of STATES_DATA) {
    for (const district of state.districts) {
      const found = district.constituencies.find(c => c.id === constituencyId);
      if (found) {
        matched = found;
        break;
      }
    }
    if (matched) break;
  }

  // Fallback to default if not found
  if (!matched) {
    const defaultState = STATES_DATA[0];
    const ahilyanagarDist = defaultState.districts.find(d => d.name === 'Ahilyanagar') || defaultState.districts[0];
    matched = ahilyanagarDist.constituencies.find(c => c.number === 227) || ahilyanagarDist.constituencies[0];
  }

  // Check if custom imported Form 20 booths exist in store (e.g. for AC 302-306)
  const customBooths = getStoredBoothsForAC(matched.number);
  if (customBooths && customBooths.length > 0) {
    return {
      ...matched,
      booths: customBooths,
      totalBooths: customBooths.length
    };
  }

  return matched;
}
