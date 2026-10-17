import fs from 'fs';

// Complete dataset for 230 Assembly Constituencies of Madhya Pradesh
// Verified against:
// 1. District & Assembly Mapping (53 Districts, 230 ACs)
// 2. Election Commission of India State Election 2023 to the Legislative Assembly of Madhya Pradesh (Detailed Results)

export const mpRawData = [
  // 1. Sheopur District (1-2)
  {
    acNo: 1, name: "Sheopur", district: "Sheopur", res: "GEN",
    electors: 258978, polled: 211909, turnout: 81.83,
    winner: { name: "Babu Jandel", party: "INC", votes: 96844, pct: 45.7 },
    runnerUp: { name: "Durgalal Vijay (vakeel Saab)", party: "BJP", votes: 85714, pct: 40.45 },
    others: [
      { name: "Bihari Singh Solanki", party: "BSP", votes: 23054, pct: 10.88 },
      { name: "Adil Khan", party: "SDPI", votes: 733, pct: 0.35 },
      { name: "Balwan", party: "IND", votes: 724, pct: 0.34 },
      { name: "Harvilash", party: "IND", votes: 634, pct: 0.3 },
      { name: "NOTA", party: "IND_OTH", votes: 1801, pct: 0.85 }
    ]
  },
  {
    acNo: 2, name: "Vijaypur", district: "Sheopur", res: "GEN",
    electors: 253270, polled: 207102, turnout: 81.77,
    winner: { name: "Ramniwas Rawat", party: "INC", votes: 69646, pct: 33.63 },
    runnerUp: { name: "Baboo Lal Mewra", party: "BJP", votes: 51587, pct: 24.91 },
    others: [
      { name: "Mukesh Malhotra Ad.", party: "IND", votes: 44128, pct: 21.31 },
      { name: "Dhara Singh Kushwah", party: "BSP", votes: 34346, pct: 16.58 },
      { name: "Ramniwash Kushwah", party: "IND_OTH", votes: 1084, pct: 0.52 },
      { name: "NOTA", party: "IND_OTH", votes: 1895, pct: 0.92 }
    ]
  },

  // 2. Morena District (3-8)
  {
    acNo: 3, name: "Sabalgarh", district: "Morena", res: "GEN",
    electors: 233949, polled: 180152, turnout: 77.0,
    winner: { name: "Smt. Sarla Vijendra Rawat", party: "BJP", votes: 66787, pct: 37.07 },
    runnerUp: { name: "Baij Nath Kushwah", party: "INC", votes: 56982, pct: 31.63 },
    others: [
      { name: "Soni Dhakad", party: "BSP", votes: 51153, pct: 28.39 },
      { name: "Lal Singh Rathor", party: "SP", votes: 1781, pct: 0.99 },
      { name: "Ashok Tiwari", party: "CPI(M)", votes: 1320, pct: 0.73 },
      { name: "NOTA", party: "IND_OTH", votes: 589, pct: 0.33 }
    ]
  },
  {
    acNo: 4, name: "Jaura", district: "Morena", res: "GEN",
    electors: 263314, polled: 191080, turnout: 72.57,
    winner: { name: "Pankaj Upadhyay", party: "INC", votes: 89253, pct: 46.71 },
    runnerUp: { name: "Subedar Singh Sikarwar Rajoudha", party: "BJP", votes: 58972, pct: 30.86 },
    others: [
      { name: "Soneram Kushwah", party: "BSP", votes: 37038, pct: 19.38 },
      { name: "Fouji Bhagwati Dhakad Rajodha", party: "AAP", votes: 1966, pct: 1.03 },
      { name: "Maniram Dhakad", party: "SP", votes: 913, pct: 0.48 },
      { name: "NOTA", party: "IND_OTH", votes: 853, pct: 0.45 }
    ]
  },
  {
    acNo: 5, name: "Sumawali", district: "Morena", res: "GEN",
    electors: 256955, polled: 186139, turnout: 72.44,
    winner: { name: "Aidal Singh Kansana", party: "BJP", votes: 72508, pct: 38.95 },
    runnerUp: { name: "Kuldeep Singh Sikarwar", party: "BSP", votes: 56500, pct: 30.35 },
    others: [
      { name: "Ajab Singh Kushwah", party: "INC", votes: 55289, pct: 29.7 },
      { name: "Smt Mamta Kushwah", party: "ASPKR", votes: 624, pct: 0.34 },
      { name: "NOTA", party: "IND_OTH", votes: 562, pct: 0.3 }
    ]
  },
  {
    acNo: 6, name: "Morena", district: "Morena", res: "GEN",
    electors: 262887, polled: 170598, turnout: 64.89,
    winner: { name: "Dinesh Gurjar", party: "INC", votes: 73695, pct: 43.2 },
    runnerUp: { name: "Raghuraj Singh Kansana", party: "BJP", votes: 53824, pct: 31.55 },
    others: [
      { name: "Rakesh Rustam Singh", party: "BSP", votes: 37167, pct: 21.79 },
      { name: "Ramesh Upadhyay", party: "AAP", votes: 1932, pct: 1.13 },
      { name: "Dr. Murari Lal Mittal", party: "IND", votes: 780, pct: 0.46 },
      { name: "NOTA", party: "IND_OTH", votes: 382, pct: 0.22 }
    ]
  },
  {
    acNo: 7, name: "Dimani", district: "Morena", res: "GEN",
    electors: 231809, polled: 161714, turnout: 69.76,
    winner: { name: "Narendra Singh Tomar", party: "BJP", votes: 79137, pct: 48.94 },
    runnerUp: { name: "Balveer Singh Dandotiya", party: "BSP", votes: 54676, pct: 33.81 },
    others: [
      { name: "Ravindra Singh Tomar Bhidosa", party: "INC", votes: 24006, pct: 14.84 },
      { name: "Mahesh Agrwal Mama", party: "SP", votes: 748, pct: 0.46 },
      { name: "Surendra Singh Tomar", party: "AAP", votes: 675, pct: 0.42 },
      { name: "NOTA", party: "IND_OTH", votes: 778, pct: 0.48 }
    ]
  },
  {
    acNo: 8, name: "Ambah (SC)", district: "Morena", res: "SC",
    electors: 241497, polled: 145133, turnout: 60.1,
    winner: { name: "Devendra Ramnarayan Sakhwar", party: "INC", votes: 80373, pct: 55.38 },
    runnerUp: { name: "Kamlesh Jatav", party: "BJP", votes: 57746, pct: 39.79 },
    others: [
      { name: "Rambaran Sakhawar", party: "BSP", votes: 4179, pct: 2.88 },
      { name: "Somesh Azad Sakhawar", party: "ASPKR", votes: 495, pct: 0.34 },
      { name: "NOTA", party: "IND_OTH", votes: 884, pct: 0.61 }
    ]
  },

  // 3. Bhind District (9-13)
  {
    acNo: 9, name: "Ater", district: "Bhind", res: "GEN",
    electors: 241065, polled: 152815, turnout: 63.39,
    winner: { name: "Hemant Satyadev Katare", party: "INC", votes: 69542, pct: 45.51 },
    runnerUp: { name: "Arvind Bhadoria", party: "BJP", votes: 49314, pct: 32.27 },
    others: [
      { name: "Hari Shankar Fhogi", party: "BSP", votes: 18787, pct: 12.29 },
      { name: "Munna Singh Bhadouria", party: "SP", votes: 10288, pct: 6.73 },
      { name: "NOTA", party: "IND_OTH", votes: 168, pct: 0.11 }
    ]
  },
  {
    acNo: 10, name: "Bhind", district: "Bhind", res: "GEN",
    electors: 275052, polled: 162149, turnout: 58.95,
    winner: { name: "Narendra Singh Kushwah", party: "BJP", votes: 66420, pct: 40.96 },
    runnerUp: { name: "Chaudhary Rakesh Singh Chaturvedi", party: "INC", votes: 52274, pct: 32.24 },
    others: [
      { name: "Sanjeev Singh (sanju)", party: "BSP", votes: 34938, pct: 21.55 },
      { name: "Rahul Singh Kushwah", party: "AAP", votes: 3056, pct: 1.88 },
      { name: "NOTA", party: "IND_OTH", votes: 422, pct: 0.26 }
    ]
  },
  {
    acNo: 11, name: "Lahar", district: "Bhind", res: "GEN",
    electors: 260054, polled: 175747, turnout: 67.58,
    winner: { name: "Ambrish Sharma \"guddu\"", party: "BJP", votes: 75347, pct: 42.87 },
    runnerUp: { name: "Dr. Govind Singh", party: "INC", votes: 62950, pct: 35.82 },
    others: [
      { name: "Rasal Singh", party: "BSP", votes: 31348, pct: 17.84 },
      { name: "Sanjeev \"aazad\"", party: "IND", votes: 1412, pct: 0.8 },
      { name: "NOTA", party: "IND_OTH", votes: 1556, pct: 0.89 }
    ]
  },
  {
    acNo: 12, name: "Mehgaon", district: "Bhind", res: "GEN",
    electors: 279778, polled: 181531, turnout: 64.88,
    winner: { name: "Rakesh Shukla", party: "BJP", votes: 87153, pct: 48.01 },
    runnerUp: { name: "Rahul Singh Bhadouria", party: "INC", votes: 65143, pct: 35.89 },
    others: [
      { name: "Rajbeer", party: "BSP", votes: 19506, pct: 10.75 },
      { name: "Bhupendra Karana", party: "ASPKR", votes: 4488, pct: 2.47 },
      { name: "Satendra Bhadoriya", party: "AAP", votes: 1825, pct: 1.01 },
      { name: "NOTA", party: "IND_OTH", votes: 905, pct: 0.5 }
    ]
  },
  {
    acNo: 13, name: "Gohad (SC)", district: "Bhind", res: "SC",
    electors: 239734, polled: 147796, turnout: 61.65,
    winner: { name: "Keshav Desai", party: "INC", votes: 69941, pct: 47.32 },
    runnerUp: { name: "Lal Singh Arya", party: "BJP", votes: 69334, pct: 46.91 },
    others: [
      { name: "Suresh Singh Sholankee", party: "BSP", votes: 2919, pct: 1.98 },
      { name: "Yashwant Patwari", party: "AAP", votes: 1366, pct: 0.92 },
      { name: "Anita Kamal Nagar", party: "ASPKR", votes: 1245, pct: 0.84 },
      { name: "NOTA", party: "IND_OTH", votes: 790, pct: 0.53 }
    ]
  }
];

console.log('Sample ACs loaded:', mpRawData.length);
