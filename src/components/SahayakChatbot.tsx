'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  AlertCircle,
  HelpCircle,
  Languages,
  Mic,
  MicOff,
  MapPin,
  Camera,
  ArrowRight,
  ShieldCheck,
  Award,
  FileText,
  Check,
  Navigation,
  Compass,
  CornerDownLeft,
  ChevronRight,
  Layers,
  Wand2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ProblemTicket, TicketCategory, UrgencyLevel } from '../lib/types';
import { CATEGORY_PRESET_IMAGES } from '../lib/issueImagePromptEngine';
import { JHARKHAND_DISTRICTS, JHARKHAND_DISTRICT_CENTERS } from '../lib/locationUtils';
import { findOptimalHeiForTicket } from '../lib/heiRegistry';
import { API_ENDPOINTS } from '../lib/apiConfig';

export type ChatLangCode = 'hinglish' | 'english' | 'hindi' | 'mundari' | 'santhali' | 'ho';

interface LanguageConfig {
  code: ChatLangCode;
  label: string;
  nativeLabel: string;
  greeting: string;
  placeholder: string;
  prompts: Array<{ label: string; prompt: string }>;
  fallbackWater: string;
  fallbackNep: string;
  fallbackRoad: string;
}

const LANGUAGE_CONFIGS: Record<ChatLangCode, LanguageConfig> = {
  hinglish: {
    code: 'hinglish',
    label: 'Hinglish',
    nativeLabel: 'Hinglish (Hindi in Roman)',
    greeting:
      'Johar! Main **Sahayak AI (सहायक)** hoon, aapka 24/7 civic assistant for JoharSetu.\n\n' +
      'Aap mujhse **Hinglish, English, Hindi, Mundari, Santhali, ya Ho** me baat kar sakte hain.\n\n' +
      '**Aap kya kar sakte hain:**\n' +
      '1. **Civic Samasya Report Karein**: Paani, road, solar microgrid ya school ki problem.\n' +
      '2. **NEP 2020 Credits**: Janein engineering students ko 4 credits kaise milte hain.\n' +
      '3. **Ticket Track Karein**: Apne submitted ticket ka real-time status check karein.',
    placeholder: 'Hinglish me poochhein (e.g., Road tooti hai...)',
    prompts: [
      { label: '📝 Complain File Karein', prompt: '__START_FILING__' },
      { label: '💧 Paani ki problem', prompt: 'Humare gaon ke handpump se ganda paani aa raha hai.' },
      { label: '🎓 NEP 2020 Credits', prompt: 'Students ko NEP 2020 ke tahat 4 credits kaise milte hain?' },
      { label: '🛣️ Road & Culvert', prompt: 'Baghmara block me road aur puliya tooti hui hai.' },
    ],
    fallbackWater:
      '**Water Management Alert** 💧\n' +
      'Humare record me notice hua hai ki aapke gaon me paani ya chaapakal ki dikkat hai.\n\n' +
      '**Next Action Steps:**\n' +
      '1. Aap niche **"Complain File Karein"** button daba kar 1-tap me report kar sakte hain.\n' +
      '2. Photo aur GPS ke sath submission seedhe nearest **IIT ISM Dhanbad / BIT Mesra** team ko route hota hai.\n' +
      '3. Mukhiya verification ke baad instant ledger block hash ban jaata hai.',
    fallbackNep:
      '**NEP 2020 Experiential Learning Matrix** 🎓\n' +
      'JoharSetu connects rural challenges directly to academic credit:\n\n' +
      '1. **4 Academic Credits**: Awarded to engineering students across 4 milestone stages.\n' +
      '2. **Participating HEIs**: IIT ISM Dhanbad, BIT Mesra, NIT Jamshedpur.\n' +
      '3. **Verification**: Gram Panchayat Mukhiya and Faculty Mentors co-sign proofs on-chain.\n' +
      '4. **CSR Funding**: Corporate partners sponsor prototypes up to ₹2.5 Lakhs.',
    fallbackRoad:
      '**Road Infrastructure Action** 🛣️\n' +
      'Road aur puliya repair ki report seedhe Jharkhand Rural Works Department aur nearest engineering college ko forward hoti hai.\n\n' +
      '1. Fast-track routing to local road inspection teams.\n' +
      '2. Satellite coordinates mapping for flood & monsoon damage analysis.',
  },
  english: {
    code: 'english',
    label: 'English',
    nativeLabel: 'English',
    greeting:
      'Johar! I am **Sahayak AI (सहायक)**, your 24/7 civic assistant for JoharSetu.\n\n' +
      'Feel free to communicate in **English, Hinglish, Hindi, Mundari, Santhali, or Ho**.\n\n' +
      '**Quick Actions Available:**\n' +
      '1. **File a Civic Problem**: Report water, road, solar, or school challenges.\n' +
      '2. **NEP 2020 Capstone Matrix**: Learn how students earn 4 university credits.\n' +
      '3. **Ticket Status Tracking**: Query existing tickets and audit ledger proofs.',
    placeholder: 'Ask in English (e.g., Broken handpump in village...)',
    prompts: [
      { label: '📝 File Complaint', prompt: '__START_FILING__' },
      { label: '💧 Water Issue', prompt: 'The drinking water handpump in our village has brown muddy water.' },
      { label: '🎓 NEP 2020 Credits', prompt: 'How do students earn 4 credits under NEP 2020 on JoharSetu?' },
      { label: '🛣️ Road Culvert', prompt: 'There is a damaged road culvert in Baghmara block.' },
    ],
    fallbackWater:
      '**Drinking Water Notice** 💧\n' +
      'We have logged drinking water contamination in your area.\n\n' +
      '**Recommended Steps:**\n' +
      '1. Tap **"File Complaint"** below to submit coordinates and photo evidence.\n' +
      '2. The system auto-assigns the nearest environmental engineering team.\n' +
      '3. A tamper-proof audit block is minted upon Mukhiya verification.',
    fallbackNep:
      '**NEP 2020 Experiential Learning Matrix** 🎓\n' +
      'JoharSetu enables active civic problem solving for college students:\n\n' +
      '1. **4 University Credits**: Earned by solving community-verified problems.\n' +
      '2. **Partner Universities**: IIT ISM Dhanbad, BIT Mesra, NIT Jamshedpur.\n' +
      '3. **Verification**: Gram Panchayat validation + SHA-256 milestone hashing.',
    fallbackRoad:
      '**Road Infrastructure Action** 🛣️\n' +
      'Road and culvert reports are dispatched instantly to the Executive Engineer and local engineering mentors.',
  },
  hindi: {
    code: 'hindi',
    label: 'हिन्दी',
    nativeLabel: 'हिन्दी (Hindi)',
    greeting:
      'जोहार! मैं **सहायक AI (Sahayak)** हूँ, JoharSetu का 24/7 बुद्धिमान नागरिक सहायक।\n\n' +
      'आप मुझसे **हिन्दी, हिंग्लिश, इंग्लिश, मुंडारी, संथाली या हो** भाषा में बात कर सकते हैं।\n\n' +
      '**प्रमुख सुविधाएँ:**\n' +
      '1. **शिकायत दर्ज करें**: चापाकल, सड़क, सोलर या स्कूल की समस्या 1-टैप में बताएं।\n' +
      '2. **NEP 2020 क्रेडिट्स**: इंजीनियरिंग छात्रों के 4 क्रेडिट्स के बारे में जानें।\n' +
      '3. **स्थिति जांचें**: दर्ज टिकट की वर्तमान प्रगति देखें।',
    placeholder: 'हिन्दी में पूछें (जैसे, चापाकल खराब है...)',
    prompts: [
      { label: '📝 शिकायत दर्ज करें', prompt: '__START_FILING__' },
      { label: '💧 पानी की समस्या', prompt: 'हमारे गाँव के चापाकल से गंदा लाल पानी आ रहा है।' },
      { label: '🎓 NEP 2020 क्रेडिट्स', prompt: 'छात्रों को NEP 2020 के तहत 4 क्रेडिट कैसे मिलते हैं?' },
      { label: '🛣️ सड़क एवं पुलिया', prompt: 'बाघमारा ब्लॉक में सड़क की पुलिया टूट गई है।' },
    ],
    fallbackWater:
      '**जल आपूर्ति संज्ञान** 💧\n' +
      'गाँव में पेयजल अथवा चापाकल की समस्या का त्वरित समाधान आवश्यक है।\n\n' +
      '**अगला कदम:**\n' +
      '1. नीचे दिए गए **"शिकायत दर्ज करें"** बटन से तुरंत फोटो और GPS के साथ रिपोर्ट करें।\n' +
      '2. यह सीधे नजदीकी इंजीनियरिंग कॉलेज को समाधान हेतु आवंटित होगी।',
    fallbackNep:
      '**NEP 2020 प्रायोगिक शिक्षा** 🎓\n' +
      'छात्रों को व्यावहारिक जन-समस्या समाधान हेतु 4 क्रेडिट प्रदान किए जाते हैं।\n\n' +
      '1. **सहयोगी संस्थान**: IIT ISM धनबाद, BIT मेसरा, NIT जमशेदपुर।\n' +
      '2. **प्रमाणीकरण**: मुखिया एवं फैकल्टी द्वारा डिजिटल ऑडिट सत्यापन।',
    fallbackRoad:
      '**सड़क एवं अवसंरचना संज्ञान** 🛣️\n' +
      'सड़क एवं पुलिया मरम्मत की शिकायतों को सीधे संबंधित कार्यपालक अभियंता एवं नजदीकी इंजीनियरिंग कॉलेज को भेजा जाता है।',
  },
  mundari: {
    code: 'mundari',
    label: 'मुंडारी',
    nativeLabel: 'मुंडारी (Mundari)',
    greeting:
      'जोहार! अञ **सहायक AI** तनाञ, JoharSetu रेयाः 24/7 गोड़ो एमेनी।\n\n' +
      'आपे **मुंडारी, हो, संथाली, हिन्दी, हिंग्लिश या इंग्लिश** रे काजी दाइयापे।\n\n' +
      '1. **समस्या रिपोर्ट**: दाः, होरा, सोलर बत्ती या स्कूल रेयाः दिक्कत काजीपे।\n' +
      '2. **NEP 2020 Credits**: छात्र-को के 4 क्रेडिट नमोःआ।',
    placeholder: 'मुंडारी रे काजीपे (चापाकल, दाः, होरा...)',
    prompts: [
      { label: '📝 शिकायत ओलपे', prompt: '__START_FILING__' },
      { label: '💧 दाः समस्या', prompt: 'आलेयाः हातु रेयाः चापाकल लेका गंदा दाः ओड़ोङोःताना।' },
      { label: '🎓 NEP क्रेडिट', prompt: 'NEP 2020 रे छात्र-को के 4 क्रेडिट चिलके नमोःआ?' },
    ],
    fallbackWater:
      '**दाः रेयाः समस्या** 💧\n' +
      'हातु रे चापाकल आर दाः रेयाः समस्या नमोःआ।\n\n' +
      '1. फोटो आर GPS सोंगे टिकट दर्ज दाइयापे।\n' +
      '2. इंजीनियरिंग कॉलेज छात्र-को तुरते समाधान को बाया।',
    fallbackNep:
      '**NEP 2020 क्रेडिट** 🎓\n' +
      'NEP 2020 रे छात्र-को 4 Capstone Credits नमोःआ जब हातु रेयाः समस्या समाधान रे काम को बाय।',
    fallbackRoad:
      '**होरा आर पुलिया** 🛣️\n' +
      'होरा आर पुलिया मरम्मत रेयाः खबर सरकारी इंजीनियर आर कॉलेज के तुरते कुल दाइयोःआ।',
  },
  santhali: {
    code: 'santhali',
    label: 'ᱥᱟᱱᱛᱟᱲᱤ',
    nativeLabel: 'ᱥᱟᱱᱛᱟᱲᱤ (Santhali)',
    greeting:
      'ᱡᱚᱦᱟᱨ! ᱤᱧ **ᱥᱟᱦᱟᱭᱚᱠ AI** ᱠᱟᱹᱱᱟᱹᱧ, JoharSetu ᱨᱮᱭᱟᱜ ᱒᱔/᱗ ᱜᱚᱲᱚ ᱮᱢᱚᱜᱤᱡ᱾\n\n' +
      'ᱟᱯᱮ **ᱥᱟᱱᱛᱟᱲᱤ, ᱦᱤᱱᱫᱤ, ᱦᱤᱝᱞᱤᱥ, ᱤᱝᱞᱤᱥ ᱥᱮ ᱦᱳ** ᱛᱮ ᱠᱟᱛᱷᱟ ᱫᱟᱲᱮᱭᱟᱜ-ᱟᱯᱮ᱾\n\n' +
      '᱑. **ᱠᱚᱢᱯᱞᱮᱱ ᱚᱞ ᱢᱮ**: ᱫᱟᱜ, ᱦᱚᱨ, ᱥᱚᱞᱟᱨ ᱵᱟᱹᱛᱤ ᱮᱢᱟᱱ᱾\n' +
      '᱒. **NEP ᱒᱐᱒᱐ ᱠᱨᱮᱰᱤᱴ**: ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱔ ᱠᱨᱮᱰᱤᱴ ᱧᱟᱢᱚᱜ-ᱟ᱾',
    placeholder: 'ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱠᱩᱞᱤ ᱢᱮ...',
    prompts: [
      { label: '📝 ᱠᱚᱢᱯᱞᱮᱱ ᱚᱞ ᱢᱮ', prompt: '__START_FILING__' },
      { label: '💧 ᱫᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ', prompt: 'ᱟᱞᱮᱭᱟᱜ ᱟᱹᱛᱩ ᱨᱮ ᱧᱩ ᱫᱟᱜ ᱨᱮᱭᱟᱜ ᱟᱹᱰᱤ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱢᱮᱱᱟᱜ-ᱟ᱾' },
      { label: '🎓 NEP ᱠᱨᱮᱰᱤᱴ', prompt: 'NEP 2020 ᱛᱮ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱔ ᱠᱨᱮᱰᱤᱴ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱠᱚ ᱧᱟᱢᱟ?' },
    ],
    fallbackWater:
      '**ᱫᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ** 💧\n' +
      'ᱟᱹᱛᱩ ᱨᱮ ᱫᱟᱜ ᱨᱮᱭᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ ᱞᱟᱹᱜᱤᱫ "ᱠᱚᱢᱯᱞᱮᱱ ᱚᱞ ᱢᱮ" ᱵᱚᱴᱚᱱ ᱫᱟᱵᱟᱣ ᱢᱮ᱾',
    fallbackNep:
      '**NEP ᱒᱐᱒᱐ ᱠᱨᱮᱰᱤᱴ** 🎓\n' +
      'NEP 2020 ᱛᱮ ᱤᱱᱡᱤᱱᱤᱭᱟᱨᱤᱝ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱔ ᱠᱨᱮᱰᱤᱴ ᱧᱟᱢᱟ ᱟᱹᱛᱩ ᱨᱮᱭᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱥᱚᱞᱦᱮ ᱠᱟᱛᱮ᱾',
    fallbackRoad:
      '**ᱦᱚᱨ ᱰᱟᱦᱟᱨ** 🛣️\n' +
      'ᱦᱚᱨ ᱟᱨ ᱯᱩᱞ ᱨᱟᱹᱯᱩᱫ ᱨᱮᱭᱟᱜ ᱠᱷᱚᱵᱚᱨ ᱥᱚᱨᱠᱟᱨᱤ ᱤᱱᱡᱤᱱᱤᱭᱟᱨ ᱟᱨ ᱠᱚᱞᱮᱡᱽ ᱛᱮ ᱥᱮᱱᱚᱜ-ᱟ᱾',
  },
  ho: {
    code: 'ho',
    label: '𑢹𑣉 (Ho)',
    nativeLabel: '𑢹𑣉 (Ho / हो भाषा)',
    greeting:
      'जोहार! अञ **सहायक AI** तनाञ, JoharSetu रेयाः 24/7 गोड़ो एमेनी।\n\n' +
      'आपे **हो, मुंडारी, संथाली, हिन्दी, हिंग्लिश या इंग्लिश** रे काजी दाइयापे।\n\n' +
      '1. **समस्या रिपोर्ट**: हातु रेयाः दाः, होरा, बत्ती समस्या काजीपे।\n' +
      '2. **NEP 2020**: इंजीनियरिंग छात्र-को के 4 क्रेडिट नमोःआ।',
    placeholder: 'हो भाषा रे काजीपे (दाः, होरा, चापाकल...)',
    prompts: [
      { label: '📝 समस्या ओलपे', prompt: '__START_FILING__' },
      { label: '💧 दाः समस्या', prompt: 'हातु रे चापाकल खराब गेया, गंदा दाः ओड़ोङोःताना।' },
      { label: '🎓 NEP क्रेडिट', prompt: 'NEP 2020 रे 4 क्रेडिट चिलके नमोःआ?' },
    ],
    fallbackWater:
      '**दाः समस्या** 💧\n' +
      'हातु रे दाः रेयाः समस्या दर्ज लेका "समस्या ओलपे" बटन दबावेपे।',
    fallbackNep:
      '**NEP 2020 क्रेडिट** 🎓\n' +
      'NEP 2020 रे छात्र-को 4 Capstone Credits नमोःआ जब हातु रेयाः समस्या समाधान रे काम को बाय।',
    fallbackRoad:
      '**होरा आर पुलिया** 🛣️\n' +
      'होरा आर पुलिया मरम्मत रेयाः खबर सरकारी इंजीनियर आर कॉलेज के तुरते कुल दाइयोःआ।',
  },
};

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isFilingCard?: boolean;
  autoCreatedChallenge?: {
    id: string;
    title: string;
    status: string;
  } | null;
}

interface SahayakChatbotProps {
  onNewTicket?: (ticket: ProblemTicket) => void;
}

/**
 * High-readability Markdown formatter for low-literacy citizens
 * Handles: **bold**, 1. / 2. step badges, - / • bullet icons, --- dividers, short paragraphs.
 */
function FormattedChatMessage({ text, isUser }: { text: string; isUser: boolean }) {
  if (isUser) {
    return <p className="whitespace-pre-line text-white font-medium">{text}</p>;
  }

  // Parse markdown lines
  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];

  let inList = false;

  lines.forEach((rawLine, idx) => {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      renderedElements.push(<div key={`sp-${idx}`} className="h-2" />);
      return;
    }

    // Divider
    if (trimmed === '---' || trimmed === '***') {
      renderedElements.push(<hr key={`hr-${idx}`} className="my-2.5 border-charcoal-border/30" />);
      return;
    }

    // Numbered step: "1. text" or "2) text"
    const numMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)/);
    if (numMatch) {
      const stepNum = numMatch[1];
      const stepContent = numMatch[2];
      renderedElements.push(
        <div key={`num-${idx}`} className="flex items-start gap-2 my-1.5 pl-0.5">
          <span className="w-5 h-5 rounded-full bg-terracotta/15 text-terracotta font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            {stepNum}
          </span>
          <div className="text-xs text-charcoal leading-relaxed flex-1">
            {formatInlineText(stepContent)}
          </div>
        </div>
      );
      return;
    }

    // Bullet item: "- text" or "* text" or "• text"
    const bulletMatch = trimmed.match(/^[\-\*\•]\s+(.*)/);
    if (bulletMatch) {
      const bulletContent = bulletMatch[1];
      renderedElements.push(
        <div key={`bl-${idx}`} className="flex items-start gap-2 my-1 pl-1">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 shrink-0" />
          <div className="text-xs text-charcoal leading-relaxed flex-1">
            {formatInlineText(bulletContent)}
          </div>
        </div>
      );
      return;
    }

    // Header: "### Title" or "## Title"
    if (trimmed.startsWith('#')) {
      const headerText = trimmed.replace(/^#+\s*/, '');
      renderedElements.push(
        <div key={`h-${idx}`} className="font-extrabold text-charcoal text-xs sm:text-sm mt-2 mb-1 flex items-center gap-1.5">
          <span className="w-1 h-3.5 bg-terracotta rounded-full inline-block" />
          <span>{formatInlineText(headerText)}</span>
        </div>
      );
      return;
    }

    // Standard paragraph
    renderedElements.push(
      <p key={`p-${idx}`} className="text-xs text-charcoal leading-relaxed my-1">
        {formatInlineText(trimmed)}
      </p>
    );
  });

  return <div className="space-y-0.5">{renderedElements}</div>;
}

/** Helper to format **bold** and highlight key civic terms */
function formatInlineText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      return (
        <strong key={i} className="font-bold text-charcoal bg-amber-500/10 px-1 py-0.5 rounded text-[11.5px]">
          {inner}
        </strong>
      );
    }
    return part;
  });
}

export default function SahayakChatbot({ onNewTicket }: SahayakChatbotProps) {
  const { language: appLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [chatLanguage, setChatLanguage] = useState<ChatLangCode>('hinglish');

  // Conversational Form Filing Wizard State
  const [isFilingMode, setIsFilingMode] = useState(false);
  const [filingStep, setFilingStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [filingCategory, setFilingCategory] = useState<TicketCategory>('WATER_MANAGEMENT');
  const [filingDistrict, setFilingDistrict] = useState('Dhanbad');
  const [filingVillage, setFilingVillage] = useState('Baghmara Block, Tola 4');
  const [filingLat, setFilingLat] = useState(23.8145);
  const [filingLng, setFilingLng] = useState(86.4412);
  const [filingDescription, setFilingDescription] = useState('');
  const [filingPhoto, setFilingPhoto] = useState<string>(CATEGORY_PRESET_IMAGES.WATER_MANAGEMENT);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  // Initialize language from app context or localStorage
  useEffect(() => {
    try {
      const savedChatLang = localStorage.getItem('johar_chat_lang') as ChatLangCode;
      if (savedChatLang && LANGUAGE_CONFIGS[savedChatLang]) {
        setChatLanguage(savedChatLang);
        return;
      }
    } catch {}

    // Map app language to chat language
    if (appLang === 'hi') setChatLanguage('hindi');
    else if (appLang === 'sat') setChatLanguage('santhali');
    else if (appLang === 'mun') setChatLanguage('mundari');
    else setChatLanguage('hinglish');
  }, [appLang]);

  // Listen for custom event from CitizenPortal Dual-Mode selector
  useEffect(() => {
    const handleOpenFiling = () => {
      setIsOpen(true);
      setIsFilingMode(true);
      setFilingStep(1);
    };

    window.addEventListener('open-sahayak-filing', handleOpenFiling);
    return () => window.removeEventListener('open-sahayak-filing', handleOpenFiling);
  }, []);

  const activeConfig = LANGUAGE_CONFIGS[chatLanguage] || LANGUAGE_CONFIGS.hinglish;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set initial welcome message based on language
  useEffect(() => {
    setMessages([
      {
        id: 'welcome-' + chatLanguage,
        sender: 'bot',
        text: activeConfig.greeting,
        timestamp: 'Just now',
      },
    ]);
  }, [chatLanguage, activeConfig.greeting]);

  // Initialize session ID
  useEffect(() => {
    let savedId = '';
    try {
      savedId = localStorage.getItem('johar_sahayak_session') || '';
      if (!savedId) {
        savedId = 'sess_' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem('johar_sahayak_session', savedId);
      }
    } catch {
      savedId = 'sess_' + Date.now();
    }
    setSessionId(savedId);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isFilingMode, filingStep]);

  const handleLanguageChange = (newLang: ChatLangCode) => {
    setChatLanguage(newLang);
    try {
      localStorage.setItem('johar_chat_lang', newLang);
    } catch {}
  };

  const handleCaptureGps = () => {
    if (!navigator.geolocation) {
      alert('GPS is not supported on this device.');
      return;
    }
    setIsLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFilingLat(pos.coords.latitude);
        setFilingLng(pos.coords.longitude);
        setIsLocatingGps(false);
      },
      () => {
        setIsLocatingGps(false);
      },
      { timeout: 8000 }
    );
  };

  // Voice recording helper using Web Speech API
  const handleToggleVoiceInput = () => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      alert('Voice speech recognition is not supported in this browser.');
      return;
    }

    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = chatLanguage === 'hindi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => setIsVoiceRecording(true);
      recognition.onend = () => setIsVoiceRecording(false);
      recognition.onerror = () => setIsVoiceRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (isFilingMode) {
          setFilingDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
        } else {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch (e) {
      setIsVoiceRecording(false);
    }
  };

  const handleSelectFilingCategory = (cat: TicketCategory) => {
    setFilingCategory(cat);
    setFilingPhoto(CATEGORY_PRESET_IMAGES[cat] || CATEGORY_PRESET_IMAGES.WATER_MANAGEMENT);
    setFilingStep(2);
  };

  const handleSelectFilingDistrict = (dist: string) => {
    setFilingDistrict(dist);
    const center = JHARKHAND_DISTRICT_CENTERS[dist];
    if (center) {
      setFilingLat(center.lat);
      setFilingLng(center.lng);
    }
    setFilingStep(3);
  };

  const handleConfirmFilingTicket = async () => {
    setIsSubmittingTicket(true);

    const ticketCode = `JS-${filingDistrict.substring(0, 3).toUpperCase()}-2026-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // Dynamic optimal HEI routing from 44-HEI registry
    const optimalResult = findOptimalHeiForTicket(filingLat, filingLng, filingCategory, filingDistrict);
    const winnerHei = optimalResult.winner;
    const deptName = winnerHei.departments[0]?.name || 'Department of Technology & Engineering Solutions';
    const facultyMentor = `Prof. ${winnerHei.name.split(' ')[0]} (Faculty Coordinator)`;

    const newTicket: ProblemTicket = {
      id: 'tkt-' + Date.now(),
      ticketCode,
      title: `${filingCategory.replace(/_/g, ' ')} Issue in ${filingVillage}`,
      description: filingDescription || `Citizen reported civic challenge regarding ${filingCategory} in ${filingVillage}, ${filingDistrict}.`,
      category: filingCategory,
      urgency: 'HIGH',
      status: 'AI_VERIFIED',
      latitude: filingLat,
      longitude: filingLng,
      district: filingDistrict,
      village: filingVillage,
      reporterName: 'Citizen (Sahayak AI Reporter)',
      reporterPhone: '+91 94311 82910',
      reportedAt: new Date().toISOString(),
      imageUrls: [filingPhoto],
      aiVerification: {
        confidence: 0.94,
        detectedObjects: [
          { label: 'Ground Infrastructure Anomaly', confidence: 0.96 },
          { label: 'Verified Low-Bandwidth GPS Fix', confidence: 0.93 },
        ],
        severityScore: 0.88,
      },
      assignedHei: {
        id: winnerHei.id,
        name: winnerHei.name,
        code: winnerHei.code,
        department: deptName,
        facultyMentor,
        distanceKm: Math.round(winnerHei.distanceKm),
        utilityScore: winnerHei.utilityScore,
        routingReason: `Autonomous 44-HEI institutional match for ${filingDistrict} (${winnerHei.distanceKm} km away) with specialization in ${filingCategory.replace(/_/g, ' ')}.`,
      },
    };

    // Notify JoharSetu global state
    if (onNewTicket) {
      onNewTicket(newTicket);
    }

    // Try posting to friend backend if alive
    try {
      await fetch(API_ENDPOINTS.chatChallenges, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTicket.title,
          description: newTicket.description,
          district: newTicket.district,
          state: 'Jharkhand',
          category: newTicket.category,
          village: newTicket.village,
          latitude: newTicket.latitude,
          longitude: newTicket.longitude,
          source: 'Sahayak_Chatbot_Wizard',
        }),
      });
    } catch {}

    setIsSubmittingTicket(false);
    setIsFilingMode(false);
    setFilingStep(1);

    // Append congratulatory message in chat
    setMessages((prev) => [
      ...prev,
      {
        id: 'ticket-created-' + Date.now(),
        sender: 'bot',
        text:
          `🎉 **Complain Successfully Registered!**\n\n` +
          `**Ticket Code:** \`${ticketCode}\`\n` +
          `**Category:** ${filingCategory.replace(/_/g, ' ')}\n` +
          `**Location:** ${filingVillage}, ${filingDistrict}\n` +
          `**Assigned HEI:** ${winnerHei.name} (${winnerHei.distanceKm} km away)\n` +
          `**NEP 2020 Capstone Value:** 4 Credits for solving student team.\n\n` +
          `A physical inspection team and engineering mentors have been alerted. You can track this ticket on the Citizen Portal or Regional Map at any time!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        autoCreatedChallenge: {
          id: newTicket.id,
          title: newTicket.title,
          status: 'AI_VERIFIED',
        },
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = (textToSend || inputText).trim();
    if (!rawText || isLoading) return;

    if (rawText === '__START_FILING__') {
      setIsFilingMode(true);
      setFilingStep(1);
      return;
    }

    const userMessageId = 'msg-' + Date.now();
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: rawText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.chatMessage, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: rawText,
          sessionId: sessionId || 'default_session',
          district: 'Ranchi',
          language: chatLanguage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMessage: ChatMessage = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: data.reply || 'Thank you for reaching out. How else may I assist you?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          autoCreatedChallenge: data.autoCreatedChallenge || null,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('Server returned non-200');
      }
    } catch (err) {
      // Graceful local fallback in active language
      const lower = rawText.toLowerCase();
      let reply =
        'Thank you for reaching out to **Sahayak AI**. How may I assist you further with JoharSetu civic challenges?';

      if (
        lower.includes('पानी') ||
        lower.includes('water') ||
        lower.includes('paani') ||
        lower.includes('दाः') ||
        lower.includes('ᱫᱟᱜ')
      ) {
        reply = activeConfig.fallbackWater;
      } else if (
        lower.includes('nep') ||
        lower.includes('credit') ||
        lower.includes('क्रेडिट') ||
        lower.includes('ᱠᱨᱮᱰᱤᱴ')
      ) {
        reply = activeConfig.fallbackNep;
      } else if (
        lower.includes('road') ||
        lower.includes('सड़क') ||
        lower.includes('होरा') ||
        lower.includes('ᱦᱚᱨ') ||
        lower.includes('puliya')
      ) {
        reply = activeConfig.fallbackRoad;
      } else {
        reply = activeConfig.greeting;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-terracotta to-sand text-white font-bold text-xs sm:text-sm shadow-floating hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group border border-white/20"
          aria-label="Open Sahayak AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
          </div>
          <span>सहायक AI</span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] uppercase tracking-wider font-semibold">
            {activeConfig.label}
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] max-w-sm sm:w-[410px] h-[580px] max-h-[85vh] bg-surface rounded-3xl border border-terracotta-200/80 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Main Top Header */}
          <div className="bg-gradient-to-r from-terracotta via-terracotta-600 to-sand p-3.5 sm:p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-bold text-sm shadow-inner ring-1 ring-white/30">
                <span>स</span>
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5 leading-tight">
                  <span>Sahayak AI</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-medium">
                    सहायक
                  </span>
                </h3>
                <p className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Multilingual Civic Assistant</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsFilingMode((prev) => !prev);
                  setFilingStep(1);
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  isFilingMode
                    ? 'bg-white text-terracotta'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
                title="Toggle AI Guided Complaint Filing Wizard"
              >
                <FileText className="w-3 h-3" />
                <span>{isFilingMode ? 'Exit Wizard' : '📝 File Ticket'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Language Preference Bar */}
          <div className="bg-terracotta-900 px-3 py-1.5 flex items-center justify-between text-[11px] text-white/95 border-b border-white/10 shadow-xs">
            <span className="font-semibold flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-sand-300" />
              <span>Language / भाषा:</span>
            </span>
            <select
              value={chatLanguage}
              onChange={(e) => handleLanguageChange(e.target.value as ChatLangCode)}
              className="bg-black/40 text-white font-medium rounded-lg px-2 py-0.5 outline-none border border-white/25 text-[10px] cursor-pointer hover:bg-black/50 transition-colors"
            >
              <option value="hinglish" className="bg-charcoal text-white">Hinglish (हिंदी/English)</option>
              <option value="english" className="bg-charcoal text-white">English</option>
              <option value="hindi" className="bg-charcoal text-white">हिन्दी (Hindi)</option>
              <option value="mundari" className="bg-charcoal text-white">मुंडारी (Mundari)</option>
              <option value="santhali" className="bg-charcoal text-white">ᱥᱟᱱᱛᱟᱲᱤ (Santhali)</option>
              <option value="ho" className="bg-charcoal text-white">𑢹𑣉 (Ho / हो भाषा)</option>
            </select>
          </div>

          {/* AI-Assisted Conversational Filing Wizard Screen */}
          {isFilingMode ? (
            <div className="flex-1 flex flex-col bg-canvas p-3.5 sm:p-4 overflow-y-auto space-y-3">
              {/* Wizard Step Progress Ribbon */}
              <div className="bg-sand-100 p-2.5 rounded-2xl border border-sand-300">
                <div className="flex items-center justify-between text-[11px] font-bold text-charcoal mb-1.5">
                  <span className="flex items-center gap-1.5 text-terracotta">
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>AI Guided Problem Filing</span>
                  </span>
                  <span className="text-sand-800">Step {filingStep} of 5</span>
                </div>
                <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-terracotta transition-all duration-300"
                    style={{ width: `${(filingStep / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step 1: Select Category */}
              {filingStep === 1 && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  <div className="bg-surface p-3 rounded-2xl border border-charcoal-border/40">
                    <p className="text-xs font-bold text-charcoal mb-1">
                      1. What type of community problem are you reporting?
                    </p>
                    <p className="text-[11px] text-charcoal-muted">
                      Tap once to choose category. We will route it to the best engineering department.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { cat: 'WATER_MANAGEMENT', label: '💧 Drinking Water', desc: 'Handpumps, water contamination, ponds' },
                      { cat: 'ROAD_INFRASTRUCTURE', label: '🛣️ Roads & Bridges', desc: 'Culverts, potholes, monsoon damage' },
                      { cat: 'RURAL_ELECTRIFICATION_SOLAR', label: '⚡ Solar Microgrid', desc: 'Streetlights, inverters, power cuts' },
                      { cat: 'SUSTAINABLE_AGRICULTURE', label: '🌾 Agriculture', desc: 'Irrigation canals, crop disease' },
                      { cat: 'HEALTHCARE_DELIVERY', label: '🏥 Healthcare', desc: 'Health sub-centers, electricity/water' },
                      { cat: 'SANITATION_WASTE', label: '♻️ Sanitation', desc: 'Drainage, waste pits, hygiene' },
                    ].map((item) => (
                      <button
                        key={item.cat}
                        type="button"
                        onClick={() => handleSelectFilingCategory(item.cat as TicketCategory)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between ${
                          filingCategory === item.cat
                            ? 'bg-terracotta-50 border-terracotta shadow-xs'
                            : 'bg-surface border-charcoal-border/50 hover:bg-canvas-subtle'
                        }`}
                      >
                        <span className="text-xs font-bold text-charcoal">{item.label}</span>
                        <span className="text-[10px] text-charcoal-muted mt-1 leading-snug">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {filingStep === 2 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="bg-surface p-3 rounded-2xl border border-charcoal-border/40">
                    <p className="text-xs font-bold text-charcoal mb-1">
                      2. Where is this problem located in Jharkhand?
                    </p>
                    <p className="text-[11px] text-charcoal-muted">
                      Auto-detect with device GPS or pick your district below.
                    </p>
                  </div>

                  {/* GPS Auto Detect */}
                  <button
                    type="button"
                    onClick={handleCaptureGps}
                    disabled={isLocatingGps}
                    className="w-full p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-100 transition-colors"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${isLocatingGps ? 'animate-spin' : ''}`} />
                    <span>
                      {isLocatingGps
                        ? 'Acquiring GPS Satellite Lock...'
                        : `📍 GPS Auto-Fix: ${filingLat.toFixed(3)}, ${filingLng.toFixed(3)}`}
                    </span>
                  </button>

                  <div>
                    <label className="text-[11px] font-bold text-charcoal block mb-1">Village / Tola / Block</label>
                    <input
                      type="text"
                      value={filingVillage}
                      onChange={(e) => setFilingVillage(e.target.value)}
                      placeholder="e.g., Baghmara Block, Tola 4"
                      className="w-full px-3 py-2 rounded-xl border border-charcoal-border text-xs bg-surface"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-charcoal block mb-1">Choose District</label>
                    <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {JHARKHAND_DISTRICTS.slice(0, 15).map((dist) => (
                        <button
                          key={dist}
                          type="button"
                          onClick={() => handleSelectFilingDistrict(dist)}
                          className={`p-1.5 rounded-lg text-[10px] font-semibold text-center border cursor-pointer truncate ${
                            filingDistrict === dist
                              ? 'bg-terracotta text-white border-terracotta'
                              : 'bg-surface text-charcoal border-charcoal-border/40 hover:bg-terracotta-50'
                          }`}
                        >
                          {dist}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setFilingStep(1)}
                      className="px-3 py-2 rounded-xl border border-charcoal-border text-xs font-bold text-charcoal"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilingStep(3)}
                      className="flex-1 px-4 py-2 rounded-xl bg-terracotta text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Continue to Description</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Issue Description & Voice Input */}
              {filingStep === 3 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="bg-surface p-3 rounded-2xl border border-charcoal-border/40">
                    <p className="text-xs font-bold text-charcoal mb-1">
                      3. Describe what is broken or required
                    </p>
                    <p className="text-[11px] text-charcoal-muted">
                      Type in your own words or tap the microphone to speak in Hindi/English/Hinglish.
                    </p>
                  </div>

                  <div className="relative">
                    <textarea
                      rows={3}
                      value={filingDescription}
                      onChange={(e) => setFilingDescription(e.target.value)}
                      placeholder="e.g., The village handpump lever is broken and contaminated reddish muddy water has been coming out for 5 days..."
                      className="w-full p-3 rounded-xl border border-charcoal-border text-xs bg-surface resize-none focus:border-terracotta outline-none"
                    />

                    <button
                      type="button"
                      onClick={handleToggleVoiceInput}
                      className={`absolute bottom-2.5 right-2.5 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isVoiceRecording
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-sand-100 hover:bg-sand-200 text-charcoal'
                      }`}
                      title="Voice speech-to-text"
                    >
                      {isVoiceRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{isVoiceRecording ? 'Listening...' : 'Voice Mic'}</span>
                    </button>
                  </div>

                  {/* 1-Tap Preset Descriptions */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider">Quick Suggestions:</span>
                    <div className="space-y-1.5">
                      {[
                        'Handpump is broken and pumping reddish contaminated muddy water.',
                        'Monsoon rains eroded road culvert; vehicles and school kids cannot cross.',
                        'Solar microgrid battery inverter failed; community streetlights are dark.',
                      ].map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFilingDescription(preset)}
                          className="w-full text-left p-2 rounded-lg bg-surface hover:bg-terracotta-50 border border-charcoal-border/40 text-[10px] text-charcoal transition-colors block truncate"
                        >
                          "{preset}"
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setFilingStep(2)}
                      className="px-3 py-2 rounded-xl border border-charcoal-border text-xs font-bold text-charcoal"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilingStep(4)}
                      className="flex-1 px-4 py-2 rounded-xl bg-terracotta text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Continue to Photo</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Photo Attachment */}
              {filingStep === 4 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="bg-surface p-3 rounded-2xl border border-charcoal-border/40">
                    <p className="text-xs font-bold text-charcoal mb-1">
                      4. Attach Ground Reality Photo
                    </p>
                    <p className="text-[11px] text-charcoal-muted">
                      Use the realistic category photo preset or upload a custom image.
                    </p>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-charcoal-border h-40 bg-black/5">
                    <img
                      src={filingPhoto}
                      alt="Ground reality preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                      <Camera className="w-3 h-3 text-sand-300" />
                      Attached Photo Evidence
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFilingPhoto(CATEGORY_PRESET_IMAGES[filingCategory] || CATEGORY_PRESET_IMAGES.WATER_MANAGEMENT)}
                      className="flex-1 p-2 rounded-xl bg-surface border border-charcoal-border text-[11px] font-bold text-charcoal hover:bg-sand-50 transition-colors"
                    >
                      Use Category Preset
                    </button>

                    <label className="flex-1 p-2 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-[11px] font-bold text-charcoal text-center cursor-pointer transition-colors">
                      <span>Upload Custom</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const r = new FileReader();
                            r.onload = () => setFilingPhoto(r.result as string);
                            r.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setFilingStep(3)}
                      className="px-3 py-2 rounded-xl border border-charcoal-border text-xs font-bold text-charcoal"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilingStep(5)}
                      className="flex-1 px-4 py-2 rounded-xl bg-terracotta text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Review & Submit</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {filingStep === 5 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="bg-surface p-3.5 rounded-2xl border border-charcoal-border/50 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-charcoal">Report Summary Review</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Ready to Dispatch
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <img
                        src={filingPhoto}
                        alt="Evidence"
                        className="w-16 h-16 rounded-xl object-cover border border-charcoal-border/40 shrink-0"
                      />
                      <div className="text-xs space-y-0.5">
                        <p className="font-bold text-charcoal">{filingCategory.replace(/_/g, ' ')}</p>
                        <p className="text-[11px] text-charcoal-muted">{filingVillage}, {filingDistrict}</p>
                        <p className="text-[10px] text-terracotta font-mono">
                          Coords: {filingLat.toFixed(3)}, {filingLng.toFixed(3)}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-charcoal bg-canvas p-2.5 rounded-xl border border-charcoal-border/30 line-clamp-2 leading-relaxed">
                      {filingDescription || 'Citizen ground problem report submitted.'}
                    </p>

                    {(() => {
                      const previewHei = findOptimalHeiForTicket(filingLat, filingLng, filingCategory, filingDistrict).winner;
                      return (
                        <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-[11px] space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-bold text-amber-900">
                              <Award className="w-3.5 h-3.5 text-terracotta" />
                              <span>NEP 2020 Autonomous HEI Allocation</span>
                            </div>
                            <span className="text-[10px] font-bold text-amber-700 font-mono">
                              {previewHei.distanceKm} km away
                            </span>
                          </div>
                          <p className="text-[11px] text-charcoal font-semibold">
                            Recommended: <span className="text-terracotta">{previewHei.name}</span>
                          </p>
                          <p className="text-[10px] text-charcoal-muted">
                            {previewHei.departments[0]?.name || 'Department of Applied Engineering'} • 4 Capstone Credits
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmFilingTicket}
                    disabled={isSubmittingTicket}
                    className="w-full py-3 rounded-2xl bg-terracotta hover:bg-terracotta-600 disabled:opacity-50 text-white font-bold text-xs shadow-soft flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
                  >
                    {isSubmittingTicket ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting to JoharSetu Ledger...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirm & Dispatch Ticket Now</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilingStep(4)}
                    className="w-full py-1.5 text-center text-xs font-semibold text-charcoal-muted hover:text-charcoal"
                  >
                    ← Edit Details
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Standard Interactive Chat Screen */
            <>
              {/* Quick Suggestions Pills */}
              <div className="bg-canvas-subtle px-3 py-2 border-b border-charcoal-border/30 flex gap-1.5 overflow-x-auto scrollbar-none">
                {activeConfig.prompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(item.prompt)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-surface hover:bg-terracotta/10 text-charcoal hover:text-terracotta border border-charcoal-border/50 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Message History */}
              <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-canvas text-xs leading-relaxed">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-6 h-6 rounded-full bg-terracotta text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-xs">
                        स
                      </div>
                    )}

                    <div
                      className={`max-w-[86%] rounded-2xl p-3 shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-terracotta text-white rounded-br-none'
                          : 'bg-surface text-charcoal border border-charcoal-border/50 rounded-bl-none'
                      }`}
                    >
                      <FormattedChatMessage text={msg.text} isUser={msg.sender === 'user'} />

                      {/* Auto Created Challenge Card */}
                      {msg.autoCreatedChallenge && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] space-y-1">
                          <div className="flex items-center gap-1 font-bold text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Ticket Registered in JoharSetu Ledger!</span>
                          </div>
                          <p className="font-semibold truncate">{msg.autoCreatedChallenge.title}</p>
                          <p className="text-[10px] text-emerald-700 font-mono">
                            Status: {msg.autoCreatedChallenge.status}
                          </p>
                        </div>
                      )}

                      <span
                        className={`block text-[9px] mt-1.5 ${
                          msg.sender === 'user' ? 'text-white/70 text-right' : 'text-charcoal-muted text-left'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-6 h-6 rounded-full bg-sand text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-charcoal-muted text-xs p-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-terracotta" />
                    <span>Sahayak AI is thinking ({activeConfig.label})...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-2.5 sm:p-3 bg-surface border-t border-charcoal-border/40 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={activeConfig.placeholder}
                  disabled={isLoading}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-charcoal-border/60 focus:border-terracotta outline-none text-xs bg-canvas transition-all"
                />

                <button
                  type="button"
                  onClick={handleToggleVoiceInput}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isVoiceRecording
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-sand-100 hover:bg-sand-200 text-charcoal'
                  }`}
                  title="Voice Input (Speech-to-text)"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="w-8 h-8 rounded-xl bg-terracotta hover:bg-terracotta-600 disabled:opacity-50 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
