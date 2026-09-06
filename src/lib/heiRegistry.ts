export interface HeiData {
  id: string;
  code: string;
  name: string;
  type: string;
  district: string;
  districtId: string;
  lat: number;
  lon: number;
  nirfRank?: number;
  nirfScore: number;
  establishedYear?: number;
  address: string;
  website?: string;
  specializations: string[];
  departments: Array<{
    name: string;
    focus: string[];
    activeCapacity: number;
  }>;
}

export const JHARKHAND_HEIS_44: HeiData[] = [
  {
    id: 'hei_iitism_01',
    code: 'IITISM-DHN',
    name: 'Indian Institute of Technology (ISM) Dhanbad',
    type: 'Central/National',
    district: 'Dhanbad',
    districtId: 'dhanbad',
    lat: 23.8143,
    lon: 86.4412,
    nirfRank: 15,
    nirfScore: 0.98,
    establishedYear: 1926,
    address: 'Police Line, Sardar Patel Nagar, Dhanbad, Jharkhand 826004',
    website: 'https://www.iitism.ac.in',
    specializations: ['WATER_MANAGEMENT', 'ROAD_INFRASTRUCTURE', 'SANITATION_WASTE', 'FORESTRY_ENVIRONMENT'],
    departments: [
      { name: 'Department of Environmental Science & Engineering', focus: ['Groundwater Arsenic Remediation', 'Mine Drainage Filtration'], activeCapacity: 10 },
      { name: 'Department of Civil Engineering', focus: ['Pavement Durability', 'Rural Culvert Scour Analysis'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_nitjsr_02',
    code: 'NITJSR',
    name: 'National Institute of Technology Jamshedpur',
    type: 'Central/National',
    district: 'East Singhbhum',
    districtId: 'east-singhbhum',
    lat: 22.7770,
    lon: 86.1441,
    nirfRank: 86,
    nirfScore: 0.92,
    establishedYear: 1960,
    address: 'Adityapur, Jamshedpur, Jharkhand 831014',
    website: 'https://www.nitjsr.ac.in',
    specializations: ['RURAL_ELECTRIFICATION_SOLAR', 'ROAD_INFRASTRUCTURE', 'WATER_MANAGEMENT'],
    departments: [
      { name: 'Department of Electrical Engineering', focus: ['Solar Microgrid Inverters', 'Transformer Thermal Faults'], activeCapacity: 9 }
    ]
  },
  {
    id: 'hei_bitmesra_03',
    code: 'BITMESRA',
    name: 'Birla Institute of Technology, Mesra',
    type: 'Deemed University',
    district: 'Ranchi',
    districtId: 'ranchi',
    lat: 23.4123,
    lon: 85.4399,
    nirfRank: 53,
    nirfScore: 0.94,
    establishedYear: 1955,
    address: 'Mesra, Ranchi, Jharkhand 835215',
    website: 'https://www.bitmesra.ac.in',
    specializations: ['WATER_MANAGEMENT', 'HEALTHCARE_DELIVERY', 'PRIMARY_EDUCATION_DIGITAL'],
    departments: [
      { name: 'Department of Remote Sensing & Geoinformatics', focus: ['Hydrological Watershed Mapping', 'Aquifer Depletion Telemetry'], activeCapacity: 9 }
    ]
  },
  {
    id: 'hei_niamt_04',
    code: 'NIAMT-RNC',
    name: 'National Institute of Advanced Manufacturing Technology, Ranchi',
    type: 'Central/National',
    district: 'Ranchi',
    districtId: 'ranchi',
    lat: 23.3101,
    lon: 85.3134,
    nirfRank: 120,
    nirfScore: 0.86,
    establishedYear: 1966,
    address: 'Near Khunti Road, Hatia, Ranchi, Jharkhand 834003',
    website: 'https://www.niamt.ac.in',
    specializations: ['ROAD_INFRASTRUCTURE', 'RURAL_ELECTRIFICATION_SOLAR', 'SUSTAINABLE_AGRICULTURE'],
    departments: [
      { name: 'Department of Manufacturing & Materials Engineering', focus: ['Corrosion-Resistant Handpump Valves', 'Solar Structure Fabrication'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_iiitranchi_05',
    code: 'IIITRNC',
    name: 'Indian Institute of Information Technology Ranchi',
    type: 'Central/National',
    district: 'Ranchi',
    districtId: 'ranchi',
    lat: 23.3441,
    lon: 85.3850,
    nirfRank: 175,
    nirfScore: 0.84,
    establishedYear: 2016,
    address: 'ARTTC BSNL Campus, Namkum, Ranchi, Jharkhand 834010',
    website: 'https://www.iiitranchi.ac.in',
    specializations: ['PRIMARY_EDUCATION_DIGITAL', 'HEALTHCARE_DELIVERY', 'RURAL_ELECTRIFICATION_SOLAR'],
    departments: [
      { name: 'Department of Computer Science & AI', focus: ['Multilingual Tribal EdTech Platforms', 'Rural Health Tele-Consultation'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_bitsindri_06',
    code: 'BITSINDRI',
    name: 'Birsa Institute of Technology, Sindri',
    type: 'State Government',
    district: 'Dhanbad',
    districtId: 'dhanbad',
    lat: 23.6534,
    lon: 86.4704,
    nirfRank: 201,
    nirfScore: 0.82,
    establishedYear: 1949,
    address: 'PO Sindri Institute, Dhanbad, Jharkhand 828123',
    website: 'https://www.bitsindri.ac.in',
    specializations: ['ROAD_INFRASTRUCTURE', 'WATER_MANAGEMENT', 'SANITATION_WASTE'],
    departments: [
      { name: 'Department of Civil Engineering', focus: ['Rural PWD Road Audits', 'Masonry Culvert Retrofitting'], activeCapacity: 9 }
    ]
  },
  {
    id: 'hei_ucet_07',
    code: 'UCET-VBU',
    name: 'University College of Engineering and Technology, VBU',
    type: 'State Government',
    district: 'Hazaribagh',
    districtId: 'hazaribagh',
    lat: 23.9937,
    lon: 85.3611,
    nirfScore: 0.78,
    establishedYear: 2009,
    address: 'VBU Campus, Hazaribagh, Jharkhand 825301',
    website: 'https://www.vbu.ac.in',
    specializations: ['ROAD_INFRASTRUCTURE', 'WATER_MANAGEMENT', 'RURAL_ELECTRIFICATION_SOLAR'],
    departments: [
      { name: 'Department of Civil & Rural Infrastructure', focus: ['Village Connectivity Roads', 'Community Handpump Remediation'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_kuengg_08',
    code: 'KU-ENGG',
    name: 'Faculty of Engineering, Kolhan University',
    type: 'State Government',
    district: 'West Singhbhum',
    districtId: 'west-singhbhum',
    lat: 22.5487,
    lon: 85.8118,
    nirfScore: 0.78,
    establishedYear: 2009,
    address: 'NH 75, Chaibasa, West Singhbhum, Jharkhand 833202',
    website: 'https://www.kolhanuniversity.ac.in',
    specializations: ['ROAD_INFRASTRUCTURE', 'WATER_MANAGEMENT', 'SUSTAINABLE_AGRICULTURE'],
    departments: [
      { name: 'Department of Civil & Environmental Engineering', focus: ['Forest Road Stabilization', 'Check Dams & Watersheds'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_cec_09',
    code: 'CEC-CHAIBASA',
    name: 'Chaibasa Engineering College',
    type: 'Government-PPP',
    district: 'West Singhbhum',
    districtId: 'west-singhbhum',
    lat: 22.4561,
    lon: 85.7335,
    nirfScore: 0.78,
    establishedYear: 2013,
    address: 'Bistumpur, PO Jhinkpani, Chaibasa, Jharkhand 833215',
    website: 'https://www.chaibasaengg.edu.in',
    specializations: ['ROAD_INFRASTRUCTURE', 'RURAL_ELECTRIFICATION_SOLAR', 'WATER_MANAGEMENT'],
    departments: [
      { name: 'Department of Electrical & Solar Systems', focus: ['Off-Grid Solar Microgrids', 'Rural Transformer Earthing'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_rec_10',
    code: 'REC-RAMGARH',
    name: 'Ramgarh Engineering College',
    type: 'Government-PPP',
    district: 'Ramgarh',
    districtId: 'ramgarh',
    lat: 23.6180,
    lon: 85.5901,
    nirfScore: 0.78,
    establishedYear: 2013,
    address: 'Murubanda, PO Barkipona, Ramgarh, Jharkhand 825101',
    website: 'https://www.ramgarhengineeringcollege.org',
    specializations: ['ROAD_INFRASTRUCTURE', 'WATER_MANAGEMENT', 'SANITATION_WASTE'],
    departments: [
      { name: 'Department of Civil Engineering', focus: ['Bridge & Culvert Diagnostics', 'Flyash Road Utilization'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_dec_11',
    code: 'DEC-DUMKA',
    name: 'Dumka Engineering College',
    type: 'Government-PPP',
    district: 'Dumka',
    districtId: 'dumka',
    lat: 24.2831,
    lon: 87.2435,
    nirfScore: 0.78,
    establishedYear: 2013,
    address: 'Near S.P. College Ground, Dumka, Jharkhand 814101',
    website: 'https://www.dumkaengg.edu.in',
    specializations: ['WATER_MANAGEMENT', 'ROAD_INFRASTRUCTURE', 'RURAL_ELECTRIFICATION_SOLAR', 'SUSTAINABLE_AGRICULTURE'],
    departments: [
      { name: 'Department of Civil & Rural Infrastructure', focus: ['Santhal Pargana Watersheds', 'Village Roads'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_gpsilli_12',
    code: 'GP-SILLI',
    name: 'Government Polytechnic Silli',
    type: 'Government-PPP',
    district: 'Ranchi',
    districtId: 'ranchi',
    lat: 23.3468,
    lon: 85.8504,
    nirfScore: 0.72,
    establishedYear: 2013,
    address: 'Tuti Silli, Silli, Ranchi, Jharkhand 835102',
    website: 'http://www.sillipolytechnic.ac.in',
    specializations: ['WATER_MANAGEMENT', 'ROAD_INFRASTRUCTURE', 'RURAL_ELECTRIFICATION_SOLAR'],
    departments: [
      { name: 'Department of Mechanical & Electrical Maintenance', focus: ['Rural Solar Pumps', 'Handpump Repair'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_gppakur_13',
    code: 'GP-PAKUR',
    name: 'Government Polytechnic Pakur',
    type: 'Government-PPP',
    district: 'Pakur',
    districtId: 'pakur',
    lat: 24.6360,
    lon: 87.8480,
    nirfScore: 0.72,
    establishedYear: 2013,
    address: 'Sweet City, Baghabari, Pakur, Jharkhand 816107',
    website: 'https://www.pakurpolytechnic.ac.in',
    specializations: ['WATER_MANAGEMENT', 'ROAD_INFRASTRUCTURE', 'SUSTAINABLE_AGRICULTURE'],
    departments: [
      { name: 'Department of Civil & Rural Technology', focus: ['Arsenic Water Testing', 'Pothole Cold-Mix Repair'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_gpchandil_14',
    code: 'GP-CHANDIL',
    name: 'Government Polytechnic Chandil',
    type: 'Government-PPP',
    district: 'Seraikela Kharsawan',
    districtId: 'seraikela-kharsawan',
    lat: 22.9555,
    lon: 86.0465,
    nirfScore: 0.72,
    establishedYear: 2017,
    address: 'Gaurangdih, Chandil, Seraikela Kharsawan, Jharkhand 832401',
    website: 'https://www.chandilpolytechnic.ac.in',
    specializations: ['WATER_MANAGEMENT', 'RURAL_ELECTRIFICATION_SOLAR', 'SANITATION_WASTE'],
    departments: [
      { name: 'Department of Electrical & Water Works', focus: ['Chandil Dam Water Testing', 'Rural Electrification'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_gpgumla_15',
    code: 'GP-GUMLA',
    name: 'Government Polytechnic Gumla',
    type: 'Government-PPP',
    district: 'Gumla',
    districtId: 'gumla',
    lat: 23.0480,
    lon: 84.5420,
    nirfScore: 0.72,
    establishedYear: 2017,
    address: 'Chandali, Gumla, Jharkhand 835207',
    website: 'https://www.gumlapolytechnic.ac.in',
    specializations: ['SUSTAINABLE_AGRICULTURE', 'WATER_MANAGEMENT', 'ROAD_INFRASTRUCTURE'],
    departments: [
      { name: 'Department of Agricultural & Civil Technology', focus: ['Tribal Irrigation Canals', 'Rural Road Maintenance'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_gpgola_16',
    code: 'GP-GOLA',
    name: 'Government Polytechnic Gola',
    type: 'Government-PPP',
    district: 'Ramgarh',
    districtId: 'ramgarh',
    lat: 23.5350,
    lon: 85.7180,
    nirfScore: 0.72,
    establishedYear: 2017,
    address: 'Gola, Ramgarh, Jharkhand 829110',
    website: 'https://www.golapolytechnic.ac.in',
    specializations: ['ROAD_INFRASTRUCTURE', 'RURAL_ELECTRIFICATION_SOLAR'],
    departments: [
      { name: 'Department of Mechanical & Civil Works', focus: ['Culvert Drainage Inspection', 'Rural Solar Grids'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_gpadityapur_17',
    code: 'GP-ADITYAPUR',
    name: 'Government Polytechnic, Adityapur',
    type: 'State Government',
    district: 'Seraikela Kharsawan',
    districtId: 'seraikela-kharsawan',
    lat: 22.7915,
    lon: 86.1662,
    nirfScore: 0.72,
    establishedYear: 1980,
    address: 'Adityapur Industrial Area, Jamshedpur, Jharkhand 831013',
    website: 'http://gpadityapur.ac.in',
    specializations: ['RURAL_ELECTRIFICATION_SOLAR', 'WATER_MANAGEMENT', 'SANITATION_WASTE'],
    departments: [
      { name: 'Department of Metallurgical & Electrical Tech', focus: ['Industrial Water Neutralization', 'Solar Inverter Overhaul'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_gpranchi_18',
    code: 'GP-RANCHI',
    name: 'Government Polytechnic, Ranchi',
    type: 'State Government',
    district: 'Ranchi',
    districtId: 'ranchi',
    lat: 23.3654,
    lon: 85.3340,
    nirfScore: 0.72,
    establishedYear: 1935,
    address: 'Church Road, Karbala Chowk, Ranchi, Jharkhand 834001',
    website: 'http://gpranchi.ac.in',
    specializations: ['CIVIL_INFRASTRUCTURE', 'ROAD_INFRASTRUCTURE', 'WATER_MANAGEMENT'],
    departments: [
      { name: 'Department of Civil Engineering', focus: ['Municipal Drainage', 'Low Cost Pothole Patches'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_gpdhanbad_19',
    code: 'GP-DHANBAD',
    name: 'Government Polytechnic, Dhanbad',
    type: 'State Government',
    district: 'Dhanbad',
    districtId: 'dhanbad',
    lat: 23.8052,
    lon: 86.4385,
    nirfScore: 0.72,
    establishedYear: 1958,
    address: 'Polytechnic Road, Dhanbad, Jharkhand 828104',
    website: 'http://gpdhanbad.ac.in',
    specializations: ['WATER_MANAGEMENT', 'ROAD_INFRASTRUCTURE', 'SANITATION_WASTE'],
    departments: [
      { name: 'Department of Civil Technology', focus: ['Piped Water Restoration', 'Roadway Drainage'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_gpnirsa_20',
    code: 'GP-NIRSA',
    name: 'Government Polytechnic, Nirsa',
    type: 'State Government',
    district: 'Dhanbad',
    districtId: 'dhanbad',
    lat: 23.7845,
    lon: 86.7110,
    nirfScore: 0.72,
    establishedYear: 2017,
    address: 'Nirsa, Dhanbad, Jharkhand 828205',
    website: 'http://gpnirsa.ac.in',
    specializations: ['RURAL_ELECTRIFICATION_SOLAR', 'WATER_MANAGEMENT'],
    departments: [
      { name: 'Department of Electrical & Mining Technology', focus: ['Rural Solar Streetlights', 'Groundwater Testing'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_gpbhaga_21',
    code: 'GP-BHAGA',
    name: 'Government Polytechnic, Bhaga (Mining Institute)',
    type: 'State Government',
    district: 'Dhanbad',
    districtId: 'dhanbad',
    lat: 23.7310,
    lon: 86.4420,
    nirfScore: 0.72,
    establishedYear: 1905,
    address: 'Bhaga, Dhanbad, Jharkhand 828301',
    website: 'http://gpbhaga.ac.in',
    specializations: ['WATER_MANAGEMENT', 'SANITATION_WASTE', 'FORESTRY_ENVIRONMENT'],
    departments: [
      { name: 'Department of Mining Environmental Engineering', focus: ['Mine Water Recycling', 'Acid Drainage Triage'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_gpkharsawan_22',
    code: 'GP-KHARSAWAN',
    name: 'Government Polytechnic, Kharsawan',
    type: 'State Government',
    district: 'Seraikela Kharsawan',
    districtId: 'seraikela-kharsawan',
    lat: 22.7940,
    lon: 85.8260,
    nirfScore: 0.72,
    establishedYear: 2006,
    address: 'Kharsawan, Seraikela Kharsawan, Jharkhand 833220',
    website: 'http://gpkharsawan.ac.in',
    specializations: ['WATER_MANAGEMENT', 'SUSTAINABLE_AGRICULTURE'],
    departments: [
      { name: 'Department of Rural Technology', focus: ['Tribal Water Conservation', 'Minor Irrigation'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_gpdumka_23',
    code: 'GP-DUMKA',
    name: 'Government Polytechnic, Dumka',
    type: 'State Government',
    district: 'Dumka',
    districtId: 'dumka',
    lat: 24.2690,
    lon: 87.2510,
    nirfScore: 0.72,
    establishedYear: 1958,
    address: 'Kurwa, Dumka, Jharkhand 814101',
    website: 'http://gpdumka.ac.in',
    specializations: ['WATER_MANAGEMENT', 'ROAD_INFRASTRUCTURE'],
    departments: [
      { name: 'Department of Civil Engineering', focus: ['Handpump Mechanics', 'Road Culvert Rebuilding'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_gplatehar_24',
    code: 'GP-LATEHAR',
    name: 'Government Polytechnic, Latehar',
    type: 'State Government',
    district: 'Latehar',
    districtId: 'latehar',
    lat: 23.7430,
    lon: 84.4980,
    nirfScore: 0.72,
    establishedYear: 2006,
    address: 'By-Pass Road, Latehar, Jharkhand 829206',
    website: 'http://gplatehar.ac.in',
    specializations: ['ROAD_INFRASTRUCTURE', 'RURAL_ELECTRIFICATION_SOLAR', 'HEALTHCARE_DELIVERY'],
    departments: [
      { name: 'Department of Civil & Mechanical Technology', focus: ['Hill Road Stabilisation', 'Rural Solar Infrastructure'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_gpkoderma_25',
    code: 'GP-KODERMA',
    name: 'Government Polytechnic, Koderma',
    type: 'State Government',
    district: 'Koderma',
    districtId: 'koderma',
    lat: 24.4350,
    lon: 85.5290,
    nirfScore: 0.72,
    establishedYear: 1958,
    address: 'Jhumri Telaiya, Koderma, Jharkhand 825409',
    website: 'http://gpkoderma.ac.in',
    specializations: ['WATER_MANAGEMENT', 'ROAD_INFRASTRUCTURE', 'SANITATION_WASTE'],
    departments: [
      { name: 'Department of Civil Technology', focus: ['Mica Zone Drinking Water Filtration', 'Pothole Repair'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_gpkhunti_26',
    code: 'GP-KHUNTI',
    name: 'Government Polytechnic, Khunti',
    type: 'State Government',
    district: 'Khunti',
    districtId: 'khunti',
    lat: 23.0780,
    lon: 85.2760,
    nirfScore: 0.72,
    establishedYear: 2017,
    address: 'Khunti, Jharkhand 835210',
    website: 'http://gpkhunti.ac.in',
    specializations: ['SUSTAINABLE_AGRICULTURE', 'RURAL_ELECTRIFICATION_SOLAR'],
    departments: [
      { name: 'Department of Agricultural & Solar Technology', focus: ['Lac Cultivation Tools', 'Solar Water Pumping'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_gpsimdega_27',
    code: 'GP-SIMDEGA',
    name: 'Government Polytechnic, Simdega',
    type: 'State Government',
    district: 'Simdega',
    districtId: 'simdega',
    lat: 22.6160,
    lon: 84.5050,
    nirfScore: 0.72,
    establishedYear: 2017,
    address: 'Simdega, Jharkhand 835223',
    website: 'http://gpsimdega.ac.in',
    specializations: ['WATER_MANAGEMENT', 'HEALTHCARE_DELIVERY', 'SANITATION_WASTE'],
    departments: [
      { name: 'Department of Community Engineering', focus: ['Clean Drinking Water Filters', 'Sanitation Facilities'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_gpsahibganj_28',
    code: 'GP-SAHIBGANJ',
    name: 'Government Polytechnic, Sahibganj',
    type: 'State Government',
    district: 'Sahibganj',
    districtId: 'sahibganj',
    lat: 25.2420,
    lon: 87.6430,
    nirfScore: 0.72,
    establishedYear: 2017,
    address: 'Sahibganj, Jharkhand 816109',
    website: 'http://gpsahibganj.ac.in',
    specializations: ['WATER_MANAGEMENT', 'ROAD_INFRASTRUCTURE'],
    departments: [
      { name: 'Department of River & Infrastructure Works', focus: ['Ganga Basin Flood Management', 'Culvert Retrofitting'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_gpgarhwa_29',
    code: 'GP-GARHWA',
    name: 'Government Polytechnic, Garhwa',
    type: 'State Government',
    district: 'Garhwa',
    districtId: 'garhwa',
    lat: 24.1610,
    lon: 83.8090,
    nirfScore: 0.72,
    establishedYear: 2017,
    address: 'Garhwa, Jharkhand 822114',
    website: 'http://gpgarhwa.ac.in',
    specializations: ['SANITATION_WASTE', 'WATER_MANAGEMENT', 'ROAD_INFRASTRUCTURE'],
    departments: [
      { name: 'Department of Civil & Mechanical Technology', focus: ['Handpump Mechanical Overhaul', 'Rural Drainage Channels'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_gpbokaro_30',
    code: 'GP-BOKARO',
    name: 'Government Polytechnic, Jainamore, Bokaro',
    type: 'State Government',
    district: 'Bokaro',
    districtId: 'bokaro',
    lat: 23.6330,
    lon: 85.9920,
    nirfScore: 0.72,
    establishedYear: 2017,
    address: 'Jainamore, Bokaro, Jharkhand 829301',
    website: 'http://gpbokaro.ac.in',
    specializations: ['RURAL_ELECTRIFICATION_SOLAR', 'ROAD_INFRASTRUCTURE'],
    departments: [
      { name: 'Department of Electrical & Civil Technology', focus: ['Off-Grid Solar Panels', 'Village Road Resurfacing'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_gwpranchi_31',
    code: 'GWP-RANCHI',
    name: "Government Women's Polytechnic, Ranchi",
    type: 'State Government',
    district: 'Ranchi',
    districtId: 'ranchi',
    lat: 23.3712,
    lon: 85.3305,
    nirfScore: 0.72,
    establishedYear: 1974,
    address: 'Tharpakhna, Ranchi, Jharkhand 834001',
    website: 'http://gwpranchi.ac.in',
    specializations: ['PRIMARY_EDUCATION_DIGITAL', 'HEALTHCARE_DELIVERY'],
    departments: [
      { name: 'Department of Applied Electronics & Community Welfare', focus: ['Rural Digital Literacy', 'Health Diagnostics'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_gwpjamshedpur_32',
    code: 'GWP-JAMSHEDPUR',
    name: "Government Women's Polytechnic, Jamshedpur",
    type: 'State Government',
    district: 'East Singhbhum',
    districtId: 'east-singhbhum',
    lat: 22.7925,
    lon: 86.1265,
    nirfScore: 0.72,
    establishedYear: 1987,
    address: 'Gamharia, Jamshedpur, Jharkhand 832108',
    website: 'http://gwpjamshedpur.ac.in',
    specializations: ['PRIMARY_EDUCATION_DIGITAL', 'RURAL_ELECTRIFICATION_SOLAR'],
    departments: [
      { name: 'Department of Electronics & Communication', focus: ['Community Tele-Education', 'Solar Inverter Circuits'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_gwpbokaro_33',
    code: 'GWP-BOKARO',
    name: "Government Women's Polytechnic, Bokaro",
    type: 'State Government',
    district: 'Bokaro',
    districtId: 'bokaro',
    lat: 23.6660,
    lon: 86.1520,
    nirfScore: 0.72,
    establishedYear: 1987,
    address: 'Sector 8, Bokaro Steel City, Jharkhand 827009',
    website: 'http://gwpbokaro.ac.in',
    specializations: ['WATER_MANAGEMENT', 'HEALTHCARE_DELIVERY'],
    departments: [
      { name: 'Department of Environmental Sanitation', focus: ['Community Water Testing', 'Hygiene Programs'], activeCapacity: 8 }
    ]
  },
  {
    id: 'hei_gwpdumka_34',
    code: 'GWP-DUMKA',
    name: "Government Women's Polytechnic, Dumka",
    type: 'State Government',
    district: 'Dumka',
    districtId: 'dumka',
    lat: 24.2650,
    lon: 87.2480,
    nirfScore: 0.72,
    establishedYear: 2014,
    address: 'Dumka, Jharkhand 814101',
    website: 'http://gwpdumka.ac.in',
    specializations: ['PRIMARY_EDUCATION_DIGITAL', 'WATER_MANAGEMENT'],
    departments: [
      { name: 'Department of Community Digital Literacy', focus: ['Santhali Language Digital Tools', 'Water Safety'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_alkabir_35',
    code: 'AL-KABIR',
    name: 'Al-Kabir Polytechnic',
    type: 'Private',
    district: 'East Singhbhum',
    districtId: 'east-singhbhum',
    lat: 22.8250,
    lon: 86.2080,
    nirfScore: 0.70,
    establishedYear: 1990,
    address: 'Kabir Nagar, Mango, Jamshedpur, Jharkhand 831012',
    website: 'https://www.alkabir.in',
    specializations: ['ROAD_INFRASTRUCTURE', 'RURAL_ELECTRIFICATION_SOLAR'],
    departments: [
      { name: 'Department of Electrical & Civil Works', focus: ['Streetlight Maintenance', 'Masonry Culverts'], activeCapacity: 7 }
    ]
  },
  {
    id: 'hei_citranchi_36',
    code: 'CIT-RANCHI',
    name: 'Cambridge Institute of Technology, Ranchi',
    type: 'Private',
    district: 'Ranchi',
    districtId: 'ranchi',
    lat: 23.3590,
    lon: 85.4520,
    nirfScore: 0.70,
    establishedYear: 2001,
    address: 'Cambridge Village, Tatisilwai, Ranchi, Jharkhand 835103',
    website: 'https://www.citranchi.ac.in',
    specializations: ['ROAD_INFRASTRUCTURE', 'PRIMARY_EDUCATION_DIGITAL'],
    departments: [
      { name: 'Department of Civil Engineering', focus: ['Rural Bridge Inspections', 'Low Cost Road Materials'], activeCapacity: 6 }
    ]
  },
  {
    id: 'hei_rvscet_37',
    code: 'RVSCET-JSR',
    name: 'RVS College of Engineering & Technology',
    type: 'Private',
    district: 'East Singhbhum',
    districtId: 'east-singhbhum',
    lat: 22.8420,
    lon: 86.2650,
    nirfScore: 0.70,
    establishedYear: 2002,
    address: 'Edalbera, PO Bhilaipahari, Jamshedpur, Jharkhand 831012',
    website: 'https://www.rvscet.com',
    specializations: ['WATER_MANAGEMENT', 'RURAL_ELECTRIFICATION_SOLAR'],
    departments: [
      { name: 'Department of Electrical & Electronics', focus: ['Solar Pump Controls', 'Grid Voltage Stabilizers'], activeCapacity: 6 }
    ]
  },
  {
    id: 'hei_rtcit_38',
    code: 'RTCIT-RNC',
    name: 'RTC Institute of Technology',
    type: 'Private',
    district: 'Ranchi',
    districtId: 'ranchi',
    lat: 23.4730,
    lon: 85.4920,
    nirfScore: 0.70,
    establishedYear: 2008,
    address: 'Anandi, Ormanjhi, Ranchi, Jharkhand 835219',
    website: 'https://www.rtcit.ac.in',
    specializations: ['ROAD_INFRASTRUCTURE', 'SUSTAINABLE_AGRICULTURE'],
    departments: [
      { name: 'Department of Mechanical & Civil Engineering', focus: ['Rural Connectivity', 'Agri Machinery Servicing'], activeCapacity: 6 }
    ]
  },
  {
    id: 'hei_kkcem_39',
    code: 'KKCEM-DHN',
    name: 'KK College of Engineering and Management',
    type: 'Private',
    district: 'Dhanbad',
    districtId: 'dhanbad',
    lat: 23.7780,
    lon: 86.7230,
    nirfScore: 0.70,
    establishedYear: 2010,
    address: 'Naya Nirsa, PO Bagsumi, Dhanbad, Jharkhand 828205',
    website: 'http://www.kkbecon.org',
    specializations: ['WATER_MANAGEMENT', 'ROAD_INFRASTRUCTURE'],
    departments: [
      { name: 'Department of Civil Engineering', focus: ['Rural Pothole Patching', 'Handpump Repair'], activeCapacity: 6 }
    ]
  },
  {
    id: 'hei_ggsestc_40',
    code: 'GGSESTC-BOK',
    name: "Guru Gobind Singh Educational Society's Technical Campus",
    type: 'Private',
    district: 'Bokaro',
    districtId: 'bokaro',
    lat: 23.6320,
    lon: 86.0820,
    nirfScore: 0.70,
    establishedYear: 2011,
    address: 'Kandra, Chas, Bokaro, Jharkhand 827013',
    website: 'https://www.ggsestc.ac.in',
    specializations: ['RURAL_ELECTRIFICATION_SOLAR', 'ROAD_INFRASTRUCTURE'],
    departments: [
      { name: 'Department of Electrical Engineering', focus: ['Solar Lighting Systems', 'Submersible Motors'], activeCapacity: 6 }
    ]
  },
  {
    id: 'hei_arkajain_41',
    code: 'AJU-ENGG',
    name: 'School of Engineering & IT, Arka Jain University',
    type: 'Private',
    district: 'Seraikela Kharsawan',
    districtId: 'seraikela-kharsawan',
    lat: 22.7905,
    lon: 86.1210,
    nirfScore: 0.70,
    establishedYear: 2017,
    address: 'Opp. Kerala Public School, Mohanpur, Gamharia, Jamshedpur 832108',
    website: 'https://www.arkajainuniversity.ac.in',
    specializations: ['PRIMARY_EDUCATION_DIGITAL', 'HEALTHCARE_DELIVERY'],
    departments: [
      { name: 'Department of Computer Science & Engineering', focus: ['Health Mobile Apps', 'Digital Village Hubs'], activeCapacity: 6 }
    ]
  },
  {
    id: 'hei_ushamartin_42',
    code: 'UMU-ENGG',
    name: 'Faculty of Engineering and Applied Sciences, Usha Martin University',
    type: 'Private',
    district: 'Ranchi',
    districtId: 'ranchi',
    lat: 23.3610,
    lon: 85.4560,
    nirfScore: 0.70,
    establishedYear: 2012,
    address: 'At Village Narayansoli, PO Tatisailei, Angara, Ranchi 835103',
    website: 'https://www.ushamartinuniversity.com',
    specializations: ['SUSTAINABLE_AGRICULTURE', 'WATER_MANAGEMENT'],
    departments: [
      { name: 'Department of Agricultural & Environmental Sciences', focus: ['Drip Irrigation Models', 'Soil Testing Telemetry'], activeCapacity: 6 }
    ]
  },
  {
    id: 'hei_mitm_43',
    code: 'MITM-JSR',
    name: 'Maryland Institute of Technology and Management',
    type: 'Private',
    district: 'East Singhbhum',
    districtId: 'east-singhbhum',
    lat: 22.6840,
    lon: 86.4180,
    nirfScore: 0.70,
    establishedYear: 2011,
    address: 'NH 33, Galudih, Ghatshila, East Singhbhum, Jharkhand 832304',
    website: 'http://mitmjamshedpur.ac.in',
    specializations: ['ROAD_INFRASTRUCTURE', 'WATER_MANAGEMENT'],
    departments: [
      { name: 'Department of Civil Engineering', focus: ['Highway Edge Protection', 'Rural Wells'], activeCapacity: 6 }
    ]
  },
  {
    id: 'hei_bacet_44',
    code: 'BACET-JSR',
    name: 'B.A. College of Engineering & Technology',
    type: 'Private',
    district: 'East Singhbhum',
    districtId: 'east-singhbhum',
    lat: 22.6780,
    lon: 86.4110,
    nirfScore: 0.70,
    establishedYear: 2007,
    address: 'Ghutia, PO Mahulia, Jamshedpur, Jharkhand 832304',
    website: 'http://bacet.ac.in',
    specializations: ['RURAL_ELECTRIFICATION_SOLAR', 'ROAD_INFRASTRUCTURE'],
    departments: [
      { name: 'Department of Electrical & Civil Engineering', focus: ['Rural Electrification Audits', 'Culvert Strengthening'], activeCapacity: 6 }
    ]
  }
];

function haversineDistKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371.0;
  const dlat = ((lat2 - lat1) * Math.PI) / 180.0;
  const dlon = ((lon2 - lon1) * Math.PI) / 180.0;
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180.0) * Math.cos((lat2 * Math.PI) / 180.0) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Fast client-side multi-criteria optimal HEI recommender matching Python router logic
 */
export function findOptimalHeiForTicket(
  lat: number,
  lon: number,
  category: string,
  district: string = ''
): {
  winner: HeiData & { distanceKm: number; utilityScore: number };
  ranked: Array<HeiData & { distanceKm: number; utilityScore: number }>;
} {
  const reqDist = district.toLowerCase().replace(/-/g, ' ').trim();

  const scored = JHARKHAND_HEIS_44.map((hei) => {
    const distKm = haversineDistKm(lat, lon, hei.lat, hei.lon);
    const sProx = Math.max(0.0, 1.0 - distKm / 220.0);
    const sDomain = hei.specializations.includes(category) ? 1.0 : 0.3;

    const heiDist = hei.district.toLowerCase().trim();
    const sDistrict = (reqDist && (reqDist.includes(heiDist) || heiDist.includes(reqDist))) ? 1.0 : 0.0;
    const sNirf = hei.nirfScore;

    const utility = 0.35 * sProx + 0.30 * sDomain + 0.20 * sDistrict + 0.15 * sNirf;

    return {
      ...hei,
      distanceKm: Math.round(distKm * 10) / 10,
      utilityScore: Math.round(utility * 1000) / 1000,
    };
  });

  scored.sort((a, b) => b.utilityScore - a.utilityScore);

  return {
    winner: scored[0],
    ranked: scored.slice(0, 5),
  };
}

export function getHeiById(id: string): HeiData | undefined {
  return JHARKHAND_HEIS_44.find((h) => h.id === id || h.code === id);
}

export function getHeisInDistrict(district: string): HeiData[] {
  const norm = district.toLowerCase().replace(/-/g, ' ').trim();
  return JHARKHAND_HEIS_44.filter(
    (h) => h.district.toLowerCase().includes(norm) || norm.includes(h.district.toLowerCase())
  );
}
