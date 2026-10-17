export type ReservationCategory = 'GEN' | 'SC' | 'ST';

export type BoothType = 'URBAN' | 'RURAL' | 'SEMI_URBAN';

export interface Party {
  id: string;
  name: string;
  shortName: string;
  color: string; // e.g. hex #1e3a8a
  bgLight: string; // Tailwind tint e.g. bg-blue-50
  alliance?: string;
  flagSymbol?: string;
}

export interface Candidate {
  id: string;
  name: string;
  partyId: string;
  votes: number;
  voteSharePercentage: number;
  status: 'WON' | 'RUNNER_UP' | 'LOST';
  photoUrl?: string;
}

export interface DemographicItem {
  communityName: string;
  category: 'OBC' | 'SC' | 'ST' | 'GENERAL' | 'MINORITY';
  percentage: number; // e.g., 28.5
  populationEstimate: number;
  sourceTag: string; // e.g. "Chanakya Political Research (2024)"
  confidence: 'HIGH' | 'MEDIUM' | 'ESTIMATED';
  trendNote?: string;
}

export interface DemographicSourceMeta {
  id: string;
  name: string;
  type: 'PRIMARY_ESTIMATE' | 'CENSUS_DERIVED' | 'STATE_SURVEY' | 'ECI_LIST_DERIVED';
  year: number;
  sampleSize?: string;
  reliabilityScore: string;
  description: string;
}

export interface BoothHistoricalResult {
  year: number;
  turnoutPercentage: number;
  winningPartyId: string;
  winningCandidateName: string;
  winningMargin: number;
  totalVotesPolled: number;
}

export interface Booth {
  id: string; // e.g. "042"
  number: number;
  name: string; // e.g. "St. Jude's Primary School"
  locationName: string; // e.g. "North Ward, Room 2"
  wardZone: string;
  boothType: BoothType;
  registeredElectors: number;
  totalVotesPolled: number;
  turnoutPercentage: number;
  validVotes: number;
  rejectedVotes: number;
  notaVotes: number;
  candidateVotes: Record<string, number>; // candidateId -> vote count
  winningPartyId: string;
  winningCandidateId: string;
  runnerUpPartyId: string;
  runnerUpCandidateId: string;
  winningMargin: number;
  winningMarginPercentage: number;
  dominantCommunity: string;
  latitude?: number;
  longitude?: number;
  spatialX?: number;
  spatialY?: number;
  sectorId?: string;
  sectorName?: string;
  historicalResults: Record<number, BoothHistoricalResult>;
}

export interface PartyResultSummary {
  partyId: string;
  votes: number;
  voteSharePercentage: number;
  boothsLedCount: number;
}

export interface ElectionYearData {
  year: number;
  electionType: 'Assembly (Vidhan Sabha)' | 'General (Lok Sabha)';
  totalElectors: number;
  totalPolled: number;
  turnoutPercentage: number;
  winningPartyId: string;
  winningCandidateId: string;
  winningMargin: number;
  winningMarginPercentage: number;
  candidates: Candidate[];
  partyBreakdown: PartyResultSummary[];
}

export interface Constituency {
  id: string;
  number: number;
  name: string;
  stateId: string;
  stateName: string;
  districtId: string;
  districtName: string;
  reservationCategory: ReservationCategory;
  totalBooths: number;
  currentYear: number;
  elections: Record<number, ElectionYearData>; // 2024, 2019, 2014
  demographics: DemographicItem[];
  demographicSources: DemographicSourceMeta[];
  activeDemographicSourceId: string;
  booths: Booth[];
  boundaryGeoJsonAvailable?: boolean;
}

export interface District {
  id: string;
  name: string;
  constituencies: Constituency[];
}

export interface StateData {
  id: string;
  name: string;
  code: string;
  districts: District[];
}

export interface BoothFilterState {
  searchQuery: string;
  turnoutRange: 'ALL' | 'UNDER_50' | '50_TO_65' | '65_TO_80' | 'OVER_80';
  winningPartyId: string;
  marginRange: 'ALL' | 'UNDER_5' | '5_TO_10' | 'OVER_10';
  boothType: 'ALL' | BoothType;
  dominantCommunity: string;
  sortBy: 'NUMBER' | 'ELECTORS' | 'TURNOUT' | 'MARGIN';
  sortOrder: 'ASC' | 'DESC';
}
