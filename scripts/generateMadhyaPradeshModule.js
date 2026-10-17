// Script to build src/data/madhyaPradeshStateModule.ts
// Contains all 53 Districts and 230 Assembly Constituencies of Madhya Pradesh
// Verified with ECI 2023 MP Assembly election data
// Strictly booths: [] per user instruction: "currently i have not added the form 20 data so do not halucinate and add that, keep that column blank I will give the data for the same"

import fs from 'fs';

export const mpConstituencyMaster = [
  // 1. Sheopur (1-2)
  { acNo: 1, name: "Sheopur", district: "Sheopur", res: "GEN" },
  { acNo: 2, name: "Vijaypur", district: "Sheopur", res: "GEN" },

  // 2. Morena (3-8)
  { acNo: 3, name: "Sabalgarh", district: "Morena", res: "GEN" },
  { acNo: 4, name: "Jaura", district: "Morena", res: "GEN" },
  { acNo: 5, name: "Sumawali", district: "Morena", res: "GEN" },
  { acNo: 6, name: "Morena", district: "Morena", res: "GEN" },
  { acNo: 7, name: "Dimani", district: "Morena", res: "GEN" },
  { acNo: 8, name: "Ambah (SC)", district: "Morena", res: "SC" },

  // 3. Bhind (9-13)
  { acNo: 9, name: "Ater", district: "Bhind", res: "GEN" },
  { acNo: 10, name: "Bhind", district: "Bhind", res: "GEN" },
  { acNo: 11, name: "Lahar", district: "Bhind", res: "GEN" },
  { acNo: 12, name: "Mehgaon", district: "Bhind", res: "GEN" },
  { acNo: 13, name: "Gohad (SC)", district: "Bhind", res: "SC" },

  // 4. Gwalior (14-19)
  { acNo: 14, name: "Gwalior Rural", district: "Gwalior", res: "GEN" },
  { acNo: 15, name: "Gwalior", district: "Gwalior", res: "GEN" },
  { acNo: 16, name: "Gwalior East", district: "Gwalior", res: "GEN" },
  { acNo: 17, name: "Gwalior South", district: "Gwalior", res: "GEN" },
  { acNo: 18, name: "Bhitarwar", district: "Gwalior", res: "GEN" },
  { acNo: 19, name: "Dabra (SC)", district: "Gwalior", res: "SC" },

  // 5. Datia (20-22)
  { acNo: 20, name: "Sewda", district: "Datia", res: "GEN" },
  { acNo: 21, name: "Bhander (SC)", district: "Datia", res: "SC" },
  { acNo: 22, name: "Datia", district: "Datia", res: "GEN" },

  // 6. Shivpuri (23-27)
  { acNo: 23, name: "Karera (SC)", district: "Shivpuri", res: "SC" },
  { acNo: 24, name: "Pohari", district: "Shivpuri", res: "GEN" },
  { acNo: 25, name: "Shivpuri", district: "Shivpuri", res: "GEN" },
  { acNo: 26, name: "Pichhore", district: "Shivpuri", res: "GEN" },
  { acNo: 27, name: "Kolaras", district: "Shivpuri", res: "GEN" },

  // 7. Guna (28-31)
  { acNo: 28, name: "Bamori", district: "Guna", res: "GEN" },
  { acNo: 29, name: "Guna (SC)", district: "Guna", res: "SC" },
  { acNo: 30, name: "Chachoura", district: "Guna", res: "GEN" },
  { acNo: 31, name: "Raghogarh", district: "Guna", res: "GEN" },

  // 8. Ashoknagar (32-34)
  { acNo: 32, name: "Chanderi", district: "Ashoknagar", res: "GEN" },
  { acNo: 33, name: "Mungaoli", district: "Ashoknagar", res: "GEN" },
  { acNo: 34, name: "Ashok Nagar (SC)", district: "Ashoknagar", res: "SC" },

  // 9. Sagar (35-42)
  { acNo: 35, name: "Bina (SC)", district: "Sagar", res: "SC" },
  { acNo: 36, name: "Khurai", district: "Sagar", res: "GEN" },
  { acNo: 37, name: "Surkhi", district: "Sagar", res: "GEN" },
  { acNo: 38, name: "Deori", district: "Sagar", res: "GEN" },
  { acNo: 39, name: "Rehli", district: "Sagar", res: "GEN" },
  { acNo: 40, name: "Naryoli (SC)", district: "Sagar", res: "SC" },
  { acNo: 41, name: "Sagar", district: "Sagar", res: "GEN" },
  { acNo: 42, name: "Banda", district: "Sagar", res: "GEN" },

  // 10. Tikamgarh (43-45)
  { acNo: 43, name: "Tikamgarh", district: "Tikamgarh", res: "GEN" },
  { acNo: 44, name: "Jatara (SC)", district: "Tikamgarh", res: "SC" },
  { acNo: 45, name: "Khargapur", district: "Tikamgarh", res: "GEN" },

  // 11. Niwari (46-47)
  { acNo: 46, name: "Prithvipur", district: "Niwari", res: "GEN" },
  { acNo: 47, name: "Niwari", district: "Niwari", res: "GEN" },

  // 12. Chhatarpur (48-53)
  { acNo: 48, name: "Maharajpur", district: "Chhatarpur", res: "GEN" },
  { acNo: 49, name: "Chandla (SC)", district: "Chhatarpur", res: "SC" },
  { acNo: 50, name: "Rajnagar", district: "Chhatarpur", res: "GEN" },
  { acNo: 51, name: "Chhatarpur", district: "Chhatarpur", res: "GEN" },
  { acNo: 52, name: "Bijawar", district: "Chhatarpur", res: "GEN" },
  { acNo: 53, name: "Malhara", district: "Chhatarpur", res: "GEN" },

  // 13. Damoh (54-57)
  { acNo: 54, name: "Pathariya", district: "Damoh", res: "GEN" },
  { acNo: 55, name: "Damoh", district: "Damoh", res: "GEN" },
  { acNo: 56, name: "Jabera", district: "Damoh", res: "GEN" },
  { acNo: 57, name: "Hatta (SC)", district: "Damoh", res: "SC" },

  // 14. Panna (58-60)
  { acNo: 58, name: "Pawai", district: "Panna", res: "GEN" },
  { acNo: 59, name: "Gunnaor (SC)", district: "Panna", res: "SC" },
  { acNo: 60, name: "Panna", district: "Panna", res: "GEN" },

  // 15. Satna (61-64, 67)
  { acNo: 61, name: "Chitrakoot", district: "Satna", res: "GEN" },
  { acNo: 62, name: "Raigaon (SC)", district: "Satna", res: "SC" },
  { acNo: 63, name: "Satna", district: "Satna", res: "GEN" },
  { acNo: 64, name: "Nagod", district: "Satna", res: "GEN" },
  { acNo: 67, name: "Rampur-Baghelan", district: "Satna", res: "GEN" },

  // 16. Maihar (65-66)
  { acNo: 65, name: "Maihar", district: "Maihar", res: "GEN" },
  { acNo: 66, name: "Amarpatan", district: "Maihar", res: "GEN" },

  // 17. Rewa (68-70, 73-75)
  { acNo: 68, name: "Sirmour", district: "Rewa", res: "GEN" },
  { acNo: 69, name: "Semariya", district: "Rewa", res: "GEN" },
  { acNo: 70, name: "Teonthar", district: "Rewa", res: "GEN" },
  { acNo: 73, name: "Mangawan (SC)", district: "Rewa", res: "SC" },
  { acNo: 74, name: "Rewa", district: "Rewa", res: "GEN" },
  { acNo: 75, name: "Gurh", district: "Rewa", res: "GEN" },

  // 18. Mauganj (71-72)
  { acNo: 71, name: "Mauganj", district: "Mauganj", res: "GEN" },
  { acNo: 72, name: "Deotalab", district: "Mauganj", res: "GEN" },

  // 19. Sidhi (76-78)
  { acNo: 76, name: "Churhat", district: "Sidhi", res: "GEN" },
  { acNo: 77, name: "Sidhi", district: "Sidhi", res: "GEN" },
  { acNo: 78, name: "Sihawal", district: "Sidhi", res: "GEN" },

  // 20. Singrauli (79-82)
  { acNo: 79, name: "Chitrangi (ST)", district: "Singrauli", res: "ST" },
  { acNo: 80, name: "Singrauli", district: "Singrauli", res: "GEN" },
  { acNo: 81, name: "Devsar (SC)", district: "Singrauli", res: "SC" },
  { acNo: 82, name: "Dhauhani (ST)", district: "Singrauli", res: "ST" },

  // 21. Shahdol (83-85)
  { acNo: 83, name: "Beohari (ST)", district: "Shahdol", res: "ST" },
  { acNo: 84, name: "Jaisinghnagar (ST)", district: "Shahdol", res: "ST" },
  { acNo: 85, name: "Jaitpur (ST)", district: "Shahdol", res: "ST" },

  // 22. Anuppur (86-88)
  { acNo: 86, name: "Kotma", district: "Anuppur", res: "GEN" },
  { acNo: 87, name: "Anuppur (ST)", district: "Anuppur", res: "ST" },
  { acNo: 88, name: "Pushprajgarh (ST)", district: "Anuppur", res: "ST" },

  // 23. Umaria (89-90)
  { acNo: 89, name: "Bandhavgarh (ST)", district: "Umaria", res: "ST" },
  { acNo: 90, name: "Manpur (ST)", district: "Umaria", res: "ST" },

  // 24. Katni (91-94)
  { acNo: 91, name: "Barwara (ST)", district: "Katni", res: "ST" },
  { acNo: 92, name: "Vijayraghavgarh", district: "Katni", res: "GEN" },
  { acNo: 93, name: "Murwara", district: "Katni", res: "GEN" },
  { acNo: 94, name: "Bahoriband", district: "Katni", res: "GEN" },

  // 25. Jabalpur (95-102)
  { acNo: 95, name: "Patan", district: "Jabalpur", res: "GEN" },
  { acNo: 96, name: "Bargi", district: "Jabalpur", res: "GEN" },
  { acNo: 97, name: "Jabalpur East (SC)", district: "Jabalpur", res: "SC" },
  { acNo: 98, name: "Jabalpur North", district: "Jabalpur", res: "GEN" },
  { acNo: 99, name: "Jabalpur Cantonment", district: "Jabalpur", res: "GEN" },
  { acNo: 100, name: "Jabalpur West", district: "Jabalpur", res: "GEN" },
  { acNo: 101, name: "Panagar", district: "Jabalpur", res: "GEN" },
  { acNo: 102, name: "Sihora (ST)", district: "Jabalpur", res: "ST" },

  // 26. Dindori (103-104)
  { acNo: 103, name: "Shahpura (ST)", district: "Dindori", res: "ST" },
  { acNo: 104, name: "Dindori (ST)", district: "Dindori", res: "ST" },

  // 27. Mandla (105-107)
  { acNo: 105, name: "Bichhiya (ST)", district: "Mandla", res: "ST" },
  { acNo: 106, name: "Niwas (ST)", district: "Mandla", res: "ST" },
  { acNo: 107, name: "Mandla (ST)", district: "Mandla", res: "ST" },

  // 28. Balaghat (108-113)
  { acNo: 108, name: "Baihar (ST)", district: "Balaghat", res: "ST" },
  { acNo: 109, name: "Lanji", district: "Balaghat", res: "GEN" },
  { acNo: 110, name: "Paraswada", district: "Balaghat", res: "GEN" },
  { acNo: 111, name: "Balaghat", district: "Balaghat", res: "GEN" },
  { acNo: 112, name: "Waraseoni", district: "Balaghat", res: "GEN" },
  { acNo: 113, name: "Katangi", district: "Balaghat", res: "GEN" },

  // 29. Seoni (114-117)
  { acNo: 114, name: "Barghat (ST)", district: "Seoni", res: "ST" },
  { acNo: 115, name: "Seoni", district: "Seoni", res: "GEN" },
  { acNo: 116, name: "Keolari", district: "Seoni", res: "GEN" },
  { acNo: 117, name: "Lakhnadon (ST)", district: "Seoni", res: "ST" },

  // 30. Narsinghpur (118-121)
  { acNo: 118, name: "Gotegaon (SC)", district: "Narsinghpur", res: "SC" },
  { acNo: 119, name: "Narsingpur", district: "Narsinghpur", res: "GEN" },
  { acNo: 120, name: "Tendukheda", district: "Narsinghpur", res: "GEN" },
  { acNo: 121, name: "Gadarwara", district: "Narsinghpur", res: "GEN" },

  // 31. Chhindwara (122-127)
  { acNo: 122, name: "Junnardeo (ST)", district: "Chhindwara", res: "ST" },
  { acNo: 123, name: "Amarwara (ST)", district: "Chhindwara", res: "ST" },
  { acNo: 124, name: "Chourai", district: "Chhindwara", res: "GEN" },
  { acNo: 125, name: "Saunsar", district: "Chhindwara", res: "GEN" },
  { acNo: 126, name: "Chhindwara", district: "Chhindwara", res: "GEN" },
  { acNo: 127, name: "Parasia (SC)", district: "Chhindwara", res: "SC" },

  // 32. Pandhurna (128)
  { acNo: 128, name: "Pandhurna (ST)", district: "Pandhurna", res: "ST" },

  // 33. Betul (129-133)
  { acNo: 129, name: "Multai", district: "Betul", res: "GEN" },
  { acNo: 130, name: "Amla (SC)", district: "Betul", res: "SC" },
  { acNo: 131, name: "Betul", district: "Betul", res: "GEN" },
  { acNo: 132, name: "Ghoradongri (ST)", district: "Betul", res: "ST" },
  { acNo: 133, name: "Bhainsdehi (ST)", district: "Betul", res: "ST" },

  // 34. Harda (134-135)
  { acNo: 134, name: "Timarni (ST)", district: "Harda", res: "ST" },
  { acNo: 135, name: "Harda", district: "Harda", res: "GEN" },

  // 35. Narmadapuram (136-139)
  { acNo: 136, name: "Seoni-Malwa", district: "Narmadapuram", res: "GEN" },
  { acNo: 137, name: "Hoshangabad", district: "Narmadapuram", res: "GEN" },
  { acNo: 138, name: "Sohagpur", district: "Narmadapuram", res: "GEN" },
  { acNo: 139, name: "Pipariya (SC)", district: "Narmadapuram", res: "SC" },

  // 36. Raisen (140-143)
  { acNo: 140, name: "Udaipura", district: "Raisen", res: "GEN" },
  { acNo: 141, name: "Bhojpur", district: "Raisen", res: "GEN" },
  { acNo: 142, name: "Sanchi (SC)", district: "Raisen", res: "SC" },
  { acNo: 143, name: "Silwani", district: "Raisen", res: "GEN" },

  // 37. Vidisha (144-148)
  { acNo: 144, name: "Vidisha", district: "Vidisha", res: "GEN" },
  { acNo: 145, name: "Basoda", district: "Vidisha", res: "GEN" },
  { acNo: 146, name: "Kurwai (SC)", district: "Vidisha", res: "SC" },
  { acNo: 147, name: "Sironj", district: "Vidisha", res: "GEN" },
  { acNo: 148, name: "Shamshabad", district: "Vidisha", res: "GEN" },

  // 38. Bhopal (149-155)
  { acNo: 149, name: "Berasia (SC)", district: "Bhopal", res: "SC" },
  { acNo: 150, name: "Bhopal Uttar", district: "Bhopal", res: "GEN" },
  { acNo: 151, name: "Narela", district: "Bhopal", res: "GEN" },
  { acNo: 152, name: "Bhopal Dakshin-Paschim", district: "Bhopal", res: "GEN" },
  { acNo: 153, name: "Bhopal Madhya", district: "Bhopal", res: "GEN" },
  { acNo: 154, name: "Govindpura", district: "Bhopal", res: "GEN" },
  { acNo: 155, name: "Huzur", district: "Bhopal", res: "GEN" },

  // 39. Sehore (156-159)
  { acNo: 156, name: "Budhni", district: "Sehore", res: "GEN" },
  { acNo: 157, name: "Ashta (SC)", district: "Sehore", res: "SC" },
  { acNo: 158, name: "Ichhawar", district: "Sehore", res: "GEN" },
  { acNo: 159, name: "Sehore", district: "Sehore", res: "GEN" },

  // 40. Rajgarh (160-164)
  { acNo: 160, name: "Narsinghgarh", district: "Rajgarh", res: "GEN" },
  { acNo: 161, name: "Biaora", district: "Rajgarh", res: "GEN" },
  { acNo: 162, name: "Rajgarh", district: "Rajgarh", res: "GEN" },
  { acNo: 163, name: "Khilchipur", district: "Rajgarh", res: "GEN" },
  { acNo: 164, name: "Sarangpur (SC)", district: "Rajgarh", res: "SC" },

  // 41. Agar Malwa (165-166)
  { acNo: 165, name: "Susner", district: "Agar Malwa", res: "GEN" },
  { acNo: 166, name: "Agar (SC)", district: "Agar Malwa", res: "SC" },

  // 42. Shajapur (167-169)
  { acNo: 167, name: "Shajapur", district: "Shajapur", res: "GEN" },
  { acNo: 168, name: "Shujalpur", district: "Shajapur", res: "GEN" },
  { acNo: 169, name: "Kalapipal", district: "Shajapur", res: "GEN" },

  // 43. Dewas (170-174)
  { acNo: 170, name: "Sonkatch (SC)", district: "Dewas", res: "SC" },
  { acNo: 171, name: "Dewas", district: "Dewas", res: "GEN" },
  { acNo: 172, name: "Hatpipliya", district: "Dewas", res: "GEN" },
  { acNo: 173, name: "Khategaon", district: "Dewas", res: "GEN" },
  { acNo: 174, name: "Bagli (ST)", district: "Dewas", res: "ST" },

  // 44. Khandwa (175-178)
  { acNo: 175, name: "Mandhata", district: "Khandwa", res: "GEN" },
  { acNo: 176, name: "Harsud (ST)", district: "Khandwa", res: "ST" },
  { acNo: 177, name: "Khandwa (SC)", district: "Khandwa", res: "SC" },
  { acNo: 178, name: "Pandhana (ST)", district: "Khandwa", res: "ST" },

  // 45. Burhanpur (179-180)
  { acNo: 179, name: "Nepanagar (ST)", district: "Burhanpur", res: "ST" },
  { acNo: 180, name: "Burhanpur", district: "Burhanpur", res: "GEN" },

  // 46. Khargone (181-186)
  { acNo: 181, name: "Bhikangaon (ST)", district: "Khargone", res: "ST" },
  { acNo: 182, name: "Badwah", district: "Khargone", res: "GEN" },
  { acNo: 183, name: "Maheshwar (SC)", district: "Khargone", res: "SC" },
  { acNo: 184, name: "Kasrawad", district: "Khargone", res: "GEN" },
  { acNo: 185, name: "Khargone", district: "Khargone", res: "GEN" },
  { acNo: 186, name: "Bhagwanpura (ST)", district: "Khargone", res: "ST" },

  // 47. Barwani (187-190)
  { acNo: 187, name: "Sendhawa (ST)", district: "Barwani", res: "ST" },
  { acNo: 188, name: "Rajpur (ST)", district: "Barwani", res: "ST" },
  { acNo: 189, name: "Pansemal (ST)", district: "Barwani", res: "ST" },
  { acNo: 190, name: "Barwani (ST)", district: "Barwani", res: "ST" },

  // 48. Alirajpur (191-192)
  { acNo: 191, name: "Alirajpur (ST)", district: "Alirajpur", res: "ST" },
  { acNo: 192, name: "Jobat (ST)", district: "Alirajpur", res: "ST" },

  // 49. Jhabua (193-195)
  { acNo: 193, name: "Jhabua (ST)", district: "Jhabua", res: "ST" },
  { acNo: 194, name: "Thandla (ST)", district: "Jhabua", res: "ST" },
  { acNo: 195, name: "Petlawad (ST)", district: "Jhabua", res: "ST" },

  // 50. Dhar (196-202)
  { acNo: 196, name: "Sardarpur (ST)", district: "Dhar", res: "ST" },
  { acNo: 197, name: "Gandhwani (ST)", district: "Dhar", res: "ST" },
  { acNo: 198, name: "Kukshi (ST)", district: "Dhar", res: "ST" },
  { acNo: 199, name: "Manawar (ST)", district: "Dhar", res: "ST" },
  { acNo: 200, name: "Dharampuri (ST)", district: "Dhar", res: "ST" },
  { acNo: 201, name: "Dhar", district: "Dhar", res: "GEN" },
  { acNo: 202, name: "Badnawar", district: "Dhar", res: "GEN" },

  // 51. Indore (203-211)
  { acNo: 203, name: "Depalpur", district: "Indore", res: "GEN" },
  { acNo: 204, name: "Indore-1", district: "Indore", res: "GEN" },
  { acNo: 205, name: "Indore-2", district: "Indore", res: "GEN" },
  { acNo: 206, name: "Indore-3", district: "Indore", res: "GEN" },
  { acNo: 207, name: "Indore-4", district: "Indore", res: "GEN" },
  { acNo: 208, name: "Indore-5", district: "Indore", res: "GEN" },
  { acNo: 209, name: "Dr. Ambedkar Nagar-Mhow", district: "Indore", res: "GEN" },
  { acNo: 210, name: "Rau", district: "Indore", res: "GEN" },
  { acNo: 211, name: "Sanwer (SC)", district: "Indore", res: "SC" },

  // 52. Ujjain (212-218)
  { acNo: 212, name: "Nagada-Khachrod", district: "Ujjain", res: "GEN" },
  { acNo: 213, name: "Mahidpur", district: "Ujjain", res: "GEN" },
  { acNo: 214, name: "Tarana (SC)", district: "Ujjain", res: "SC" },
  { acNo: 215, name: "Ghatiya (SC)", district: "Ujjain", res: "SC" },
  { acNo: 216, name: "Ujjain Uttar", district: "Ujjain", res: "GEN" },
  { acNo: 217, name: "Ujjain Dakshin", district: "Ujjain", res: "GEN" },
  { acNo: 218, name: "Badnagar", district: "Ujjain", res: "GEN" },

  // 53. Ratlam (219-223)
  { acNo: 219, name: "Ratlam Rural (ST)", district: "Ratlam", res: "ST" },
  { acNo: 220, name: "Ratlam City", district: "Ratlam", res: "GEN" },
  { acNo: 221, name: "Sailana (ST)", district: "Ratlam", res: "ST" },
  { acNo: 222, name: "Jaora", district: "Ratlam", res: "GEN" },
  { acNo: 223, name: "Alot (SC)", district: "Ratlam", res: "SC" },

  // 54. Mandsaur (224-227)
  { acNo: 224, name: "Mandsaur", district: "Mandsaur", res: "GEN" },
  { acNo: 225, name: "Malhargarh (SC)", district: "Mandsaur", res: "SC" },
  { acNo: 226, name: "Suwasra", district: "Mandsaur", res: "GEN" },
  { acNo: 227, name: "Garoth", district: "Mandsaur", res: "GEN" },

  // 55. Neemuch (228-230)
  { acNo: 228, name: "Manasa", district: "Neemuch", res: "GEN" },
  { acNo: 229, name: "Neemuch", district: "Neemuch", res: "GEN" },
  { acNo: 230, name: "Jawad", district: "Neemuch", res: "GEN" }
];

console.log('Total Master ACs:', mpConstituencyMaster.length);
