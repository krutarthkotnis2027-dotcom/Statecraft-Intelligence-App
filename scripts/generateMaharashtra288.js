import fs from 'fs';

const rawConstituencies = [
  // Nandurbar (1-4)
  { acNo: 1, name: "Akkalkuwa (ST)", district: "Nandurbar", mla: "Aamshya Padavi", party: "SHS", alliance: "NDA", res: "ST" },
  { acNo: 2, name: "Shahada (ST)", district: "Nandurbar", mla: "Rajesh Padvi", party: "BJP", alliance: "NDA", res: "ST" },
  { acNo: 3, name: "Nandurbar (ST)", district: "Nandurbar", mla: "Vijaykumar Gavit", party: "BJP", alliance: "NDA", res: "ST" },
  { acNo: 4, name: "Navapur (ST)", district: "Nandurbar", mla: "Shirishkumar Naik", party: "INC", alliance: "MVA", res: "ST" },

  // Dhule (5-9)
  { acNo: 5, name: "Sakri (ST)", district: "Dhule", mla: "Manjula Gavit", party: "SHS", alliance: "NDA", res: "ST" },
  { acNo: 6, name: "Dhule Rural", district: "Dhule", mla: "Raghavendra Patil", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 7, name: "Dhule City", district: "Dhule", mla: "Anup Agrawal", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 8, name: "Sindkheda", district: "Dhule", mla: "Jayakumar Rawal", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 9, name: "Shirpur (ST)", district: "Dhule", mla: "Kashiram Pawara", party: "BJP", alliance: "NDA", res: "ST" },

  // Jalgaon (10-20)
  { acNo: 10, name: "Chopda (ST)", district: "Jalgaon", mla: "Chandrakant Sonawane", party: "SHS", alliance: "NDA", res: "ST" },
  { acNo: 11, name: "Raver", district: "Jalgaon", mla: "Amol Jawale", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 12, name: "Bhusawal (SC)", district: "Jalgaon", mla: "Sanjay Savkare", party: "BJP", alliance: "NDA", res: "SC" },
  { acNo: 13, name: "Jalgaon City", district: "Jalgaon", mla: "Suresh Bhole", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 14, name: "Jalgaon Rural", district: "Jalgaon", mla: "Gulabrao Patil", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 15, name: "Amalner", district: "Jalgaon", mla: "Anil Bhaidas Patil", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 16, name: "Erandol", district: "Jalgaon", mla: "Amol Patil", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 17, name: "Chalisgaon", district: "Jalgaon", mla: "Mangesh Chavan", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 18, name: "Pachora", district: "Jalgaon", mla: "Kishor Appa Patil", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 19, name: "Jamner", district: "Jalgaon", mla: "Girish Mahajan", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 20, name: "Muktainagar", district: "Jalgaon", mla: "Chandrakant Nimba Patil", party: "SHS", alliance: "NDA", res: "GEN" },

  // Buldana (21-27)
  { acNo: 21, name: "Malkapur", district: "Buldana", mla: "Chainsukh Sancheti", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 22, name: "Buldhana", district: "Buldana", mla: "Sanjay Gaikwad", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 23, name: "Chikhali", district: "Buldana", mla: "Shweta Mahale", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 24, name: "Sindkhed Raja", district: "Buldana", mla: "Manoj Kayande", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 25, name: "Mehkar (SC)", district: "Buldana", mla: "Siddharth Kharat", party: "SS(UBT)", alliance: "MVA", res: "SC" },
  { acNo: 26, name: "Khamgaon", district: "Buldana", mla: "Akash Fundkar", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 27, name: "Jalgaon (Jamod)", district: "Buldana", mla: "Sanjay Kute", party: "BJP", alliance: "NDA", res: "GEN" },

  // Akola (28-32)
  { acNo: 28, name: "Akot", district: "Akola", mla: "Prakash Bharsakale", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 29, name: "Balapur", district: "Akola", mla: "Nitin Tale", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 30, name: "Akola West", district: "Akola", mla: "Sajid Khan Pathan", party: "INC", alliance: "MVA", res: "GEN" },
  { acNo: 31, name: "Akola East", district: "Akola", mla: "Randhir Savarkar", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 32, name: "Murtizapur (SC)", district: "Akola", mla: "Harish Pimple", party: "BJP", alliance: "NDA", res: "SC" },

  // Washim (33-35)
  { acNo: 33, name: "Risod", district: "Washim", mla: "Amit Zanak", party: "INC", alliance: "MVA", res: "GEN" },
  { acNo: 34, name: "Washim (SC)", district: "Washim", mla: "Shyam Khode", party: "BJP", alliance: "NDA", res: "SC" },
  { acNo: 35, name: "Karanja", district: "Washim", mla: "Sai Prakash Dahake", party: "BJP", alliance: "NDA", res: "GEN" },

  // Amravati (36-43)
  { acNo: 36, name: "Dhamangaon Railway", district: "Amravati", mla: "Pratap Adsad", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 37, name: "Badnera", district: "Amravati", mla: "Ravi Rana", party: "RYSP", alliance: "NDA", res: "GEN" },
  { acNo: 38, name: "Amravati", district: "Amravati", mla: "Sulbha Khodke", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 39, name: "Teosa", district: "Amravati", mla: "Rajesh Wankhade", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 40, name: "Daryapur (SC)", district: "Amravati", mla: "Gajanan Lawate", party: "SS(UBT)", alliance: "MVA", res: "SC" },
  { acNo: 41, name: "Melghat (ST)", district: "Amravati", mla: "Kewalram Kale", party: "BJP", alliance: "NDA", res: "ST" },
  { acNo: 42, name: "Achalpur", district: "Amravati", mla: "Pravin Tayade", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 43, name: "Morshi", district: "Amravati", mla: "Chandu Yawalkar", party: "BJP", alliance: "NDA", res: "GEN" },

  // Wardha (44-47)
  { acNo: 44, name: "Arvi", district: "Wardha", mla: "Sumit Wankhede", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 45, name: "Deoli", district: "Wardha", mla: "Rajesh Bakane", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 46, name: "Hinganghat", district: "Wardha", mla: "Samir Kunawar", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 47, name: "Wardha", district: "Wardha", mla: "Pankaj Bhoyar", party: "BJP", alliance: "NDA", res: "GEN" },

  // Nagpur (48-59)
  { acNo: 48, name: "Katol", district: "Nagpur", mla: "Charansing Thakur", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 49, name: "Savner", district: "Nagpur", mla: "Ashish Deshmukh", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 50, name: "Hingna", district: "Nagpur", mla: "Sameer Meghe", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 51, name: "Umred (SC)", district: "Nagpur", mla: "Sanjay Meshram", party: "INC", alliance: "MVA", res: "SC" },
  { acNo: 52, name: "Nagpur South West", district: "Nagpur", mla: "Devendra Fadnavis", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 53, name: "Nagpur South", district: "Nagpur", mla: "Mohan Mate", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 54, name: "Nagpur East", district: "Nagpur", mla: "Krishna Khopde", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 55, name: "Nagpur Central", district: "Nagpur", mla: "Pravin Datke", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 56, name: "Nagpur West", district: "Nagpur", mla: "Vikas Thakre", party: "INC", alliance: "MVA", res: "GEN" },
  { acNo: 57, name: "Nagpur North (SC)", district: "Nagpur", mla: "Nitin Raut", party: "INC", alliance: "MVA", res: "SC" },
  { acNo: 58, name: "Kamthi", district: "Nagpur", mla: "Chandrashekhar Bawankule", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 59, name: "Ramtek", district: "Nagpur", mla: "Ashish Jaiswal", party: "SHS", alliance: "NDA", res: "GEN" },

  // Bhandara (60-62)
  { acNo: 60, name: "Tumsar", district: "Bhandara", mla: "Raju Karemore", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 61, name: "Bhandara (SC)", district: "Bhandara", mla: "Narendra Bhondekar", party: "SHS", alliance: "NDA", res: "SC" },
  { acNo: 62, name: "Sakoli", district: "Bhandara", mla: "Nana Patole", party: "INC", alliance: "MVA", res: "GEN" },

  // Gondia (63-66)
  { acNo: 63, name: "Arjuni Morgaon (SC)", district: "Gondia", mla: "Rajkumar Badole", party: "NCP", alliance: "NDA", res: "SC" },
  { acNo: 64, name: "Tirora", district: "Gondia", mla: "Vijay Rahangdale", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 65, name: "Gondiya", district: "Gondia", mla: "Vinod Agrawal", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 66, name: "Amgaon (ST)", district: "Gondia", mla: "Sanjay Puram", party: "BJP", alliance: "NDA", res: "ST" },

  // Gadchiroli (67-69)
  { acNo: 67, name: "Armori (ST)", district: "Gadchiroli", mla: "Ramdas Masram", party: "INC", alliance: "MVA", res: "ST" },
  { acNo: 68, name: "Gadchiroli (ST)", district: "Gadchiroli", mla: "Milind Narote", party: "BJP", alliance: "NDA", res: "ST" },
  { acNo: 69, name: "Aheri (ST)", district: "Gadchiroli", mla: "Dharamrao Baba Atram", party: "NCP", alliance: "NDA", res: "ST" },

  // Chandrapur (70-75)
  { acNo: 70, name: "Rajura", district: "Chandrapur", mla: "Deorao Bhongle", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 71, name: "Chandrapur (SC)", district: "Chandrapur", mla: "Kishor Jorgewar", party: "BJP", alliance: "NDA", res: "SC" },
  { acNo: 72, name: "Ballarpur", district: "Chandrapur", mla: "Sudhir Mungantiwar", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 73, name: "Bramhapuri", district: "Chandrapur", mla: "Vijay Wadettiwar", party: "INC", alliance: "MVA", res: "GEN" },
  { acNo: 74, name: "Chimur", district: "Chandrapur", mla: "Bunty Bhangdiya", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 75, name: "Warora", district: "Chandrapur", mla: "Karan Deotale", party: "BJP", alliance: "NDA", res: "GEN" },

  // Yavatmal (76-82)
  { acNo: 76, name: "Wani", district: "Yavatmal", mla: "Sanjay Derkar", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 77, name: "Ralegaon (ST)", district: "Yavatmal", mla: "Ashok Uike", party: "BJP", alliance: "NDA", res: "ST" },
  { acNo: 78, name: "Yavatmal", district: "Yavatmal", mla: "Balasaheb Mangulkar", party: "INC", alliance: "MVA", res: "GEN" },
  { acNo: 79, name: "Digras", district: "Yavatmal", mla: "Sanjay Rathod", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 80, name: "Arni (ST)", district: "Yavatmal", mla: "Raju Todsam", party: "BJP", alliance: "NDA", res: "ST" },
  { acNo: 81, name: "Pusad", district: "Yavatmal", mla: "Indranil Naik", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 82, name: "Umarkhed (SC)", district: "Yavatmal", mla: "Kisan Wankhede", party: "BJP", alliance: "NDA", res: "SC" },

  // Nanded (83-91)
  { acNo: 83, name: "Kinwat", district: "Nanded", mla: "Bhimrao Keram", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 84, name: "Hadgaon", district: "Nanded", mla: "Baburao Kadam", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 85, name: "Bhokar", district: "Nanded", mla: "Sreejaya Chavan", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 86, name: "Nanded North", district: "Nanded", mla: "Balaji Kalyankar", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 87, name: "Nanded South", district: "Nanded", mla: "Anand Tidke", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 88, name: "Loha", district: "Nanded", mla: "Prataprao Chikhalikar", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 89, name: "Naigaon", district: "Nanded", mla: "Rajesh Pawar", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 90, name: "Deglur (SC)", district: "Nanded", mla: "Jitesh Antapurkar", party: "BJP", alliance: "NDA", res: "SC" },
  { acNo: 91, name: "Mukhed", district: "Nanded", mla: "Tushar Rathod", party: "BJP", alliance: "NDA", res: "GEN" },

  // Hingoli (92-94)
  { acNo: 92, name: "Basmath", district: "Hingoli", mla: "Chandrakant Nawghare", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 93, name: "Kalamnuri", district: "Hingoli", mla: "Santosh Bangar", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 94, name: "Hingoli", district: "Hingoli", mla: "Tanaji Mutkule", party: "BJP", alliance: "NDA", res: "GEN" },

  // Parbhani (95-98)
  { acNo: 95, name: "Jintur", district: "Parbhani", mla: "Meghana Bordikar", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 96, name: "Parbhani", district: "Parbhani", mla: "Rahul Vedprakash Patil", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 97, name: "Gangakhed", district: "Parbhani", mla: "Ratnakar Gutte", party: "RSPS", alliance: "NDA", res: "GEN" },
  { acNo: 98, name: "Pathri", district: "Parbhani", mla: "Rajesh Vitekar", party: "NCP", alliance: "NDA", res: "GEN" },

  // Jalna (99-103)
  { acNo: 99, name: "Partur", district: "Jalna", mla: "Babanrao Lonikar", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 100, name: "Ghansawangi", district: "Jalna", mla: "Hikmat Udhan", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 101, name: "Jalna", district: "Jalna", mla: "Arjun Khotkar", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 102, name: "Badnapur (SC)", district: "Jalna", mla: "Narayan Kuche", party: "BJP", alliance: "NDA", res: "SC" },
  { acNo: 103, name: "Bhokardan", district: "Jalna", mla: "Santosh Danve", party: "BJP", alliance: "NDA", res: "GEN" },

  // Chhatrapati Sambhaji Nagar (104-112)
  { acNo: 104, name: "Sillod", district: "Chhatrapati Sambhaji Nagar", mla: "Abdul Sattar", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 105, name: "Kannad", district: "Chhatrapati Sambhaji Nagar", mla: "Sanjana Jadhav", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 106, name: "Phulambri", district: "Chhatrapati Sambhaji Nagar", mla: "Anuradha Chavan", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 107, name: "Aurangabad Central", district: "Chhatrapati Sambhaji Nagar", mla: "Pradeep Jaiswal", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 108, name: "Aurangabad West (SC)", district: "Chhatrapati Sambhaji Nagar", mla: "Sanjay Shirsat", party: "SHS", alliance: "NDA", res: "SC" },
  { acNo: 109, name: "Aurangabad East", district: "Chhatrapati Sambhaji Nagar", mla: "Atul Save", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 110, name: "Paithan", district: "Chhatrapati Sambhaji Nagar", mla: "Vilas Bhumre", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 111, name: "Gangapur", district: "Chhatrapati Sambhaji Nagar", mla: "Prashant Bamb", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 112, name: "Vaijapur", district: "Chhatrapati Sambhaji Nagar", mla: "Ramesh Bornare", party: "SHS", alliance: "NDA", res: "GEN" },

  // Nashik (113-127)
  { acNo: 113, name: "Nandgaon", district: "Nashik", mla: "Suhas Kande", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 114, name: "Malegaon Central", district: "Nashik", mla: "Ismail Abdul Khalique", party: "AIMIM", alliance: "None", res: "GEN" },
  { acNo: 115, name: "Malegaon Outer", district: "Nashik", mla: "Dadaji Bhuse", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 116, name: "Baglan (ST)", district: "Nashik", mla: "Dilip Borse", party: "BJP", alliance: "NDA", res: "ST" },
  { acNo: 117, name: "Kalwan (ST)", district: "Nashik", mla: "Nitin Pawar", party: "NCP", alliance: "NDA", res: "ST" },
  { acNo: 118, name: "Chandwad", district: "Nashik", mla: "Rahul Aher", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 119, name: "Yevla", district: "Nashik", mla: "Chhagan Bhujbal", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 120, name: "Sinnar", district: "Nashik", mla: "Manikrao Kokate", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 121, name: "Niphad", district: "Nashik", mla: "Diliprao Bankar", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 122, name: "Dindori (ST)", district: "Nashik", mla: "Narhari Zirwal", party: "NCP", alliance: "NDA", res: "ST" },
  { acNo: 123, name: "Nashik East", district: "Nashik", mla: "Rahul Dhikale", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 124, name: "Nashik Central", district: "Nashik", mla: "Devayani Farande", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 125, name: "Nashik West", district: "Nashik", mla: "Seema Hiray", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 126, name: "Deolali (SC)", district: "Nashik", mla: "Saroj Ahire", party: "NCP", alliance: "NDA", res: "SC" },
  { acNo: 127, name: "Igatpuri (ST)", district: "Nashik", mla: "Hiraman Khoskar", party: "NCP", alliance: "NDA", res: "ST" },

  // Palghar (128-133)
  { acNo: 128, name: "Dahanu (ST)", district: "Palghar", mla: "Vinod Bhiva Nikole", party: "CPI(M)", alliance: "MVA", res: "ST" },
  { acNo: 129, name: "Vikramgad (ST)", district: "Palghar", mla: "Harishchandra Bhoye", party: "BJP", alliance: "NDA", res: "ST" },
  { acNo: 130, name: "Palghar (ST)", district: "Palghar", mla: "Rajendra Gavit", party: "SHS", alliance: "NDA", res: "ST" },
  { acNo: 131, name: "Boisar (ST)", district: "Palghar", mla: "Vilas Tare", party: "SHS", alliance: "NDA", res: "ST" },
  { acNo: 132, name: "Nalasopara", district: "Palghar", mla: "Rajan Naik", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 133, name: "Vasai", district: "Palghar", mla: "Sneha Pandit", party: "BJP", alliance: "NDA", res: "GEN" },

  // Thane (134-151)
  { acNo: 134, name: "Bhiwandi Rural (ST)", district: "Thane", mla: "Shantaram More", party: "SHS", alliance: "NDA", res: "ST" },
  { acNo: 135, name: "Shahapur (ST)", district: "Thane", mla: "Daulat Daroda", party: "NCP", alliance: "NDA", res: "ST" },
  { acNo: 136, name: "Bhiwandi West", district: "Thane", mla: "Mahesh Choughule", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 137, name: "Bhiwandi East", district: "Thane", mla: "Rais Shaikh", party: "SP", alliance: "MVA", res: "GEN" },
  { acNo: 138, name: "Kalyan West", district: "Thane", mla: "Vishwanath Bhoir", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 139, name: "Murbad", district: "Thane", mla: "Kisan Kathore", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 140, name: "Ambernath (SC)", district: "Thane", mla: "Balaji Kinikar", party: "SHS", alliance: "NDA", res: "SC" },
  { acNo: 141, name: "Ulhasnagar", district: "Thane", mla: "Kumar Ailani", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 142, name: "Kalyan East", district: "Thane", mla: "Sulbha Gaikwad", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 143, name: "Dombivli", district: "Thane", mla: "Ravindra Chavan", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 144, name: "Kalyan Rural", district: "Thane", mla: "Rajesh More", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 145, name: "Mira Bhayandar", district: "Thane", mla: "Narendra Mehta", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 146, name: "Ovala-Majiwada", district: "Thane", mla: "Pratap Sarnaik", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 147, name: "Kopri-Pachpakhadi", district: "Thane", mla: "Eknath Shinde", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 148, name: "Thane", district: "Thane", mla: "Sanjay Kelkar", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 149, name: "Mumbra-Kalwa", district: "Thane", mla: "Jitendra Awhad", party: "NCP-SP", alliance: "MVA", res: "GEN" },
  { acNo: 150, name: "Airoli", district: "Thane", mla: "Ganesh Naik", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 151, name: "Belapur", district: "Thane", mla: "Manda Mhatre", party: "BJP", alliance: "NDA", res: "GEN" },

  // Mumbai Suburban (152-177)
  { acNo: 152, name: "Borivali", district: "Mumbai Suburban", mla: "Sanjay Upadhyay", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 153, name: "Dahisar", district: "Mumbai Suburban", mla: "Manisha Chaudhary", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 154, name: "Magathane", district: "Mumbai Suburban", mla: "Prakash Surve", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 155, name: "Mulund", district: "Mumbai Suburban", mla: "Mihir Kotecha", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 156, name: "Vikhroli", district: "Mumbai Suburban", mla: "Sunil Raut", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 157, name: "Bhandup West", district: "Mumbai Suburban", mla: "Ashok Patil", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 158, name: "Jogeshwari East", district: "Mumbai Suburban", mla: "Anant Nar", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 159, name: "Dindoshi", district: "Mumbai Suburban", mla: "Sunil Prabhu", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 160, name: "Kandivali East", district: "Mumbai Suburban", mla: "Atul Bhatkhalkar", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 161, name: "Charkop", district: "Mumbai Suburban", mla: "Yogesh Sagar", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 162, name: "Malad West", district: "Mumbai Suburban", mla: "Aslam Shaikh", party: "INC", alliance: "MVA", res: "GEN" },
  { acNo: 163, name: "Goregaon", district: "Mumbai Suburban", mla: "Vidya Thakur", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 164, name: "Versova", district: "Mumbai Suburban", mla: "Haroon Rashid Khan", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 165, name: "Andheri West", district: "Mumbai Suburban", mla: "Ameet Satam", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 166, name: "Andheri East", district: "Mumbai Suburban", mla: "Murji Patel", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 167, name: "Vile Parle", district: "Mumbai Suburban", mla: "Parag Alavani", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 168, name: "Chandivali", district: "Mumbai Suburban", mla: "Dilip Lande", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 169, name: "Ghatkopar West", district: "Mumbai Suburban", mla: "Ram Kadam", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 170, name: "Ghatkopar East", district: "Mumbai Suburban", mla: "Parag Shah", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 171, name: "Mankhurd Shivaji Nagar", district: "Mumbai Suburban", mla: "Abu Asim Azmi", party: "SP", alliance: "MVA", res: "GEN" },
  { acNo: 172, name: "Anushakti Nagar", district: "Mumbai Suburban", mla: "Sana Malik", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 173, name: "Chembur", district: "Mumbai Suburban", mla: "Tukaram Kate", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 174, name: "Kurla(SC)", district: "Mumbai Suburban", mla: "Mangesh Kudalkar", party: "SHS", alliance: "NDA", res: "SC" },
  { acNo: 175, name: "Kalina", district: "Mumbai Suburban", mla: "Sanjay Potnis", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 176, name: "Vandre East", district: "Mumbai Suburban", mla: "Varun Sardesai", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 177, name: "Vandre West", district: "Mumbai Suburban", mla: "Ashish Shelar", party: "BJP", alliance: "NDA", res: "GEN" },

  // Mumbai City (178-187)
  { acNo: 178, name: "Dharavi (SC)", district: "Mumbai City", mla: "Jyoti Gaikwad", party: "INC", alliance: "MVA", res: "SC" },
  { acNo: 179, name: "Sion Koliwada", district: "Mumbai City", mla: "R. Tamil Selvan", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 180, name: "Wadala", district: "Mumbai City", mla: "Kalidas Kolambkar", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 181, name: "Mahim", district: "Mumbai City", mla: "Mahesh Sawant", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 182, name: "Worli", district: "Mumbai City", mla: "Aaditya Thackeray", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 183, name: "Shivadi", district: "Mumbai City", mla: "Ajay Choudhari", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 184, name: "Byculla", district: "Mumbai City", mla: "Manoj Jamsutkar", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 185, name: "Malabar Hill", district: "Mumbai City", mla: "Mangal Lodha", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 186, name: "Mumbadevi", district: "Mumbai City", mla: "Amin Patel", party: "INC", alliance: "MVA", res: "GEN" },
  { acNo: 187, name: "Colaba", district: "Mumbai City", mla: "Rahul Narwekar", party: "BJP", alliance: "NDA", res: "GEN" },

  // Raigad (188-194)
  { acNo: 188, name: "Panvel", district: "Raigad", mla: "Prashant Thakur", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 189, name: "Karjat", district: "Raigad", mla: "Mahendra Thorve", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 190, name: "Uran", district: "Raigad", mla: "Mahesh Baldi", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 191, name: "Pen", district: "Raigad", mla: "Ravisheth Patil", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 192, name: "Alibag", district: "Raigad", mla: "Mahendra Dalvi", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 193, name: "Shrivardhan", district: "Raigad", mla: "Aditi Tatkare", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 194, name: "Mahad", district: "Raigad", mla: "Bharatshet Gogawale", party: "SHS", alliance: "NDA", res: "GEN" },

  // Pune (195-215)
  { acNo: 195, name: "Junnar", district: "Pune", mla: "Sharaddada Sonavane", party: "IND", alliance: "None", res: "GEN" },
  { acNo: 196, name: "Ambegaon", district: "Pune", mla: "Dilip Walse Patil", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 197, name: "Khed Alandi", district: "Pune", mla: "Babaji Kale", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 198, name: "Shirur", district: "Pune", mla: "Dnyaneshwar Katke", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 199, name: "Daund", district: "Pune", mla: "Rahul Kul", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 200, name: "Indapur", district: "Pune", mla: "Dattatray Bharne", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 201, name: "Baramati", district: "Pune", mla: "Sunetra Pawar", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 202, name: "Purandar", district: "Pune", mla: "Vijay Shivtare", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 203, name: "Bhor", district: "Pune", mla: "Shankar Mandekar", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 204, name: "Maval", district: "Pune", mla: "Sunil Shelke", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 205, name: "Chinchwad", district: "Pune", mla: "Shankar Jagtap", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 206, name: "Pimpri (SC)", district: "Pune", mla: "Anna Bansode", party: "NCP", alliance: "NDA", res: "SC" },
  { acNo: 207, name: "Bhosari", district: "Pune", mla: "Mahesh Landge", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 208, name: "Vadgaon Sheri", district: "Pune", mla: "Bapusaheb Pathare", party: "NCP-SP", alliance: "MVA", res: "GEN" },
  { acNo: 209, name: "Shivajinagar", district: "Pune", mla: "Siddharth Shirole", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 210, name: "Kothrud", district: "Pune", mla: "Chandrakant Patil", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 211, name: "Khadakwasala", district: "Pune", mla: "Bhimrao Tapkir", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 212, name: "Parvati", district: "Pune", mla: "Madhuri Misal", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 213, name: "Hadapsar", district: "Pune", mla: "Chetan Tupe", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 214, name: "Pune Cantonment", district: "Pune", mla: "Sunil Kamble", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 215, name: "Kasba Peth", district: "Pune", mla: "Hemant Rasane", party: "BJP", alliance: "NDA", res: "GEN" },

  // Ahilyanagar / Ahmednagar (216-227)
  { acNo: 216, name: "Akole (ST)", district: "Ahilyanagar", mla: "Kiran Lahamate", party: "NCP", alliance: "NDA", res: "ST" },
  { acNo: 217, name: "Sangamner", district: "Ahilyanagar", mla: "Amol Khatal", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 218, name: "Shirdi", district: "Ahilyanagar", mla: "Radhakrishna Vikhe Patil", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 219, name: "Kopargaon", district: "Ahilyanagar", mla: "Ashutosh Kale", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 220, name: "Shrirampur (SC)", district: "Ahilyanagar", mla: "Hemant Ogale", party: "INC", alliance: "MVA", res: "SC" },
  { acNo: 221, name: "Nevasa", district: "Ahilyanagar", mla: "Vitthalrao Langhe", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 222, name: "Shevgaon", district: "Ahilyanagar", mla: "Monika Rajale", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 223, name: "Rahuri", district: "Ahilyanagar", mla: "Akshay Shivajirao Kardile", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 224, name: "Parner", district: "Ahilyanagar", mla: "Kashinath Date", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 225, name: "Ahmednagar City", district: "Ahilyanagar", mla: "Sangram Jagtap", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 226, name: "Shrigonda", district: "Ahilyanagar", mla: "Vikram Pachpute", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 227, name: "Karjat Jamkhed", district: "Ahilyanagar", mla: "Rohit Pawar", party: "NCP-SP", alliance: "MVA", res: "GEN" },

  // Beed (228-233)
  { acNo: 228, name: "Georai (SC)", district: "Beed", mla: "Vijaysinh Pandit", party: "NCP", alliance: "NDA", res: "SC" },
  { acNo: 229, name: "Majalgaon", district: "Beed", mla: "Prakashdada Solanke", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 230, name: "Beed", district: "Beed", mla: "Sandeep Kshirsagar", party: "NCP-SP", alliance: "MVA", res: "GEN" },
  { acNo: 231, name: "Ashti", district: "Beed", mla: "Suresh Dhas", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 232, name: "Kaij (SC)", district: "Beed", mla: "Namita Mundada", party: "BJP", alliance: "NDA", res: "SC" },
  { acNo: 233, name: "Parli", district: "Beed", mla: "Dhananjay Munde", party: "NCP", alliance: "NDA", res: "GEN" },

  // Latur (234-239)
  { acNo: 234, name: "Latur Rural", district: "Latur", mla: "Ramesh Karad", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 235, name: "Latur City", district: "Latur", mla: "Amit Deshmukh", party: "INC", alliance: "MVA", res: "GEN" },
  { acNo: 236, name: "Ahmadpur", district: "Latur", mla: "Babasaheb Patil", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 237, name: "Udgir (SC)", district: "Latur", mla: "Sanjay Bansode", party: "NCP", alliance: "NDA", res: "SC" },
  { acNo: 238, name: "Nilanga", district: "Latur", mla: "Sambhaji Patil Nilangekar", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 239, name: "Ausa", district: "Latur", mla: "Abhimanyu Pawar", party: "BJP", alliance: "NDA", res: "GEN" },

  // Dharashiv (240-243)
  { acNo: 240, name: "Umarga (SC)", district: "Dharashiv", mla: "Pravin Virbhadrayya Swami", party: "SS(UBT)", alliance: "MVA", res: "SC" },
  { acNo: 241, name: "Tuljapur", district: "Dharashiv", mla: "Ranajagjitsinha Patil", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 242, name: "Dharashiv", district: "Dharashiv", mla: "Kailas Patil", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 243, name: "Paranda", district: "Dharashiv", mla: "Tanaji Sawant", party: "SHS", alliance: "NDA", res: "GEN" },

  // Solapur (244-254)
  { acNo: 244, name: "Karmala", district: "Solapur", mla: "Narayan Patil", party: "NCP-SP", alliance: "MVA", res: "GEN" },
  { acNo: 245, name: "Madha", district: "Solapur", mla: "Abhijeet Patil", party: "NCP-SP", alliance: "MVA", res: "GEN" },
  { acNo: 246, name: "Barshi", district: "Solapur", mla: "Dilip Sopal", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 247, name: "Mohol (SC)", district: "Solapur", mla: "Raju Khare", party: "NCP-SP", alliance: "MVA", res: "SC" },
  { acNo: 248, name: "Solapur City North", district: "Solapur", mla: "Vijay Deshmukh", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 249, name: "Solapur City Central", district: "Solapur", mla: "Devendra Kothe", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 250, name: "Akkalkot", district: "Solapur", mla: "Sachin Kalyanshetti", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 251, name: "Solapur South", district: "Solapur", mla: "Subhash Deshmukh", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 252, name: "Pandharpur", district: "Solapur", mla: "Samadhan Autade", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 253, name: "Sangola", district: "Solapur", mla: "Babasaheb Deshmukh", party: "PWPI", alliance: "None", res: "GEN" },
  { acNo: 254, name: "Malshiras (SC)", district: "Solapur", mla: "Uttamrao Jankar", party: "NCP-SP", alliance: "MVA", res: "SC" },

  // Satara (255-262)
  { acNo: 255, name: "Phaltan (SC)", district: "Satara", mla: "Sachin Patil", party: "NCP", alliance: "NDA", res: "SC" },
  { acNo: 256, name: "Wai", district: "Satara", mla: "Makrand Jadhav - Patil", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 257, name: "Koregaon", district: "Satara", mla: "Mahesh Shinde", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 258, name: "Man", district: "Satara", mla: "Jaykumar Gore", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 259, name: "Karad North", district: "Satara", mla: "Manoj Ghorpade", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 260, name: "Karad South", district: "Satara", mla: "Atulbaba Bhosale", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 261, name: "Patan", district: "Satara", mla: "Shambhuraj Desai", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 262, name: "Satara", district: "Satara", mla: "Shivendra Raje Bhosale", party: "BJP", alliance: "NDA", res: "GEN" },

  // Ratnagiri (263-267)
  { acNo: 263, name: "Dapoli", district: "Ratnagiri", mla: "Yogesh Kadam", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 264, name: "Guhagar", district: "Ratnagiri", mla: "Bhaskar Jadhav", party: "SS(UBT)", alliance: "MVA", res: "GEN" },
  { acNo: 265, name: "Chiplun", district: "Ratnagiri", mla: "Shekhar Nikam", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 266, name: "Ratnagiri", district: "Ratnagiri", mla: "Uday Samant", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 267, name: "Rajapur", district: "Ratnagiri", mla: "Kiran Samant", party: "SHS", alliance: "NDA", res: "GEN" },

  // Sindhudurg (268-270)
  { acNo: 268, name: "Kankavli", district: "Sindhudurg", mla: "Nitesh Rane", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 269, name: "Kudal", district: "Sindhudurg", mla: "Nilesh Rane", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 270, name: "Sawantwadi", district: "Sindhudurg", mla: "Deepak Kesarkar", party: "SHS", alliance: "NDA", res: "GEN" },

  // Kolhapur (271-280)
  { acNo: 271, name: "Chandgad", district: "Kolhapur", mla: "Shivaji Patil", party: "IND", alliance: "None", res: "GEN" },
  { acNo: 272, name: "Radhanagari", district: "Kolhapur", mla: "Prakashrao Abitkar", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 273, name: "Kagal", district: "Kolhapur", mla: "Hasan Mushrif", party: "NCP", alliance: "NDA", res: "GEN" },
  { acNo: 274, name: "Kolhapur South", district: "Kolhapur", mla: "Amal Mahadik", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 275, name: "Karvir", district: "Kolhapur", mla: "Chandradip Narke", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 276, name: "Kolhapur North", district: "Kolhapur", mla: "Rajesh Kshirsagar", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 277, name: "Shahuwadi", district: "Kolhapur", mla: "Vinay Kore", party: "JSS", alliance: "NDA", res: "GEN" },
  { acNo: 278, name: "Hatkanangle (SC)", district: "Kolhapur", mla: "Ashokrao Mane", party: "JSS", alliance: "NDA", res: "SC" },
  { acNo: 279, name: "Ichalkaranji", district: "Kolhapur", mla: "Rahul Awade", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 280, name: "Shirol", district: "Kolhapur", mla: "Rajendra Patil Yadravkar", party: "RSVA", alliance: "NDA", res: "GEN" },

  // Sangli (281-288)
  { acNo: 281, name: "Miraj (SC)", district: "Sangli", mla: "Suresh Khade", party: "BJP", alliance: "NDA", res: "SC" },
  { acNo: 282, name: "Sangli", district: "Sangli", mla: "Sudhir Gadgil", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 283, name: "Islampur", district: "Sangli", mla: "Jayant Patil", party: "NCP-SP", alliance: "MVA", res: "GEN" },
  { acNo: 284, name: "Shirala", district: "Sangli", mla: "Satyajit Deshmukh", party: "BJP", alliance: "NDA", res: "GEN" },
  { acNo: 285, name: "Palus-Kadegaon", district: "Sangli", mla: "Vishwajeet Kadam", party: "INC", alliance: "MVA", res: "GEN" },
  { acNo: 286, name: "Khanapur", district: "Sangli", mla: "Suhas Babar", party: "SHS", alliance: "NDA", res: "GEN" },
  { acNo: 287, name: "Tasgaon-Kavathe Mahankal", district: "Sangli", mla: "Rohit Patil", party: "NCP-SP", alliance: "MVA", res: "GEN" },
  { acNo: 288, name: "Jat", district: "Sangli", mla: "Gopichand Padalkar", party: "BJP", alliance: "NDA", res: "GEN" }
];

console.log('Total Maharashtra constituencies count:', rawConstituencies.length);

fs.writeFileSync('src/data/maharashtra288Raw.json', JSON.stringify(rawConstituencies, null, 2));
console.log('Wrote raw 288 constituencies');
