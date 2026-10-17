// Script to generate src/data/madhyaPradeshStateModule.ts
// Based on Election Commission of India, State Election 2023 to the Legislative Assembly of Madhya Pradesh (Detailed Results)
// and District to Assembly Constituency mapping.

import fs from 'fs';

// Helper for party ID
export function getPartyId(partyCode) {
  switch (partyCode) {
    case 'BJP': return 'NDA_BJP';
    case 'INC': return 'INDIA_INC';
    case 'BSP': return 'BSP';
    case 'AAAP':
    case 'AAP': return 'AAP';
    case 'SP': return 'SP';
    case 'GGP': return 'GGP';
    case 'BHRTADVSIP':
    case 'BAP': return 'BHRTADVSIP';
    case 'CPI(M)':
    case 'CPIM': return 'CPIM';
    case 'CPI': return 'CPI';
    case 'ASPKR': return 'ASPKR';
    case 'BSCP': return 'BSCP';
    case 'AIMIM': return 'AIMIM';
    case 'JD(U)':
    case 'JDU': return 'JDU';
    case 'SDPI': return 'SDPI';
    default: return 'IND_OTH';
  }
}

console.log('MP generator script initialized.');
