export type LanguageCode = 'en' | 'hi' | 'sat' | 'mun';

export interface Translations {
  // Navigation & General
  brandSub: string;
  auditLedger: string;
  signIn: string;
  register: string;
  logout: string;
  profileTitle: string;
  role: string;
  district: string;
  phone: string;
  email: string;
  myPortal: string;
  onlineStatus: string;
  close: string;
  cancel: string;
  save: string;

  // Landing Page
  sihBadge: string;
  landingHeroTitle1: string;
  landingHeroTitleGradient: string;
  landingHeroDesc: string;
  btnReportProblem: string;
  btnSignInPortal: string;
  metricDistricts: string;
  metricDistrictsLabel: string;
  metricHeis: string;
  metricHeisLabel: string;
  metricCsrPledged: string;
  metricCsrLabel: string;
  metricResolved: string;
  metricResolvedLabel: string;
  featuresHeading: string;
  featuresSub: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;
  howItWorksHeading: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  footerRights: string;

  // Citizen Portal Hero
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;

  // Problem Submission Form
  formHeading: string;
  formBadge: string;
  formSubtitle: string;
  gpsAcquiring: string;
  gpsCoordinates: string;
  refineOnMap: string;
  successTitle: string;
  successSubtitle: string;

  // Voice Section & Speech to Text
  micTapToSpeak: string;
  micRecording: string;
  micSubtitleIdle: string;
  micSubtitleListening: string;
  speechSupportedTip: string;
  speechListeningAlert: string;

  // Image Upload & Camera Evidence
  photoSectionTitle: string;
  photoSectionSubtitle: string;
  btnChooseFile: string;
  btnLaunchCamera: string;
  btnUploadCustom: string;
  dragDropText: string;
  selectedEvidenceCount: string;
  removeImage: string;
  addMorePhotos: string;

  // Form Fields
  ticketCodeLabel: string;
  problemTitle: string;
  problemTitlePlaceholder: string;
  problemDesc: string;
  problemDescPlaceholder: string;
  thematicCategory: string;
  urgencyLevel: string;
  jharkhandDistrict: string;
  villageWard: string;
  villagePlaceholder: string;
  reporterName: string;
  reporterPhone: string;
  submitButton: string;
  submittingButton: string;

  // Categories
  catWater: string;
  catSolar: string;
  catRoad: string;
  catAgri: string;
  catHealth: string;
  catSanitation: string;
  catEducation: string;

  // Urgency
  urgCritical: string;
  urgHigh: string;
  urgMedium: string;
  urgLow: string;

  // CV & AI Cards
  cvTitle: string;
  cvSubtitle: string;
  modelActive: string;
  sampleWater: string;
  sampleRoad: string;
  sampleSolar: string;
  verifiedLabels: string;
  inferencingCV: string;

  // Matchmaking
  agentRoutingTitle: string;
  scoreLabel: string;
  targetDestination: string;
  routingCriteria: string;
  deptLabel: string;
  deptValue: string;
  nepCreditsLabel: string;
  nepCreditsValue: string;
  csrGrantLabel: string;
  csrGrantValue: string;

  // Tracker Section
  trackerTitle: string;
  trackerSubtitle: string;
  searchPlaceholder: string;
  filterAll: string;
  filterWater: string;
  filterRoad: string;
  filterSolar: string;
  filterAgri: string;
  kmAway: string;
  teamLabel: string;
  statusReceived: string;
  statusWorking: string;
  statusFixed: string;

  // Govt Admin GIS Portal
  govtCommandTitle: string;
  govtCommandSub: string;
  gisMapTitle: string;
  gisMapSub: string;
  filterCategory: string;
  filterUrgency: string;
  filterDistrict: string;
  filterStatus: string;
  statTotalComplaints: string;
  statResolvedProjects: string;
  statActiveTeams: string;
  statRoutingAccuracy: string;
  statCsrCapital: string;
  districtMatrixTitle: string;
  districtMatrixSub: string;
  mappedHubs: string;

  // HEI Portal
  heiWorkspaceTitle: string;
  heiWorkspaceSub: string;
  btnAcceptTicket: string;
  btnUploadProof: string;
  btnConferCertificate: string;
  milestoneTitle: string;
  studentTeamTitle: string;

  // CSR Portal
  csrMarketTitle: string;
  csrMarketSub: string;
  btnPledgeGrant: string;
  pledgedAmountLabel: string;
  disbursedLabel: string;

  // Location Modal
  locModalTitle: string;
  locModalSub: string;
  locSearchPlaceholder: string;
  locManualLat: string;
  locManualLng: string;
  locUseCurrentGps: string;
  locConfirmBtn: string;
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    brandSub: 'Dept of Higher & Technical Education, Govt of Jharkhand',
    auditLedger: 'Public Records',
    signIn: 'Sign In',
    register: 'Register',
    logout: 'Log Out',
    profileTitle: 'Your Profile',
    role: 'Role',
    district: 'District',
    phone: 'Phone',
    email: 'Email',
    myPortal: 'Open Portal',
    onlineStatus: 'Online • Ready',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',

    sihBadge: 'Smart India Hackathon 2026',
    landingHeroTitle1: 'Solve Village Problems with',
    landingHeroTitleGradient: "Jharkhand's Top Colleges",
    landingHeroDesc:
      'Report water, light, road, or farming problems. College students and professors will build real solutions for your village.',
    btnReportProblem: 'Report a Problem',
    btnSignInPortal: 'Sign In to Portal',
    metricDistricts: '24',
    metricDistrictsLabel: 'Districts Connected',
    metricHeis: '28+',
    metricHeisLabel: 'Colleges & Labs',
    metricCsrPledged: '₹2.85 Cr',
    metricCsrLabel: 'Fund Help Promised',
    metricResolved: '940+',
    metricResolvedLabel: 'Problems Solved',
    featuresHeading: 'How JoharSetu Helps Every Village',
    featuresSub: 'Easy for villagers, practical for students, transparent for all.',
    pillar1Title: 'Easy Voice & Photo Reporting',
    pillar1Desc: 'Speak in Santhali, Mundari, Hindi, or English. Works even without internet.',
    pillar2Title: 'Photo & Duplicate Check',
    pillar2Desc: 'Checks photos for damage and groups matching problems together.',
    pillar3Title: 'Direct College Help',
    pillar3Desc: 'Connects your village problem to the best nearby engineering college.',
    pillar4Title: 'Clear Public Records',
    pillar4Desc: 'Every step, grant, and student work is saved openly and safely.',
    howItWorksHeading: 'How a Problem Gets Solved in 4 Steps',
    step1Title: '1. Report Problem',
    step1Desc: 'Take a photo, speak into your phone, or pick your village.',
    step2Title: '2. College Check',
    step2Desc: 'System connects your problem to the right college engineering team.',
    step3Title: '3. Students Build Solution',
    step3Desc: 'Students and professors test and build what your village needs.',
    step4Title: '4. Ready in Village',
    step4Desc: 'Solution installed in your village. Students earn college credits.',
    footerRights: 'Government of Jharkhand • Higher & Technical Education',

    heroBadge: 'JoharSetu • For Every Citizen',
    heroTitle: 'Report a Problem in Your Village or Town',
    heroSubtitle:
      'Report water, light, road, or farming problems. College students and engineers will build solutions for your village.',

    formHeading: 'Tell Us Your Problem',
    formBadge: 'Works Without Internet',
    formSubtitle: 'Type details or speak in your own language.',
    gpsAcquiring: 'Finding your location...',
    gpsCoordinates: 'Location',
    refineOnMap: 'Choose on Map',
    successTitle: 'Problem Sent to College!',
    successSubtitle: 'Students are solving this. You will get SMS updates.',

    micTapToSpeak: 'Tap Mic to Speak in Hindi / Santhali / Mundari / English',
    micRecording: 'Listening to your voice...',
    micSubtitleIdle: 'Speak clearly into your phone. We will write it down.',
    micSubtitleListening: 'Listening now... speak your problem.',
    speechSupportedTip: 'Mic is ready • Speak now',
    speechListeningAlert: 'Listening... please speak your problem',

    photoSectionTitle: 'Add a Photo',
    photoSectionSubtitle: 'Take a photo or choose one from your phone.',
    btnChooseFile: 'Choose Photo',
    btnLaunchCamera: 'Take Photo',
    btnUploadCustom: 'Check My Photo',
    dragDropText: 'Tap here to pick a photo from your phone',
    selectedEvidenceCount: 'Photos added',
    removeImage: 'Remove',
    addMorePhotos: 'Add Photo',

    ticketCodeLabel: 'Problem Code',
    problemTitle: 'Problem Name',
    problemTitlePlaceholder: 'e.g. Village handpump is broken and gives dirty red water',
    problemDesc: 'What is the problem?',
    problemDescPlaceholder: 'Describe what is broken and how many families are affected.',
    thematicCategory: 'What kind of problem is this?',
    urgencyLevel: 'How urgent is this?',
    jharkhandDistrict: 'District',
    villageWard: 'Village or Ward Name',
    villagePlaceholder: 'e.g. Baghmara, Ward 4',
    reporterName: 'Your Name',
    reporterPhone: 'Mobile Number (for SMS updates)',
    submitButton: 'Send Problem to College',
    submittingButton: 'Sending your report...',

    catWater: '💧 Water & Wells',
    catSolar: '☀️ Solar Light & Power',
    catRoad: '🛣️ Village Roads & Bridges',
    catAgri: '🌾 Farming & Crops',
    catHealth: '🏥 Village Health & Medicine',
    catSanitation: '♻️ Cleanliness & Waste',
    catEducation: '📚 School & Learning',

    urgCritical: '🔴 Urgent Help Needed (Immediate)',
    urgHigh: '🟠 High Priority (Within 2 Days)',
    urgMedium: '🟡 Normal (Within This Week)',
    urgLow: '🟢 General Request',

    cvTitle: 'Photo Check',
    cvSubtitle: 'Finds broken parts, rust, or damage in the photo',
    modelActive: 'Photo Check: Ready',
    sampleWater: 'Water Handpump',
    sampleRoad: 'Road & Culvert',
    sampleSolar: 'Solar Light',
    verifiedLabels: 'What was found:',
    inferencingCV: 'Checking photo details...',

    agentRoutingTitle: 'Best College for Your Village',
    scoreLabel: 'Best Match',
    targetDestination: 'Assigned College',
    routingCriteria:
      'Connecting your village with nearby engineering colleges that have the right lab equipment and student teams.',
    deptLabel: 'College Department:',
    deptValue: 'Water & Civil Engineering',
    nepCreditsLabel: 'Student Course Credits:',
    nepCreditsValue: '4 Credits for Village Project',
    csrGrantLabel: 'Funding Support:',
    csrGrantValue: 'Coal India / Tata Steel (Up to ₹2.5L)',

    trackerTitle: 'Check Problem Status',
    trackerSubtitle: 'See how students and colleges are solving problems across villages.',
    searchPlaceholder: 'Search by village name or code...',
    filterAll: 'All Problems',
    filterWater: 'Water',
    filterRoad: 'Roads',
    filterSolar: 'Solar Light',
    filterAgri: 'Farming',
    kmAway: 'km away',
    teamLabel: 'Student Team',
    statusReceived: 'Received & Checked',
    statusWorking: 'Students are Working',
    statusFixed: 'Fixed in Village',

    govtCommandTitle: 'Government Overview • State Map',
    govtCommandSub:
      'Monitoring across all 24 districts of Jharkhand. Tracking student solutions, funding, and village fixes.',
    gisMapTitle: 'Jharkhand Village Problem Map',
    gisMapSub: 'See all reported village problems on an interactive map.',
    filterCategory: 'Category',
    filterUrgency: 'Urgency',
    filterDistrict: 'District',
    filterStatus: 'Status',
    statTotalComplaints: 'Reported Problems',
    statResolvedProjects: 'Solved in Villages',
    statActiveTeams: 'Active Student Teams',
    statRoutingAccuracy: 'College Match Rate',
    statCsrCapital: 'Total Fund Support',
    districtMatrixTitle: 'All 24 Districts',
    districtMatrixSub: 'Choose any district to see problems and nearby colleges.',
    mappedHubs: 'Connected Colleges:',

    heiWorkspaceTitle: 'College Team Workspace',
    heiWorkspaceSub: 'Guide student teams to build solutions for villages and earn credits.',
    btnAcceptTicket: 'Accept Problem & Form Team',
    btnUploadProof: 'Upload Photo Proof of Work',
    btnConferCertificate: 'Give Completion Certificate',
    milestoneTitle: 'Project Steps',
    studentTeamTitle: 'Student Team',

    csrMarketTitle: 'Company Sponsorship',
    csrMarketSub: 'Tata Steel, Coal India, and partner companies fund student solutions for villages.',
    btnPledgeGrant: 'Sponsor this Project',
    pledgedAmountLabel: 'Promised Help',
    disbursedLabel: 'Funds Sent',

    locModalTitle: 'Choose Your Location on Map',
    locModalSub: 'Move the pin to the exact place of the problem.',
    locSearchPlaceholder: 'Search village, town, or landmark...',
    locManualLat: 'Latitude',
    locManualLng: 'Longitude',
    locUseCurrentGps: 'Use My Current Location',
    locConfirmBtn: 'Confirm Location',
  },

  hi: {
    brandSub: 'उच्च एवं तकनीकी शिक्षा विभाग, झारखंड सरकार',
    auditLedger: 'पक्का रिकॉर्ड',
    signIn: 'लॉग इन',
    register: 'पंजीकरण',
    logout: 'लॉग आउट',
    profileTitle: 'आपकी प्रोफ़ाइल',
    role: 'भूमिका',
    district: 'ज़िला',
    phone: 'फ़ोन',
    email: 'ईमेल',
    myPortal: 'पोर्टल खोलें',
    onlineStatus: 'ऑनलाइन • तैयार',
    close: 'बंद करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',

    sihBadge: 'स्मार्ट इंडिया हैकाथॉन 2026',
    landingHeroTitle1: 'गाँव की समस्याएं सुलझाएं',
    landingHeroTitleGradient: 'झारखंड के प्रमुख कॉलेजों के साथ',
    landingHeroDesc:
      'गाँव में पानी, बिजली, सड़क या फसल की समस्या दर्ज करें। बड़े इंजीनियरिंग कॉलेजों के छात्र और प्रोफ़ेसर मिलकर आपके गाँव के लिए समाधान बनाएंगे।',
    btnReportProblem: 'समस्या दर्ज करें',
    btnSignInPortal: 'पोर्टल में प्रवेश करें',
    metricDistricts: '२४',
    metricDistrictsLabel: 'ज़िले जुड़े हैं',
    metricHeis: '२८+',
    metricHeisLabel: 'कॉलेज और लैब',
    metricCsrPledged: '₹२.८५ करोड़',
    metricCsrLabel: 'मदद राशि का वादा',
    metricResolved: '९४०+',
    metricResolvedLabel: 'समस्याएं सुलझाई गईं',
    featuresHeading: 'जोहारसेतु हर गाँव की मदद कैसे करता है',
    featuresSub: 'ग्रामीणों के लिए आसान, छात्रों के लिए उपयोगी, सबके लिए पारदर्शी।',
    pillar1Title: 'बोलकर और फोटो से शिकायत',
    pillar1Desc: 'संथाली, मुंडारी, हिंदी या अंग्रेजी में बोलें। बिना इंटरनेट भी काम करेगा।',
    pillar2Title: 'फोटो की जांच',
    pillar2Desc: 'फोटो में खराबी पहचानता है और मिलती-जुलती समस्याओं को एक साथ जोड़ता है।',
    pillar3Title: 'सीधे कॉलेज से जुड़ाव',
    pillar3Desc: 'आपकी समस्या को पास के सबसे अच्छे इंजीनियरिंग कॉलेज से जोड़ता है।',
    pillar4Title: 'खुला और पक्का रिकॉर्ड',
    pillar4Desc: 'हर काम, मदद राशि और छात्र के प्रयास का पक्का रिकॉर्ड रहता है।',
    howItWorksHeading: '४ आसान चरणों में समस्या का समाधान',
    step1Title: '१. समस्या बताएं',
    step1Desc: 'फोटो लें, फोन में बोलें या अपनी जगह चुनें।',
    step2Title: '२. कॉलेज की जांच',
    step2Desc: 'सिस्टम समस्या को सही इंजीनियरिंग कॉलेज की टीम को भेजता है।',
    step3Title: '३. छात्र समाधान बनाते हैं',
    step3Desc: 'छात्र और शिक्षक मिलकर गाँव के लिए जरूरी मशीन या समाधान बनाते हैं।',
    step4Title: '४. गाँव में तैयार',
    step4Desc: 'गाँव में समाधान लग जाता है और छात्रों को कॉलेज क्रेडिट मिलते हैं।',
    footerRights: 'झारखंड सरकार • उच्च एवं तकनीकी शिक्षा विभाग',

    heroBadge: 'जन सेतु • हर नागरिक के लिए',
    heroTitle: 'अपने गाँव या कस्बे की समस्या दर्ज करें',
    heroSubtitle:
      'पानी, बिजली, सड़क या खेती से जुड़ी समस्या बताएं। कॉलेज के छात्र और इंजीनियर आपके गाँव के लिए हल बनाएंगे।',

    formHeading: 'अपनी समस्या बताएं',
    formBadge: 'बिना इंटरनेट भी काम करेगा',
    formSubtitle: 'जानकारी लिखें या अपनी भाषा में बोलकर रिकॉर्ड करें।',
    gpsAcquiring: 'आपकी जगह खोजी जा रही है...',
    gpsCoordinates: 'स्थान',
    refineOnMap: 'नक्शे पर चुनें',
    successTitle: 'समस्या कॉलेज पहुँच गई!',
    successSubtitle: 'कॉलेज के छात्र इसे ठीक कर रहे हैं। आपको SMS मिलता रहेगा।',

    micTapToSpeak: 'बोलने के लिए माइक छुएँ (हिंदी / संथाली / मुंडारी)',
    micRecording: 'आपकी आवाज़ सुनी जा रही है...',
    micSubtitleIdle: 'साफ-साफ बोलें, हम अपने आप लिख देंगे।',
    micSubtitleListening: 'माइक सुन रहा है... कृपया अपनी समस्या बताएं।',
    speechSupportedTip: 'माइक तैयार है • बोलें',
    speechListeningAlert: 'माइक चालू है... कृपया अपनी समस्या बोलें',

    photoSectionTitle: 'फोटो जोड़ें',
    photoSectionSubtitle: 'कैमरे से फोटो खींचें या फोन से चुनें।',
    btnChooseFile: 'फोटो चुनें',
    btnLaunchCamera: 'फोटो खींचें',
    btnUploadCustom: 'अपनी फोटो जांचें',
    dragDropText: 'फोन से फोटो चुनने के लिए यहाँ छुएँ',
    selectedEvidenceCount: 'फोटो जोड़ी गई',
    removeImage: 'हटाएं',
    addMorePhotos: 'और फोटो जोड़ें',

    ticketCodeLabel: 'शिकायत नंबर',
    problemTitle: 'समस्या का नाम',
    problemTitlePlaceholder: 'उदा. चापाकल खराब है और गंदा लाल पानी आ रहा है',
    problemDesc: 'समस्या क्या है?',
    problemDescPlaceholder: 'बताएं क्या टूटा या खराब है और कितने परिवारों को परेशानी हो रही है।',
    thematicCategory: 'समस्या किस प्रकार की है?',
    urgencyLevel: 'यह कितना जरूरी है?',
    jharkhandDistrict: 'ज़िला',
    villageWard: 'गाँव या टोला का नाम',
    villagePlaceholder: 'उदा. बागमारा, टोला ४',
    reporterName: 'आपका नाम',
    reporterPhone: 'मोबाइल नंबर (SMS अपडेट के लिए)',
    submitButton: 'समस्या कॉलेज को भेजें',
    submittingButton: 'आपकी रिपोर्ट भेजी जा रही है...',

    catWater: '💧 पानी और चापाकल',
    catSolar: '☀️ सौर ऊर्जा और बिजली',
    catRoad: '🛣️ गाँव की सड़क और पुलिया',
    catAgri: '🌾 खेती और फसल',
    catHealth: '🏥 गाँव का अस्पताल और दवा',
    catSanitation: '♻️ साफ-सफाई और कचरा',
    catEducation: '📚 स्कूल और पढ़ाई',

    urgCritical: '🔴 तुरंत मदद चाहिए (अति आवश्यक)',
    urgHigh: '🟠 जरूरी (२ दिन में)',
    urgMedium: '🟡 सामान्य (इस हफ्ते में)',
    urgLow: '🟢 साधारण अर्जी',

    cvTitle: 'फोटो की जांच',
    cvSubtitle: 'फोटो में टूटी चीजें, जंग या खराबी पहचानता है',
    modelActive: 'फोटो जांच: तैयार',
    sampleWater: 'चापाकल',
    sampleRoad: 'सड़क व पुलिया',
    sampleSolar: 'सोलर लाइट',
    verifiedLabels: 'फोटो में क्या दिखा:',
    inferencingCV: 'फोटो की जांच हो रही है...',

    agentRoutingTitle: 'आपके गाँव के लिए सबसे सही कॉलेज',
    scoreLabel: 'सबसे सही मेल',
    targetDestination: 'चुना गया कॉलेज',
    routingCriteria:
      'गाँव को पास के ऐसे इंजीनियरिंग कॉलेज से जोड़ रहा है जहाँ सही लैब और छात्रों की टीम मौजूद है।',
    deptLabel: 'कॉलेज विभाग:',
    deptValue: 'जल एवं सिविल इंजीनियरिंग विभाग',
    nepCreditsLabel: 'छात्रों को क्रेडिट:',
    nepCreditsValue: 'गाँव समाधान के लिए ४ क्रेडिट',
    csrGrantLabel: 'खर्च में मदद:',
    csrGrantValue: 'कोल इंडिया / टाटा स्टील (₹२.५ लाख तक)',

    trackerTitle: 'समस्या का हाल देखें',
    trackerSubtitle: 'देखें छात्र हर गाँव की समस्या कैसे सुलझा रहे हैं।',
    searchPlaceholder: 'गाँव का नाम या कोड खोजें...',
    filterAll: 'सभी समस्याएं',
    filterWater: 'पानी',
    filterRoad: 'सड़क',
    filterSolar: 'सोलर लाइट',
    filterAgri: 'खेती',
    kmAway: 'किमी दूर',
    teamLabel: 'छात्र दल',
    statusReceived: 'जांच पूरी हुई',
    statusWorking: 'छात्र काम कर रहे हैं',
    statusFixed: 'गाँव में तैयार',

    govtCommandTitle: 'सरकारी दृश्य • राज्य नक्शा',
    govtCommandSub:
      'झारखंड के सभी २४ जिलों की स्थिति। छात्र समाधान, फंड मदद और गाँव की मरम्मत की जानकारी।',
    gisMapTitle: 'झारखंड गाँव समस्या नक्शा',
    gisMapSub: 'पूरे झारखंड की समस्याएं नक्शे पर देखें।',
    filterCategory: 'श्रेणी',
    filterUrgency: 'प्राथमिकता',
    filterDistrict: 'ज़िला',
    filterStatus: 'स्थिति',
    statTotalComplaints: 'दर्ज समस्याएं',
    statResolvedProjects: 'सुलझाई गई समस्याएं',
    statActiveTeams: 'काम कर रहे छात्र दल',
    statRoutingAccuracy: 'सही कॉलेज मेल',
    statCsrCapital: 'कुल मदद राशि',
    districtMatrixTitle: 'सभी २४ ज़िले',
    districtMatrixSub: 'किसी भी ज़िले को चुनकर समस्याएं और कॉलेज देखें।',
    mappedHubs: 'जुड़े हुए कॉलेज:',

    heiWorkspaceTitle: 'कॉलेज दल कार्यक्षेत्र',
    heiWorkspaceSub: 'छात्रों को गाँव की समस्याओं के हल बनाने में मदद करें और क्रेडिट दें।',
    btnAcceptTicket: 'समस्या स्वीकार करें और टीम बनाएं',
    btnUploadProof: 'काम का फोटो सबूत अपलोड करें',
    btnConferCertificate: 'सफलता प्रमाणपत्र जारी करें',
    milestoneTitle: 'काम के चरण',
    studentTeamTitle: 'छात्र दल',

    csrMarketTitle: 'कंपनियों से मदद',
    csrMarketSub: 'टाटा स्टील, कोल इंडिया गाँव के प्रोजेक्ट्स के लिए छात्रों को खर्च देते हैं।',
    btnPledgeGrant: 'इस प्रोजेक्ट को मदद दें',
    pledgedAmountLabel: 'वादा की गई मदद',
    disbursedLabel: 'भेजी गई राशि',

    locModalTitle: 'नक्शे पर अपनी जगह चुनें',
    locModalSub: 'पिन को उस जगह ले जाएं जहाँ समस्या है।',
    locSearchPlaceholder: 'गाँव, टोला या जगह का नाम खोजें...',
    locManualLat: 'अक्षांश (Latitude)',
    locManualLng: 'देशांतर (Longitude)',
    locUseCurrentGps: 'मेरी वर्तमान जगह लें',
    locConfirmBtn: 'स्थान पक्का करें',
  },

  sat: {
    brandSub: 'ᱪᱮᱛᱟᱱ ᱟᱨ ᱴᱮᱠᱱᱤᱠᱟᱞ ᱥᱮᱪᱮᱫ ᱵᱤᱵᱷᱟᱜᱽ, ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ',
    auditLedger: 'ᱯᱟᱠᱟ ᱨᱮᱠᱳᱨᱰ',
    signIn: 'ᱞᱚᱜᱤᱱ',
    register: 'ᱨᱮᱡᱤᱥᱴᱟᱨ',
    logout: 'ᱚᱰᱚᱠᱚᱜ',
    profileTitle: 'ᱟᱢᱟᱜ ᱯᱨᱳᱯᱷᱟᱭᱤᱞ',
    role: 'ᱨᱳᱞ',
    district: 'ᱡᱤᱞᱟᱹ',
    phone: 'ᱯᱷᱳᱱ',
    email: 'ᱤᱢᱮᱞ',
    myPortal: 'ᱯᱳᱨᱴᱟᱞ ᱠᱷᱩᱞᱟᱹᱭ ᱢᱮ',
    onlineStatus: 'ᱥᱟᱹᱠᱨᱤᱭᱟᱹ • ᱛᱮᱭᱟᱨ',
    close: 'ᱵᱚᱸᱫᱚᱭ ᱢᱮ',
    cancel: 'ᱵᱟᱹᱛᱤᱞ ᱢᱮ',
    save: 'ᱥᱟᱧᱪᱟᱣ ᱢᱮ',

    sihBadge: 'ᱥᱢᱟᱨᱴ ᱤᱱᱰᱤᱭᱟ ᱦᱮᱠᱟᱛᱷᱚᱱ ᱒᱐᱒᱖',
    landingHeroTitle1: 'ᱟᱹᱛᱩ ᱨᱮᱱᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱥᱚᱞᱦᱮᱭ ᱢᱮ',
    landingHeroTitleGradient: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱢᱟᱨᱟᱝ ᱠᱚᱞᱮᱡᱽ ᱥᱟᱶ',
    landingHeroDesc:
      'ᱟᱹᱛᱩ ᱨᱮ ᱫᱟᱜ, ᱵᱤᱡᱽᱞᱤ, ᱦᱚᱨ ᱰᱟᱦᱟᱨ ᱨᱮᱱᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱨᱤᱯᱳᱨᱴ ᱢᱮ ᱾ ᱠᱚᱞᱮᱡᱽ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱟᱨ ᱢᱟᱪᱮᱛ ᱠᱚ ᱟᱢᱟᱜ ᱟᱹᱛᱩ ᱞᱟᱹᱜᱤᱫ ᱥᱚᱞᱦᱮ ᱠᱚ ᱵᱮᱱᱟᱣᱟ ᱾',
    btnReportProblem: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱞᱟᱹᱭ ᱢᱮ',
    btnSignInPortal: 'ᱯᱳᱨᱴᱟᱞ ᱞᱚᱜᱤᱱ ᱢᱮ',
    metricDistricts: '᱒᱔',
    metricDistrictsLabel: 'ᱡᱤᱞᱟᱹ ᱠᱚ ᱡᱚᱲᱟᱣ ᱟᱠᱟᱱᱟ',
    metricHeis: '᱒᱘+',
    metricHeisLabel: 'ᱠᱚᱞᱮᱡᱽ ᱟᱨ ᱞᱮᱵᱽ',
    metricCsrPledged: '₹᱒.᱘᱕ ᱠᱳᱴᱤ',
    metricCsrLabel: 'ᱜᱚᱲᱚ ᱠᱟᱹᱣᱰᱤ ᱠᱤᱨᱤᱭᱟᱹ',
    metricResolved: '᱙᱔᱐+',
    metricResolvedLabel: 'ᱥᱚᱞᱦᱮ ᱟᱠᱟᱱ ᱠᱟᱹᱢᱤ',
    featuresHeading: 'ᱡᱚᱦᱟᱨᱥᱮᱛᱩ ᱪᱮᱫ ᱞᱮᱠᱟ ᱜᱚᱲᱚᱣᱟᱭ',
    featuresSub: 'ᱟᱹᱛᱩ ᱦᱚᱲ ᱞᱟᱹᱜᱤᱫ ᱟᱞᱜᱟ, ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱵᱷᱟᱹᱞᱟᱹᱭ ᱾',
    pillar1Title: 'ᱨᱚᱲ ᱠᱟᱛᱮ ᱟᱨ ᱪᱤᱛᱟᱹᱨ ᱮᱢ ᱠᱟᱛᱮ',
    pillar1Desc: 'ᱥᱟᱱᱛᱟᱲᱤ, ᱦᱤᱱᱫᱤ, ᱢᱩᱱᱰᱟᱨᱤ ᱛᱮ ᱨᱚᱲ ᱢᱮ ᱾ ᱤᱱᱴᱟᱨᱱᱮᱴ ᱵᱟᱹᱱᱩᱜ ᱨᱮᱦᱚᱸ ᱠᱟᱹᱢᱤᱭᱟ ᱾',
    pillar2Title: 'ᱪᱤᱛᱟᱹᱨ ᱡᱟᱸᱪ',
    pillar2Desc: 'ᱪᱤᱛᱟᱹᱨ ᱨᱮ ᱵᱟᱹᱲᱤᱡ ᱧᱮᱞ ᱧᱟᱢᱟ ᱟᱨ ᱢᱤᱫ ᱞᱮᱠᱟᱱ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱡᱚᱲᱟᱣᱟ ᱾',
    pillar3Title: 'ᱥᱩᱨ ᱠᱚᱞᱮᱡᱽ ᱥᱟᱶ ᱡᱚᱲᱟᱣ',
    pillar3Desc: 'ᱟᱢᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱥᱩᱨ ᱨᱮᱱᱟᱜ ᱥᱚᱨᱮᱥ ᱤᱧᱡᱤᱱᱤᱭᱟᱹᱨᱤᱝ ᱠᱚᱞᱮᱡᱽ ᱴᱷᱮᱱ ᱠᱩᱞᱟᱭ ᱾',
    pillar4Title: 'ᱥᱟᱯᱷᱟ ᱟᱨ ᱯᱟᱠᱟ ᱨᱮᱠᱳᱨᱰ',
    pillar4Desc: 'ᱥᱟᱱᱟᱢ ᱠᱟᱹᱢᱤ ᱟᱨ ᱠᱟᱹᱣᱰᱤ ᱨᱮᱱᱟᱜ ᱥᱟᱯᱷᱟ ᱦᱤᱥᱟᱹᱵᱽ ᱛᱟᱦᱮᱸᱱᱟ ᱾',
    howItWorksHeading: '᱔ ᱫᱷᱟᱯ ᱛᱮ ᱥᱚᱞᱦᱮ',
    step1Title: '᱑. ᱮᱴᱠᱮᱴᱚᱬᱮ ᱞᱟᱹᱭ ᱢᱮ',
    step1Desc: 'ᱪᱤᱛᱟᱹᱨ ᱦᱟᱛᱟᱣ ᱢᱮ, ᱨᱚᱲ ᱢᱮ ᱵᱟᱝᱠᱷᱟᱱ ᱴᱷᱟᱶ ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱾',
    step2Title: '᱒. ᱠᱚᱞᱮᱡᱽ ᱴᱷᱮᱱ ᱥᱮᱴᱮᱨ',
    step2Desc: 'ᱥᱤᱥᱴᱚᱢ ᱥᱩᱦᱤ ᱠᱚᱞᱮᱡᱽ ᱴᱤᱢ ᱴᱷᱮᱱ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱠᱩᱞᱟᱭ ᱾',
    step3Title: '᱓. ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚᱣᱟᱜ ᱥᱚᱞᱦᱮ',
    step3Desc: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱟᱨ ᱢᱟᱪᱮᱛ ᱠᱚ ᱟᱹᱛᱩ ᱞᱟᱹᱜᱤᱫ ᱥᱚᱞᱦᱮ ᱠᱚ ᱵᱮᱱᱟᱣᱟ ᱾',
    step4Title: '᱔. ᱟᱹᱛᱩ ᱨᱮ ᱛᱮᱭᱟᱨ',
    step4Desc: 'ᱟᱹᱛᱩ ᱨᱮ ᱞᱟᱜᱟᱣ ᱮᱱᱟ ᱟᱨ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱠᱚᱞᱮᱡᱽ ᱠᱨᱮᱰᱤᱴ ᱠᱚ ᱧᱟᱢ ᱠᱮᱫᱟ ᱾',
    footerRights: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ • SIH 2026',

    heroBadge: 'ᱡᱚᱱ ᱥᱮᱛᱩ • ᱥᱟᱱᱟᱢ ᱱᱟᱜᱟᱨᱤᱠ ᱞᱟᱹᱜᱤᱫ',
    heroTitle: 'ᱟᱢᱟᱜ ᱟᱹᱛᱩ ᱨᱮᱱᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱞᱟᱹᱭ ᱢᱮ',
    heroSubtitle:
      'ᱫᱟᱜ, ᱵᱤᱡᱽᱞᱤ, ᱦᱚᱨ ᱰᱟᱦᱟᱨ ᱨᱮᱱᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱯᱷᱳᱱ ᱛᱮ ᱞᱟᱹᱭ ᱢᱮ ᱾ ᱠᱚᱞᱮᱡᱽ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱟᱨ ᱤᱧᱡᱤᱱᱤᱭᱟᱹᱨ ᱠᱚ ᱥᱚᱞᱦᱮ ᱠᱚ ᱵᱮᱱᱟᱣᱟ ᱾',

    formHeading: 'ᱟᱢᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱞᱟᱹᱭ ᱢᱮ',
    formBadge: 'ᱤᱱᱴᱟᱨᱱᱮᱴ ᱵᱟᱹᱱᱩᱜ ᱨᱮᱦᱚᱸ ᱠᱟᱹᱢᱤᱭᱟ',
    formSubtitle: 'ᱚᱞ ᱢᱮ ᱵᱟᱝᱠᱷᱟᱱ ᱟᱢᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱨᱚᱲ ᱢᱮ ᱾',
    gpsAcquiring: 'ᱴᱷᱟᱶ ᱥᱮᱸᱫᱽᱨᱟᱜ ᱠᱟᱱᱟ...',
    gpsCoordinates: 'ᱴᱷᱟᱶ',
    refineOnMap: 'ᱢᱮᱯ ᱨᱮ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
    successTitle: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱠᱚᱞᱮᱡᱽ ᱥᱮᱴᱮᱨ ᱮᱱᱟ!',
    successSubtitle: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱱᱚᱣᱟ ᱠᱚ ᱵᱮᱱᱟᱣ ᱠᱟᱱᱟ ᱾ SMS ᱧᱟᱢᱚᱜᱼᱟ ᱾',

    micTapToSpeak: 'ᱨᱚᱲ ᱞᱟᱹᱜᱤᱫ ᱢᱟᱭᱤᱠ ᱚᱛᱟᱭ ᱢᱮ (ᱥᱟᱱᱛᱟᱲᱤ / ᱦᱤᱱᱫᱤ / ᱢᱩᱱᱰᱟᱨᱤ)',
    micRecording: 'ᱟᱢᱟᱜ ᱟᱲᱟᱝ ᱟᱧᱡᱚᱢᱚᱜ ᱠᱟᱱᱟ...',
    micSubtitleIdle: 'ᱥᱟᱯᱷᱟ ᱨᱚᱲ ᱢᱮ, ᱟᱞᱮ ᱚᱞ ᱟᱞᱮ ᱾',
    micSubtitleListening: 'ᱢᱟᱭᱤᱠ ᱟᱧᱡᱚᱢ ᱮᱫᱟᱭ... ᱟᱢᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱞᱟᱹᱭ ᱢᱮ ᱾',
    speechSupportedTip: 'ᱢᱟᱭᱤᱠ ᱛᱮᱭᱟᱨ ᱢᱮᱱᱟᱜᱼᱟ • ᱨᱚᱲ ᱢᱮ',
    speechListeningAlert: 'ᱢᱟᱭᱤᱠ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜᱼᱟ... ᱨᱚᱲ ᱢᱮ',

    photoSectionTitle: 'ᱪᱤᱛᱟᱹᱨ ᱥᱮᱞᱮᱫᱽ ᱢᱮ',
    photoSectionSubtitle: 'ᱠᱮᱢᱮᱨᱟ ᱛᱮ ᱪᱤᱛᱟᱹᱨ ᱛᱩᱞᱟᱹᱣ ᱢᱮ ᱵᱟᱝᱠᱷᱟᱱ ᱯᱷᱳᱱ ᱠᱷᱚᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱾',
    btnChooseFile: 'ᱪᱤᱛᱟᱹᱨ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
    btnLaunchCamera: 'ᱪᱤᱛᱟᱹᱨ ᱛᱩᱞᱟᱹᱣ ᱢᱮ',
    btnUploadCustom: 'ᱟᱯᱱᱟᱨ ᱪᱤᱛᱟᱹᱨ ᱡᱟᱸᱪ',
    dragDropText: 'ᱪᱤᱛᱟᱹᱨ ᱵᱟᱪᱷᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱱᱚᱸᱰᱮ ᱚᱛᱟᱭ ᱢᱮ',
    selectedEvidenceCount: 'ᱪᱤᱛᱟᱹᱨ ᱥᱮᱞᱮᱫ ᱮᱱᱟ',
    removeImage: 'ᱚᱪᱚᱜ ᱢᱮ',
    addMorePhotos: 'ᱟᱨ ᱪᱤᱛᱟᱹᱨ ᱥᱮᱞᱮᱫᱽ ᱢᱮ',

    ticketCodeLabel: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱮᱞ',
    problemTitle: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱧᱩᱛᱩᱢ',
    problemTitlePlaceholder: 'ᱡᱮᱞᱮᱠᱟ: ᱟᱹᱛᱩ ᱨᱮ ᱪᱟᱯᱟᱠᱚᱞ ᱵᱟᱹᱲᱤᱡ ᱟᱠᱟᱱᱟ ᱟᱨ ᱜᱟᱱᱫᱟ ᱫᱟᱜ ᱚᱰᱚᱠᱚᱜ ᱠᱟᱱᱟ',
    problemDesc: 'ᱪᱮᱫ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱠᱟᱱᱟ?',
    problemDescPlaceholder: 'ᱞᱟᱹᱭ ᱢᱮ ᱪᱮᱫ ᱵᱟᱹᱲᱤᱡ ᱟᱠᱟᱱᱟ ᱟᱨ ᱛᱤᱱᱟᱹᱜ ᱚᱲᱟᱜ ᱦᱚᱲ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱨᱮ ᱢᱮᱱᱟᱜ ᱠᱚᱣᱟ ᱾',
    thematicCategory: 'ᱪᱮᱫ ᱞᱮᱠᱟᱱ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱠᱟᱱᱟ?',
    urgencyLevel: 'ᱱᱚᱶᱟ ᱛᱤᱱᱟᱹᱜ ᱞᱟᱹᱠᱛᱤᱭᱟᱱᱟ?',
    jharkhandDistrict: 'ᱡᱤᱞᱟᱹ',
    villageWard: 'ᱟᱹᱛᱩ ᱵᱟᱝᱠᱷᱟᱱ ᱴᱳᱞᱟ ᱧᱩᱛᱩᱢ',
    villagePlaceholder: 'ᱡᱮᱞᱮᱠᱟ: ᱵᱟᱜᱷᱢᱟᱨᱟ, ᱴᱳᱞᱟ ᱔',
    reporterName: 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ',
    reporterPhone: 'ᱢᱳᱵᱟᱭᱤᱞ ᱱᱚᱢᱵᱚᱨ (SMS ᱞᱟᱹᱜᱤᱫ)',
    submitButton: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱠᱚᱞᱮᱡᱽ ᱠᱩᱞ ᱢᱮ',
    submittingButton: 'ᱨᱤᱯᱳᱨᱴ ᱠᱩᱞᱚᱜ ᱠᱟᱱᱟ...',

    catWater: '💧 ᱫᱟᱜ ᱟᱨ ᱪᱟᱯᱟᱠᱚᱞ',
    catSolar: '☀️ ᱥᱳᱞᱟᱨ ᱵᱤᱡᱽᱞᱤ',
    catRoad: '🛣️ ᱟᱹᱛᱩ ᱦᱚᱨ ᱟᱨ ᱯᱩᱞᱤᱭᱟᱹ',
    catAgri: '🌾 ᱪᱟᱥ ᱟᱨ ᱯᱷᱚᱥᱚᱞ',
    catHealth: '🏥 ᱟᱹᱛᱩ ᱦᱟᱥᱯᱟᱛᱟᱞ ᱟᱨ ᱨᱟᱱ',
    catSanitation: '♻️ ᱥᱟᱯᱷᱟ ᱥᱟᱹᱯᱷᱤ ᱟᱨ ᱚᱵᱚᱨᱡᱚᱱᱟ',
    catEducation: '📚 ᱟᱥᱲᱟ ᱟᱨ ᱯᱟᱲᱦᱟᱣ',

    urgCritical: '🔴 ᱩᱥᱟᱹᱨᱟ ᱜᱚᱲᱚ ᱞᱟᱹᱠᱛᱤ (Immediate)',
    urgHigh: '🟠 ᱞᱟᱹᱠᱛᱤᱭᱟᱱ (᱒ ᱢᱟᱦᱟᱸ ᱨᱮ)',
    urgMedium: '🟡 ᱛᱟᱞᱟᱢᱟᱞᱟ (ᱱᱚᱣᱟ ᱦᱟᱯᱛᱟ ᱨᱮ)',
    urgLow: '🟢 ᱥᱟᱫᱷᱟᱨᱚᱱ ᱱᱮᱦᱚᱨ',

    cvTitle: 'ᱪᱤᱛᱟᱹᱨ ᱡᱟᱸᱪ',
    cvSubtitle: 'ᱪᱤᱛᱟᱹᱨ ᱨᱮ ᱵᱟᱹᱲᱤᱡ, ᱠᱷᱟᱹᱛᱤ ᱟᱨ ᱫᱟᱜ ᱧᱮᱞ ᱧᱟᱢᱟ',
    modelActive: 'ᱪᱤᱛᱟᱹᱨ ᱡᱟᱸᱪ: ᱛᱮᱭᱟᱨ',
    sampleWater: 'ᱪᱟᱯᱟᱠᱚᱞ',
    sampleRoad: 'ᱦᱚᱨ ᱯᱩᱞᱤᱭᱟᱹ',
    sampleSolar: 'ᱥᱳᱞᱟᱨ ᱞᱟᱭᱤᱴ',
    verifiedLabels: 'ᱪᱤᱛᱟᱹᱨ ᱨᱮ ᱪᱮᱫ ᱧᱟᱢ ᱮᱱᱟ:',
    inferencingCV: 'ᱪᱤᱛᱟᱹᱨ ᱡᱟᱸᱪ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ...',

    agentRoutingTitle: 'ᱟᱢᱟᱜ ᱟᱹᱛᱩ ᱞᱟᱹᱜᱤᱫ ᱥᱚᱨᱮᱥ ᱠᱚᱞᱮᱡᱽ',
    scoreLabel: 'ᱥᱚᱨᱮᱥ ᱢᱮᱞ',
    targetDestination: 'ᱵᱟᱪᱷᱟᱣ ᱟᱠᱟᱱ ᱠᱚᱞᱮᱡᱽ',
    routingCriteria: 'ᱟᱢᱟᱜ ᱟᱹᱛᱩ ᱥᱩᱨ ᱨᱮᱱᱟᱜ ᱠᱚᱞᱮᱡᱽ ᱟᱨ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱴᱤᱢ ᱥᱟᱶ ᱡᱚᱲᱟᱣ ᱾',
    deptLabel: 'ᱠᱚᱞᱮᱡᱽ ᱵᱤᱵᱷᱟᱜᱽ:',
    deptValue: 'ᱫᱟᱜ ᱟᱨ ᱥᱤᱵᱷᱤᱞ ᱤᱧᱡᱤᱱᱤᱭᱟᱹᱨᱤᱝ',
    nepCreditsLabel: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱨᱮᱰᱤᱴ:',
    nepCreditsValue: 'ᱟᱹᱛᱩ ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ ᱔ ᱠᱨᱮᱰᱤᱴ',
    csrGrantLabel: 'ᱠᱟᱹᱣᱰᱤ ᱜᱚᱲᱚ:',
    csrGrantValue: 'Coal India / Tata Steel (₹2.5L ᱦᱟᱹᱵᱤᱡ)',

    trackerTitle: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱨᱮᱱᱟᱜ ᱦᱟᱞᱚᱛ ᱧᱮᱞ ᱢᱮ',
    trackerSubtitle: 'ᱧᱮᱞ ᱢᱮ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱪᱮᱫ ᱞᱮᱠᱟ ᱟᱹᱛᱩ ᱠᱚᱨᱮ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ ᱠᱚ ᱾',
    searchPlaceholder: 'ᱟᱹᱛᱩ ᱧᱩᱛᱩᱢ ᱥᱮᱸᱫᱽᱨᱟᱭ ᱢᱮ...',
    filterAll: 'ᱥᱟᱱᱟᱢ ᱮᱴᱠᱮᱴᱚᱬᱮ',
    filterWater: 'ᱫᱟᱜ',
    filterRoad: 'ᱦᱚᱨ ᱰᱟᱦᱟᱨ',
    filterSolar: 'ᱥᱳᱞᱟᱨ ᱵᱤᱡᱽᱞᱤ',
    filterAgri: 'ᱪᱟᱥ ᱵᱟᱥ',
    kmAway: 'ᱠᱤᱞᱳᱢᱤᱴᱟᱨ ᱥᱟᱺᱜᱤᱧ',
    teamLabel: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱴᱤᱢ',
    statusReceived: 'ᱡᱟᱸᱪ ᱦᱩᱭ ᱮᱱᱟ',
    statusWorking: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ ᱠᱚ',
    statusFixed: 'ᱟᱹᱛᱩ ᱨᱮ ᱵᱮᱱᱟᱣ ᱮᱱᱟ',

    govtCommandTitle: 'ᱥᱚᱨᱠᱟᱨ ᱧᱮᱞ • ᱡᱤᱞᱟᱹ ᱢᱮᱯ',
    govtCommandSub: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱥᱟᱱᱟᱢ ᱒᱔ ᱡᱤᱞᱟᱹ ᱨᱮᱱᱟᱜ ᱠᱟᱹᱢᱤ ᱟᱨ ᱠᱚᱞᱮᱡᱽ ᱧᱮᱞ ᱾',
    gisMapTitle: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱟᱹᱛᱩ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱢᱮᱯ',
    gisMapSub: 'ᱥᱟᱱᱟᱢ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱢᱮᱯ ᱨᱮ ᱧᱮᱞ ᱢᱮ ᱾',
    filterCategory: 'ᱛᱷᱚᱠ',
    filterUrgency: 'ᱞᱟᱹᱠᱛᱤ',
    filterDistrict: 'ᱡᱤᱞᱟᱹ',
    filterStatus: 'ᱦᱟᱞᱚᱛ',
    statTotalComplaints: 'ᱡᱚᱢᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ',
    statResolvedProjects: 'ᱥᱚᱞᱦᱮ ᱮᱱᱟ',
    statActiveTeams: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱴᱤᱢ ᱠᱚ',
    statRoutingAccuracy: 'ᱠᱚᱞᱮᱡᱽ ᱢᱮᱞ ᱫᱚᱨ',
    statCsrCapital: 'ᱜᱩᱴ ᱜᱚᱲᱚ ᱠᱟᱹᱣᱰᱤ',
    districtMatrixTitle: 'ᱥᱟᱱᱟᱢ ᱒᱔ ᱡᱤᱞᱟᱹ',
    districtMatrixSub: 'ᱡᱤᱞᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱠᱟᱛᱮ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱟᱨ ᱠᱚᱞᱮᱡᱽ ᱧᱮᱞ ᱢᱮ ᱾',
    mappedHubs: 'ᱡᱚᱲᱟᱣ ᱟᱠᱟᱱ ᱠᱚᱞᱮᱡᱽ:',

    heiWorkspaceTitle: 'ᱠᱚᱞᱮᱡᱽ ᱴᱤᱢ ᱠᱟᱹᱢᱤᱦᱚᱨᱟ',
    heiWorkspaceSub: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱟᱹᱛᱩ ᱨᱮ ᱥᱚᱞᱦᱮ ᱵᱮᱱᱟᱣ ᱨᱮ ᱜᱚᱲᱚ ᱟᱠᱚ ᱢᱮ ᱾',
    btnAcceptTicket: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱦᱟᱛᱟᱣ ᱢᱮ ᱟᱨ ᱴᱤᱢ ᱵᱮᱱᱟᱣ ᱢᱮ',
    btnUploadProof: 'ᱠᱟᱹᱢᱤ ᱪᱤᱛᱟᱹᱨ ᱥᱟᱹᱵᱩᱛ ᱞᱟᱫᱮᱭ ᱢᱮ',
    btnConferCertificate: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱮᱢ ᱢᱮ',
    milestoneTitle: 'ᱠᱟᱹᱢᱤ ᱨᱮᱱᱟᱜ ᱫᱷᱟᱯ ᱠᱚ',
    studentTeamTitle: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱴᱤᱢ',

    csrMarketTitle: 'ᱠᱚᱢᱯᱟᱱᱤ ᱠᱷᱚᱱ ᱜᱚᱲᱚ',
    csrMarketSub: 'ᱴᱟᱴᱟ ᱥᱴᱤᱞ, ᱠᱳᱞ ᱤᱱᱰᱤᱭᱟ ᱟᱹᱛᱩ ᱯᱨᱳᱡᱮᱠᱴ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱹᱣᱰᱤ ᱜᱚᱲᱚ ᱮᱢᱚᱜ ᱠᱟᱱᱟ ᱾',
    btnPledgeGrant: 'ᱱᱚᱣᱟ ᱯᱨᱳᱡᱮᱠᱴ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱹᱣᱰᱤ ᱮᱢ ᱢᱮ',
    pledgedAmountLabel: 'ᱠᱤᱨᱤᱭᱟᱹ ᱠᱟᱹᱣᱰᱤ',
    disbursedLabel: 'ᱮᱢ ᱟᱠᱟᱱ ᱠᱟᱹᱣᱰᱤ',

    locModalTitle: 'ᱢᱮᱯ ᱨᱮ ᱟᱢᱟᱜ ᱴᱷᱟᱶ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
    locModalSub: 'ᱯᱤᱱ ᱚᱱᱟ ᱴᱷᱟᱶ ᱛᱮ ᱤᱫᱤᱭ ᱢᱮ ᱡᱟᱦᱟᱸᱨᱮ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱢᱮᱱᱟᱜᱼᱟ ᱾',
    locSearchPlaceholder: 'ᱟᱹᱛᱩ ᱵᱟᱝᱠᱷᱟᱱ ᱡᱟᱭᱜᱟ ᱧᱩᱛᱩᱢ ᱥᱮᱸᱫᱽᱨᱟᱭ ᱢᱮ...',
    locManualLat: 'Latitude',
    locManualLng: 'Longitude',
    locUseCurrentGps: 'ᱱᱤᱛᱚᱜᱟᱜ ᱴᱷᱟᱶ ᱤᱫᱤᱭ ᱢᱮ',
    locConfirmBtn: 'ᱴᱷᱟᱶ ᱯᱩᱥᱴᱟᱹᱣ ᱢᱮ',
  },

  mun: {
    brandSub: 'उच्च एवं तकनीकी शिक्षा विभाग, झारखंड सरकार',
    auditLedger: 'पक्का हिसाब',
    signIn: 'लॉग इन',
    register: 'रजिस्टर',
    logout: 'लॉग आउट',
    profileTitle: 'आपनाः प्रोफाइल',
    role: 'भूमिका',
    district: 'जिला',
    phone: 'फ़ोन',
    email: 'ईमेल',
    myPortal: 'पोर्टल नेलपे',
    onlineStatus: 'ऑनलाइन • तैयार',
    close: 'बंद करपे',
    cancel: 'रद्द करपे',
    save: 'सहेजपे',

    sihBadge: 'स्मार्ट इंडिया हैकाथॉन 2026',
    landingHeroTitle1: 'आतु समस्या को बईपे',
    landingHeroTitleGradient: 'झारखंड रेयाः मारांग कॉलेज को सोंगे',
    landingHeroDesc:
      'आतु रे दाः, बिजली, होर-डाहार समस्या को बताओपे। कॉलेज छात्र आर प्रोफेसर को मिल केते आतु लागि समाधान बई-एआ।',
    btnReportProblem: 'समस्या बताओपे',
    btnSignInPortal: 'पोर्टल लॉगिन करपे',
    metricDistricts: '२४',
    metricDistrictsLabel: 'जिला को जुड़ाव आकाना',
    metricHeis: '२८+',
    metricHeisLabel: 'कॉलेज आर लैब को',
    metricCsrPledged: '₹२.८५ करोड़',
    metricCsrLabel: 'गड़ो पैसा वादा',
    metricResolved: '९४०+',
    metricResolvedLabel: 'समाधान होबायना',
    featuresHeading: 'जोहारसेतु आतु के चिलके गड़ो-एआ',
    featuresSub: 'आतु होड़ो को लागि आसान, छात्र को लागि भलाई।',
    pillar1Title: 'रोड़ केते आर फोटो जोड़पे',
    pillar1Desc: 'मुंडारी, संथाली, हिंदी ते कजिपे। इंटरनेट बानोः रेहो काम-एआ।',
    pillar2Title: 'फोटो जांच',
    pillar2Desc: 'फोटो रे खराबी नेल-एआ आर मिलता-जुलता समस्या के जोड़-एआ।',
    pillar3Title: 'सुर कॉलेज सोंगे जोड़ाव',
    pillar3Desc: 'समस्या के सुर रेयाः इंजीनियरिंग कॉलेज ते कुल-एआ।',
    pillar4Title: 'साफ आर पक्का हिसाब',
    pillar4Desc: 'सोबेन काम आर पैसा रेयाः साफ हिसाब सुरक्षित मेनाः।',
    howItWorksHeading: '४ आसान चरण ते समाधान',
    step1Title: '१. समस्या बताओपे',
    step1Desc: 'फोटो तुलिपे, फोन रे कजिपे कादो स्थान चुनवपे।',
    step2Title: '२. कॉलेज जांच',
    step2Desc: 'सिस्टम समस्या के सही कॉलेज छात्र टीम के कुल-एआ।',
    step3Title: '३. छात्र कोवाः समाधान',
    step3Desc: 'छात्र आर शिक्षक मिल केते आतु लागि समाधान बई-एआ।',
    step4Title: '४. आतु रे बईयना',
    step4Desc: 'आतु रे सामान लगाओ होबायना आर छात्र को कॉलेज क्रेडिट नाम-केदा।',
    footerRights: 'झारखंड सरकार • उच्च एवं तकनीकी शिक्षा विभाग',

    heroBadge: 'जन सेतु • सोबेन नागरिक को लागि',
    heroTitle: 'आपनाः आतु रेयाः समस्या बताओपे',
    heroSubtitle:
      'दाः, बिजली, होर-डाहार समस्या को फोन ते सीधे बताओपे। कॉलेज छात्र आर इंजीनियर को आतु लागि समाधान बई-एआ।',

    formHeading: 'आपनाः समस्या बताओपे',
    formBadge: 'इंटरनेट बानोः रेहो काम-एआ',
    formSubtitle: 'ओपे कादो आपनाः भाषा ते रोड़ केते बताओपे।',
    gpsAcquiring: 'स्थान खोजे तना...',
    gpsCoordinates: 'स्थान',
    refineOnMap: 'मैप रे चुनवपे',
    successTitle: 'समस्या कॉलेज सेटेरयना!',
    successSubtitle: 'छात्र को काम तनाको। SMS ते खबर नामोःआ।',

    micTapToSpeak: 'कजि लागि माइक ओतायपे (मुंडारी / संथाली / हिंदी)',
    micRecording: 'आवाज़ आयुम सेनोः तना...',
    micSubtitleIdle: 'सफा कजिपे, आले ओलाले।',
    micSubtitleListening: 'माइक आयुम तना... आपनाः समस्या कजिपे।',
    speechSupportedTip: 'माइक तैयार मेनाः • कजिपे',
    speechListeningAlert: 'माइक चालू मेनाः... कजिपे',

    photoSectionTitle: 'फोटो जोड़पे',
    photoSectionSubtitle: 'कैमरा ते फोटो तुलिपे कादो फोन एते चुनवपे।',
    btnChooseFile: 'फोटो चुनवपे',
    btnLaunchCamera: 'फोटो तुलिपे',
    btnUploadCustom: 'आपन फोटो जांचपे',
    dragDropText: 'फोटो चुनव लागि नेंड़े ओतायपे',
    selectedEvidenceCount: 'फोटो जोड़ होबायना',
    removeImage: 'ओचोपे',
    addMorePhotos: 'आर फोटो जोड़पे',

    ticketCodeLabel: 'शिकायत नंबर',
    problemTitle: 'समस्या रेयाः नूतूम',
    problemTitlePlaceholder: 'जैसे: आतु रे चापाकल खराब मेनःआ आर गंदा लाल दाः ओड़ोङोः तना',
    problemDesc: 'समस्या चिलकन ताना?',
    problemDescPlaceholder: 'बताओपे चिनाः खराबी मेनःआ आर चिमिंन ओड़ाः को प्रभावित मेनाःकोवा।',
    thematicCategory: 'चिलकन समस्या ताना?',
    urgencyLevel: 'चिमिंन जरूरी ताना?',
    jharkhandDistrict: 'जिला',
    villageWard: 'आतु कादो टोला नूतूम',
    villagePlaceholder: 'जैसे: बागमारा, टोला ४',
    reporterName: 'आपनाः नूतूम',
    reporterPhone: 'मोबाइल नंबर (SMS लागि)',
    submitButton: 'समस्या कॉलेज कुलपे',
    submittingButton: 'रिपोर्ट कुल सेनोः तना...',

    catWater: '💧 दाः आर चापाकल',
    catSolar: '☀️ सोलर बिजली',
    catRoad: '🛣️ आतु होर आर पुलिया',
    catAgri: '🌾 चास आर फसल',
    catHealth: '🏥 आतु अस्पताल आर रान',
    catSanitation: '♻️ सफा-सुथरा आर कचरा',
    catEducation: '📚 स्कूल आर पढ़ाई',

    urgCritical: '🔴 तुरंत गड़ो दरकार (भारी खतरा)',
    urgHigh: '🟠 जरूरी (२ दिन रे)',
    urgMedium: '🟡 मध्यम (ने हफ्ता रे)',
    urgLow: '🟢 साधारण अरजी',

    cvTitle: 'फोटो जांच',
    cvSubtitle: 'फोटो रे खराबी, जंग आर गंदा दाः नेल-एआ',
    modelActive: 'फोटो जांच: तैयार',
    sampleWater: 'चापाकल',
    sampleRoad: 'सड़क पुलिया',
    sampleSolar: 'सोलर लाइट',
    verifiedLabels: 'फोटो रे चिनाः नेलयना:',
    inferencingCV: 'फोटो जांच सेनोः तना...',

    agentRoutingTitle: 'आतु लागि सही कॉलेज',
    scoreLabel: 'सही मेल',
    targetDestination: 'चुनाव आकान कॉलेज',
    routingCriteria:
      'सुर कॉलेज आर छात्र टीम सोंगे आतु के जोड़ाव-एआ जाहाँ सही लैब मेनाः।',
    deptLabel: 'कॉलेज विभाग:',
    deptValue: 'दाः आर सिविल इंजीनियरिंग',
    nepCreditsLabel: 'छात्र को क्रेडिट:',
    nepCreditsValue: 'आतु काम लागि ४ क्रेडिट',
    csrGrantLabel: 'पैसा गड़ो:',
    csrGrantValue: 'Coal India / Tata Steel (₹2.5L धरि)',

    trackerTitle: 'समस्या रेयाः खबर नेलपे',
    trackerSubtitle: 'नेलपे छात्र को चिलके आतु रे समस्या बई तनाको।',
    searchPlaceholder: 'आतु नूतूम खोजेपे...',
    filterAll: 'सोबेन समस्या',
    filterWater: 'दाः',
    filterRoad: 'होर-डाहार',
    filterSolar: 'सोलर बिजली',
    filterAgri: 'चास-बास',
    kmAway: 'किमी दूर',
    teamLabel: 'छात्र टीम',
    statusReceived: 'जांच होबायना',
    statusWorking: 'छात्र को काम तनाको',
    statusFixed: 'आतु रे बईयना',

    govtCommandTitle: 'सरकारी दृश्य • राज्य मैप',
    govtCommandSub:
      'झारखंड रेयाः सोबेन २४ जिला रेयाः खबर। छात्र समाधान आर पैसा गड़ो खबर।',
    gisMapTitle: 'झारखंड आतु समस्या मैप',
    gisMapSub: 'सोबेन समस्या मैप रे नेलपे।',
    filterCategory: 'श्रेणी',
    filterUrgency: 'जरूरी',
    filterDistrict: 'जिला',
    filterStatus: 'स्थिति',
    statTotalComplaints: 'दर्ज समस्या को',
    statResolvedProjects: 'समाधान होबायना',
    statActiveTeams: 'काम तान छात्र टीम को',
    statRoutingAccuracy: 'सही कॉलेज मेल',
    statCsrCapital: 'कुल गड़ो पैसा',
    districtMatrixTitle: 'सोबेन २४ जिला',
    districtMatrixSub: 'जिला चुनव केते समस्या आर कॉलेज नेलपे।',
    mappedHubs: 'जोड़ाव आकान कॉलेज:',

    heiWorkspaceTitle: 'कॉलेज टीम कार्यक्षेत्र',
    heiWorkspaceSub: 'छात्र को आतु समाधान बई रे गड़ोपे आर क्रेडिट सोपावपे।',
    btnAcceptTicket: 'समस्या हताओपे आर टीम बईपे',
    btnUploadProof: 'काम रेयाः फोटो सबूत अपलोड करपे',
    btnConferCertificate: 'प्रमाणपत्र सोपावपे',
    milestoneTitle: 'काम रेयाः चरण को',
    studentTeamTitle: 'छात्र टीम',

    csrMarketTitle: 'कंपनी को एते गड़ो',
    csrMarketSub: 'टाटा स्टील, कोल इंडिया आतु प्रोजेक्ट्स लागि छात्र को पैसा गड़ो-एआको।',
    btnPledgeGrant: 'ने प्रोजेक्ट के गड़ोपे',
    pledgedAmountLabel: 'वादा आकान पैसा',
    disbursedLabel: 'सोपाव आकान पैसा',

    locModalTitle: 'मैप रे आपनाः स्थान चुनवपे',
    locModalSub: 'पिन के समस्या थान ते इदीपे।',
    locSearchPlaceholder: 'आतु कादो स्थान नूतूम खोजेपे...',
    locManualLat: 'Latitude',
    locManualLng: 'Longitude',
    locUseCurrentGps: 'नितीयाः स्थान इदीपे',
    locConfirmBtn: 'स्थान पक्का करपे',
  },
};

export function getTranslation(lang: string): Translations {
  if (lang === 'hi' || lang === 'sat' || lang === 'mun') {
    return translations[lang];
  }
  return translations.en;
}
