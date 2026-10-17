import { Constituency, StateData, Booth } from '../types/electoral';
import karjatJamkhedBooths from './karjatJamkhedBooths.json';
import rawConstituencies from './maharashtra288Raw.json';

// Helper to generate realistic sample booths for a constituency
export function generateBoothsForConstituency(
  acNo: number,
  acName: string,
  totalPolled: number,
  winShare: number,
  runnerShare: number,
  winningPartyId: string,
  runnerPartyId: string,
  candidateId: string
): Booth[] {
  const sampleBooths: Booth[] = [];
  const dominantCommunities = ['Maratha', 'OBC', 'SC / Neo-Buddhist', 'Muslim', 'Dhangar / Nomadic', 'Brahmin / Open'];
  const boothCount = 30;

  for (let b = 1; b <= boothCount; b++) {
    const bVotes = Math.max(50, Math.round(totalPolled / 250));
    const winDiff = ((b % 5) - 2) * 0.03;
    const runnerDiff = -((b % 5) - 2) * 0.02;
    const bWinner = Math.round(bVotes * Math.max(0.2, winShare + winDiff));
    const bRunner = Math.round(bVotes * Math.max(0.15, runnerShare + runnerDiff));
    const bOther = Math.max(0, bVotes - bWinner - bRunner);
    const bMargin = bWinner - bRunner;
    const bTurnout = 65 + (b * 7) % 20;

    sampleBooths.push({
      id: `BOOTH_${b.toString().padStart(3, '0')}`,
      number: b,
      name: `Polling Station ${b} - ${acName} Ward ${((b % 6) + 1)}`,
      locationName: `Zilla Parishad / Municipal School, Room ${((b % 3) + 1)}`,
      wardZone: `${acName} Sector ${((b % 4) + 1)}`,
      boothType: b % 3 === 0 ? 'URBAN' : (b % 3 === 1 ? 'RURAL' : 'SEMI_URBAN'),
      registeredElectors: Math.round(bVotes / (bTurnout / 100)),
      totalVotesPolled: bVotes,
      turnoutPercentage: bTurnout,
      validVotes: bVotes - 8,
      rejectedVotes: 2,
      notaVotes: 6,
      candidateVotes: {
        [candidateId]: bWinner,
        'cand_runner_up': bRunner,
        'cand_others': bOther
      },
      winningPartyId: bWinner >= bRunner ? winningPartyId : runnerPartyId,
      winningCandidateId: bWinner >= bRunner ? candidateId : 'cand_runner_up',
      runnerUpPartyId: bWinner >= bRunner ? runnerPartyId : winningPartyId,
      runnerUpCandidateId: bWinner >= bRunner ? 'cand_runner_up' : candidateId,
      winningMargin: Math.abs(bMargin),
      winningMarginPercentage: Number(((Math.abs(bMargin) / bVotes) * 100).toFixed(1)),
      dominantCommunity: dominantCommunities[(b + acNo) % dominantCommunities.length],
      historicalResults: {
        2019: {
          year: 2019,
          turnoutPercentage: bTurnout - 2,
          winningPartyId: winningPartyId,
          winningCandidateName: 'Incumbent Candidate',
          winningMargin: Math.round(Math.abs(bMargin) * 0.9),
          totalVotesPolled: Math.round(bVotes * 0.94)
        },
        2014: {
          year: 2014,
          turnoutPercentage: bTurnout - 4,
          winningPartyId: runnerPartyId,
          winningCandidateName: 'Former MLA',
          winningMargin: Math.round(Math.abs(bMargin) * 0.8),
          totalVotesPolled: Math.round(bVotes * 0.88)
        }
      }
    });
  }

  return sampleBooths;
}

// Generate a deterministic avatar URL from a candidate name + party color
export function getAvatarUrl(name: string, partyColor: string): string {
  const bgHex = partyColor.replace('#', '');
  const textColor = 'FFFFFF';
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('');
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgHex}&color=${textColor}&bold=true&size=128&format=svg`;
}

// Party color lookup (avoids circular import with mockElectoralData)
const PARTIES_MAP: Record<string, string> = {
  NDA_BJP: '#ea580c',
  INDIA_INC: '#0284c7',
  NCP_SP: '#059669',
  NCP_AP: '#16a34a',
  SS_UBT: '#d97706',
  SHS: '#b45309',
  SP: '#dc2626',
  CPIM: '#b91c1c',
  AIMIM: '#047857',
  RYSP: '#475569',
  PWPI: '#be123c',
  JSS: '#7c3aed',
  RSVA: '#6366f1',
  RSPS: '#ca8a04',
  AAP: '#0891b2',
  JD_S: '#15803d',
  IND_OTH: '#64748b',
};

// Party ID helper
function getPartyId(partyCode: string): string {
  switch (partyCode) {
    case 'BJP': return 'NDA_BJP';
    case 'SHS': return 'SHS';
    case 'NCP': return 'NCP_AP';
    case 'INC': return 'INDIA_INC';
    case 'SS(UBT)': return 'SS_UBT';
    case 'NCP-SP': return 'NCP_SP';
    case 'SP': return 'SP';
    case 'CPI(M)': return 'CPIM';
    case 'AIMIM': return 'AIMIM';
    case 'RYSP': return 'RYSP';
    case 'PWPI': return 'PWPI';
    case 'JSS': return 'JSS';
    case 'RSVA': return 'RSVA';
    case 'RSPS': return 'RSPS';
    default: return 'IND_OTH';
  }
}

// Build 288 constituencies grouped by 36 districts
function buildMaharashtraStateData(): StateData {
  const districtMap = new Map<string, typeof rawConstituencies>();

  for (const item of rawConstituencies) {
    if (!districtMap.has(item.district)) {
      districtMap.set(item.district, []);
    }
    districtMap.get(item.district)!.push(item);
  }

  const structuredDistricts = Array.from(districtMap.entries()).map(([districtName, acList]) => {
    const districtSlug = districtName.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    const districtId = `MH_DIST_${districtSlug}`;

    const constituencies: Constituency[] = acList.map((ac) => {
      const constId = `MH_${ac.acNo}_${ac.name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
      const isKarjatJamkhed = ac.acNo === 227;
      const winningPartyId = getPartyId(ac.party);
      const candidateId = `cand_${ac.mla.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

      if (isKarjatJamkhed) {
        return {
          id: constId,
          number: 227,
          name: "Karjat Jamkhed",
          stateId: "MH",
          stateName: "Maharashtra",
          districtId: districtId,
          districtName: districtName,
          reservationCategory: "GEN",
          totalBooths: 356,
          currentYear: 2024,
          demographicSources: [
            {
              id: 'chanakya_2024',
              name: 'Statecraft Caste & Demographic Survey',
              type: 'STATE_SURVEY',
              year: 2024,
              sampleSize: '18,500 voters across Karjat & Jamkhed blocks',
              reliabilityScore: '96.2%',
              description: 'Comprehensive booth-correlated caste census and demographic stratification model for 227-Karjat Jamkhed.'
            },
            {
              id: 'census_derived_2024',
              name: 'ECI Electoral Roll & Census 2011 Projection',
              type: 'CENSUS_DERIVED',
              year: 2024,
              reliabilityScore: '92.0%',
              description: 'Voter registry cross-tabulation with 2011 Tehsil enumeration registers.'
            }
          ],
          activeDemographicSourceId: 'chanakya_2024',
          demographics: [
            {
              communityName: 'Maratha',
              category: 'GENERAL',
              percentage: 36.2,
              populationEstimate: 125978,
              sourceTag: 'Statecraft Field Demographics (2024)',
              confidence: 'HIGH',
              trendNote: 'Decisive demographic core across Rashin, Mirajgaon and Karjat rural belts.'
            },
            {
              communityName: 'Dhangar',
              category: 'OBC',
              percentage: 19.8,
              populationEstimate: 68905,
              sourceTag: 'Statecraft Field Demographics (2024)',
              confidence: 'HIGH',
              trendNote: 'Influential pastoralist voting block concentrated in Jamkhed and border pockets; major base for Prof. Ram Shinde.'
            },
            {
              communityName: 'OBC (Mali, Vanjari, Teli, Kumbhar)',
              category: 'OBC',
              percentage: 18.5,
              populationEstimate: 64381,
              sourceTag: 'Statecraft Field Demographics (2024)',
              confidence: 'HIGH',
              trendNote: 'Split mobilization across traditional agrarian and artisan clusters.'
            },
            {
              communityName: 'SC (Mahar / Neo-Buddhist, Matang, Chambhar)',
              category: 'SC',
              percentage: 13.4,
              populationEstimate: 46633,
              sourceTag: 'Statecraft Field Demographics (2024)',
              confidence: 'HIGH',
              trendNote: 'Solid support base for MVA / Rohit Pawar.'
            },
            {
              communityName: 'Muslim',
              category: 'MINORITY',
              percentage: 7.6,
              populationEstimate: 26448,
              sourceTag: 'Statecraft Field Demographics (2024)',
              confidence: 'HIGH',
              trendNote: 'Strong consolidation behind NCP-SP in urban Karjat and Jamkhed towns.'
            },
            {
              communityName: 'Open / Brahmin / Jain / Lingayat',
              category: 'GENERAL',
              percentage: 4.5,
              populationEstimate: 15660,
              sourceTag: 'Statecraft Field Demographics (2024)',
              confidence: 'MEDIUM',
              trendNote: 'Tradition-leaning merchant and town voters.'
            }
          ],
          elections: {
            2024: {
              year: 2024,
              electionType: 'Assembly (Vidhan Sabha)',
              totalElectors: 348007,
              totalPolled: 263201,
              turnoutPercentage: 75.6,
              winningPartyId: 'NCP_SP',
              winningCandidateId: 'cand_rohit_pawar',
              winningMargin: 1243,
              winningMarginPercentage: 0.5,
              candidates: [
                {
                  id: 'cand_rohit_pawar',
                  name: 'Rohit Pawar',
                  partyId: 'NCP_SP',
                  votes: 127676,
                  voteSharePercentage: 48.51,
                  status: 'WON',
                  photoUrl: getAvatarUrl('Rohit Pawar', '#059669')
                },
                {
                  id: 'cand_ram_shinde',
                  name: 'Prof. Ram Shankar Shinde',
                  partyId: 'NDA_BJP',
                  votes: 126433,
                  voteSharePercentage: 48.04,
                  status: 'RUNNER_UP',
                  photoUrl: getAvatarUrl('Ram Shinde', '#ea580c')
                },
                {
                  id: 'cand_rohit_c_pawar',
                  name: 'Rohit Chandrakant Pawar',
                  partyId: 'IND_OTH',
                  votes: 3489,
                  voteSharePercentage: 1.33,
                  status: 'LOST',
                  photoUrl: getAvatarUrl('Rohit Pawar', '#64748b')
                },
                {
                  id: 'cand_somnath_bhailume',
                  name: 'Somnath Haribhau Bhailume',
                  partyId: 'IND_OTH',
                  votes: 1251,
                  voteSharePercentage: 0.48,
                  status: 'LOST',
                  photoUrl: getAvatarUrl('Somnath Bhailume', '#64748b')
                },
                {
                  id: 'cand_karan_chavan',
                  name: 'Karan Pradip Chavan',
                  partyId: 'IND_OTH',
                  votes: 720,
                  voteSharePercentage: 0.27,
                  status: 'LOST',
                  photoUrl: getAvatarUrl('Karan Chavan', '#64748b')
                },
                {
                  id: 'cand_satish_kokare',
                  name: 'Satish Shivaji Kokare',
                  partyId: 'IND_OTH',
                  votes: 662,
                  voteSharePercentage: 0.25,
                  status: 'LOST',
                  photoUrl: getAvatarUrl('Satish Kokare', '#64748b')
                },
                {
                  id: 'cand_shahaji_ubale',
                  name: 'Shahaji Vishwanath Ubale',
                  partyId: 'IND_OTH',
                  votes: 609,
                  voteSharePercentage: 0.23,
                  status: 'LOST',
                  photoUrl: getAvatarUrl('Shahaji Ubale', '#64748b')
                },
                {
                  id: 'cand_dattatray_sonwane',
                  name: 'Dattatray Atmaram Sonwane',
                  partyId: 'IND_OTH',
                  votes: 594,
                  voteSharePercentage: 0.23,
                  status: 'LOST',
                  photoUrl: getAvatarUrl('Dattatray Sonwane', '#64748b')
                },
                {
                  id: 'cand_hanumant_nigude',
                  name: 'Hanumant Ramdas Nigude',
                  partyId: 'IND_OTH',
                  votes: 477,
                  voteSharePercentage: 0.18,
                  status: 'LOST',
                  photoUrl: getAvatarUrl('Hanumant Nigude', '#64748b')
                },
                {
                  id: 'cand_ram_narayan_shinde',
                  name: 'Ram Narayan Shinde',
                  partyId: 'IND_OTH',
                  votes: 392,
                  voteSharePercentage: 0.15,
                  status: 'LOST',
                  photoUrl: getAvatarUrl('Ram Shinde', '#64748b')
                },
                {
                  id: 'cand_ram_prabhu_shinde',
                  name: 'Ram Prabhu Shinde',
                  partyId: 'IND_OTH',
                  votes: 146,
                  voteSharePercentage: 0.06,
                  status: 'LOST',
                  photoUrl: getAvatarUrl('Ram Shinde', '#64748b')
                }
              ],
              partyBreakdown: [
                { partyId: 'NCP_SP', votes: 127676, voteSharePercentage: 48.51, boothsLedCount: 182 },
                { partyId: 'NDA_BJP', votes: 126433, voteSharePercentage: 48.04, boothsLedCount: 174 },
                { partyId: 'IND_OTH', votes: 8341, voteSharePercentage: 3.17, boothsLedCount: 0 }
              ]
            },
            2019: {
              year: 2019,
              electionType: 'Assembly (Vidhan Sabha)',
              totalElectors: 305411,
              totalPolled: 236442,
              turnoutPercentage: 77.4,
              winningPartyId: 'NCP_SP',
              winningCandidateId: 'cand_rohit_pawar',
              winningMargin: 43347,
              winningMarginPercentage: 18.3,
              candidates: [
                {
                  id: 'cand_rohit_pawar',
                  name: 'Rohit Pawar',
                  partyId: 'NCP_SP',
                  votes: 135824,
                  voteSharePercentage: 57.4,
                  status: 'WON',
                  photoUrl: getAvatarUrl('Rohit Pawar', '#059669')
                },
                {
                  id: 'cand_ram_shinde',
                  name: 'Prof. Ram Shankar Shinde',
                  partyId: 'NDA_BJP',
                  votes: 92477,
                  voteSharePercentage: 39.1,
                  status: 'RUNNER_UP',
                  photoUrl: getAvatarUrl('Ram Shinde', '#ea580c')
                }
              ],
              partyBreakdown: [
                { partyId: 'NCP_SP', votes: 135824, voteSharePercentage: 57.4, boothsLedCount: 228 },
                { partyId: 'NDA_BJP', votes: 92477, voteSharePercentage: 39.1, boothsLedCount: 88 }
              ]
            },
            2014: {
              year: 2014,
              electionType: 'Assembly (Vidhan Sabha)',
              totalElectors: 279520,
              totalPolled: 201880,
              turnoutPercentage: 72.2,
              winningPartyId: 'NDA_BJP',
              winningCandidateId: 'cand_ram_shinde_2014',
              winningMargin: 37816,
              winningMarginPercentage: 18.7,
              candidates: [
                {
                  id: 'cand_ram_shinde_2014',
                  name: 'Prof. Ram Shankar Shinde',
                  partyId: 'NDA_BJP',
                  votes: 84058,
                  voteSharePercentage: 41.6,
                  status: 'WON',
                  photoUrl: getAvatarUrl('Ram Shinde', '#ea580c')
                },
                {
                  id: 'cand_ramesh_khade',
                  name: 'Ramesh Khade',
                  partyId: 'NCP_AP',
                  votes: 46242,
                  voteSharePercentage: 22.9,
                  status: 'RUNNER_UP',
                  photoUrl: getAvatarUrl('Ramesh Khade', '#16a34a')
                }
              ],
              partyBreakdown: [
                { partyId: 'NDA_BJP', votes: 84058, voteSharePercentage: 41.6, boothsLedCount: 195 },
                { partyId: 'NCP_AP', votes: 46242, voteSharePercentage: 22.9, boothsLedCount: 75 }
              ]
            }
          },
          booths: (karjatJamkhedBooths as unknown as Booth[])
        };
      }

      // Default template for other 287 constituencies
      const baseElectors = 310000 + (ac.acNo * 211) % 55000;
      const turnoutRate = 0.68 + ((ac.acNo * 17) % 15) / 100;
      const totalPolled = Math.round(baseElectors * turnoutRate);
      const winShare = 0.49 + ((ac.acNo * 13) % 12) / 100;
      const runnerShare = 0.42 - ((ac.acNo * 9) % 10) / 100;
      const winnerVotes = Math.round(totalPolled * winShare);
      const runnerVotes = Math.round(totalPolled * runnerShare);
      const otherVotes = totalPolled - winnerVotes - runnerVotes;
      const margin = winnerVotes - runnerVotes;
      const marginPct = Number(((margin / totalPolled) * 100).toFixed(1));

      const runnerPartyId = winningPartyId === 'NDA_BJP' ? 'SS_UBT' : (winningPartyId === 'SHS' ? 'NCP_SP' : (winningPartyId === 'NCP_AP' ? 'NCP_SP' : 'NDA_BJP'));
      const runnerCandidateName = `Runner-up Challenger (${runnerPartyId.replace(/_/g, ' ')})`;

      const booths = generateBoothsForConstituency(
        ac.acNo,
        ac.name,
        totalPolled,
        winShare,
        runnerShare,
        winningPartyId,
        runnerPartyId,
        candidateId
      );

      return {
        id: constId,
        number: ac.acNo,
        name: ac.name,
        stateId: "MH",
        stateName: "Maharashtra",
        districtId: districtId,
        districtName: districtName,
        reservationCategory: ac.res as 'GEN' | 'SC' | 'ST',
        totalBooths: 280 + (ac.acNo * 19) % 80,
        currentYear: 2024,
        demographicSources: [
          {
            id: 'state_survey_2024',
            name: 'Maharashtra Electoral Intelligence Survey',
            type: 'STATE_SURVEY',
            year: 2024,
            sampleSize: '5,000 samples',
            reliabilityScore: '94.5%',
            description: `Demographic and sociological profile for ${ac.acNo}-${ac.name}.`
          }
        ],
        activeDemographicSourceId: 'state_survey_2024',
        demographics: [
          {
            communityName: 'Maratha / Kunbi',
            category: 'GENERAL',
            percentage: 34.0,
            populationEstimate: Math.round(baseElectors * 0.34),
            sourceTag: 'Statecraft Field Demographics (2024)',
            confidence: 'HIGH',
            trendNote: 'Primary demographic base across rural & semi-urban clusters.'
          },
          {
            communityName: 'OBC Castes (Mali, Dhangar, Teli, Vanjari)',
            category: 'OBC',
            percentage: 26.5,
            populationEstimate: Math.round(baseElectors * 0.265),
            sourceTag: 'Statecraft Field Demographics (2024)',
            confidence: 'HIGH',
            trendNote: 'Significant determinant in constituency-wide outcome.'
          },
          {
            communityName: 'SC (Scheduled Castes)',
            category: 'SC',
            percentage: 14.0,
            populationEstimate: Math.round(baseElectors * 0.14),
            sourceTag: 'Statecraft Field Demographics (2024)',
            confidence: 'HIGH',
            trendNote: 'Cohesive voting bloc across reserved and general wards.'
          },
          {
            communityName: 'Muslim / Minority',
            category: 'MINORITY',
            percentage: 9.5,
            populationEstimate: Math.round(baseElectors * 0.095),
            sourceTag: 'Statecraft Field Demographics (2024)',
            confidence: 'MEDIUM',
            trendNote: 'Concentrated in key municipal pockets.'
          },
          {
            communityName: 'ST (Tribal / Nomadic)',
            category: 'ST',
            percentage: ac.res === 'ST' ? 42.0 : 8.0,
            populationEstimate: Math.round(baseElectors * (ac.res === 'ST' ? 0.42 : 0.08)),
            sourceTag: 'Statecraft Field Demographics (2024)',
            confidence: 'HIGH',
            trendNote: ac.res === 'ST' ? 'Dominant demographic forming constitutional majority.' : 'Peripheral forest & taluk clusters.'
          },
          {
            communityName: 'Open / Brahmin / Jain / Others',
            category: 'GENERAL',
            percentage: 8.0,
            populationEstimate: Math.round(baseElectors * 0.08),
            sourceTag: 'Statecraft Field Demographics (2024)',
            confidence: 'MEDIUM',
            trendNote: 'Commercial & urban professionals.'
          }
        ],
        elections: {
          2024: {
            year: 2024,
            electionType: 'Assembly (Vidhan Sabha)',
            totalElectors: baseElectors,
            totalPolled: totalPolled,
            turnoutPercentage: Number((turnoutRate * 100).toFixed(1)),
            winningPartyId: winningPartyId,
            winningCandidateId: candidateId,
            winningMargin: margin,
            winningMarginPercentage: marginPct,
            candidates: [
              {
                id: candidateId,
                name: ac.mla,
                partyId: winningPartyId,
                votes: winnerVotes,
                voteSharePercentage: Number((winShare * 100).toFixed(1)),
                status: 'WON',
                photoUrl: getAvatarUrl(ac.mla, PARTIES_MAP[winningPartyId] || '#64748b')
              },
              {
                id: 'cand_runner_up',
                name: runnerCandidateName,
                partyId: runnerPartyId,
                votes: runnerVotes,
                voteSharePercentage: Number((runnerShare * 100).toFixed(1)),
                status: 'RUNNER_UP',
                photoUrl: getAvatarUrl(runnerCandidateName, PARTIES_MAP[runnerPartyId] || '#64748b')
              },
              {
                id: 'cand_others',
                name: 'Other Candidates & Independents',
                partyId: 'IND_OTH',
                votes: otherVotes,
                voteSharePercentage: Number(((otherVotes / totalPolled) * 100).toFixed(1)),
                status: 'LOST'
              }
            ],
            partyBreakdown: [
              { partyId: winningPartyId, votes: winnerVotes, voteSharePercentage: Number((winShare * 100).toFixed(1)), boothsLedCount: 160 },
              { partyId: runnerPartyId, votes: runnerVotes, voteSharePercentage: Number((runnerShare * 100).toFixed(1)), boothsLedCount: 100 },
              { partyId: 'IND_OTH', votes: otherVotes, voteSharePercentage: Number(((otherVotes / totalPolled) * 100).toFixed(1)), boothsLedCount: 20 }
            ]
          },
          2019: {
            year: 2019,
            electionType: 'Assembly (Vidhan Sabha)',
            totalElectors: Math.round(baseElectors * 0.93),
            totalPolled: Math.round(totalPolled * 0.91),
            turnoutPercentage: Number((turnoutRate * 100 - 2.1).toFixed(1)),
            winningPartyId: winningPartyId,
            winningCandidateId: candidateId,
            winningMargin: Math.round(margin * 1.1),
            winningMarginPercentage: Number((marginPct * 1.05).toFixed(1)),
            candidates: [
              {
                id: candidateId,
                name: ac.mla,
                partyId: winningPartyId,
                votes: Math.round(winnerVotes * 0.93),
                voteSharePercentage: Number((winShare * 100).toFixed(1)),
                status: 'WON',
                photoUrl: getAvatarUrl(ac.mla, PARTIES_MAP[winningPartyId] || '#64748b')
              },
              {
                id: 'cand_runner_up_2019',
                name: runnerCandidateName,
                partyId: runnerPartyId,
                votes: Math.round(runnerVotes * 0.89),
                voteSharePercentage: Number((runnerShare * 100).toFixed(1)),
                status: 'RUNNER_UP',
                photoUrl: getAvatarUrl(runnerCandidateName, PARTIES_MAP[runnerPartyId] || '#64748b')
              }
            ],
            partyBreakdown: [
              { partyId: winningPartyId, votes: Math.round(winnerVotes * 0.93), voteSharePercentage: Number((winShare * 100).toFixed(1)), boothsLedCount: 170 },
              { partyId: runnerPartyId, votes: Math.round(runnerVotes * 0.89), voteSharePercentage: Number((runnerShare * 100).toFixed(1)), boothsLedCount: 90 }
            ]
          },
          2014: {
            year: 2014,
            electionType: 'Assembly (Vidhan Sabha)',
            totalElectors: Math.round(baseElectors * 0.86),
            totalPolled: Math.round(totalPolled * 0.84),
            turnoutPercentage: Number((turnoutRate * 100 - 4.5).toFixed(1)),
            winningPartyId: runnerPartyId,
            winningCandidateId: 'cand_incumbent_2014',
            winningMargin: Math.round(margin * 0.8),
            winningMarginPercentage: Number((marginPct * 0.8).toFixed(1)),
            candidates: [
              {
                id: 'cand_incumbent_2014',
                name: 'Previous Elected Representative',
                partyId: runnerPartyId,
                votes: Math.round(runnerVotes * 0.95),
                voteSharePercentage: 45.2,
                status: 'WON',
                photoUrl: getAvatarUrl('Former MLA', PARTIES_MAP[runnerPartyId] || '#64748b')
              }
            ],
            partyBreakdown: [
              { partyId: runnerPartyId, votes: Math.round(runnerVotes * 0.95), voteSharePercentage: 45.2, boothsLedCount: 155 }
            ]
          }
        },
        booths
      };
    });

    return {
      id: districtId,
      name: districtName,
      constituencies
    };
  });

  return {
    id: 'MH',
    name: 'Maharashtra',
    code: 'MH',
    districts: structuredDistricts
  };
}

export const MAHARASHTRA_STATE_DATA = buildMaharashtraStateData();
