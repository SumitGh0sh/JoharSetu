const { generateAIResponse } = require('../../../config/ai');

/**
 * Chatbot Node 3: Conversational Response & Ticket Extractor
 */
const responseNode = async (state) => {
  const { userMessage, history, intent, retrievedContext, district, language = 'hinglish' } = state;

  const langKey = (language || 'hinglish').toLowerCase();
  let langGuideline = '';

  if (langKey === 'hinglish') {
    langGuideline = `MANDATORY LANGUAGE: HINGLISH (Hindi spoken in everyday conversation, written in the Roman/English alphabet).
Example tone: "Johar! Main Sahayak AI hoon. Aap Jharkhand portal par road, pani, bijli ya school ki samasya report kar sakte hain. Aapki kya problem hai?"
CRITICAL: Do NOT write in Devanagari script. Use Roman/English characters with natural colloquial Hindi words.`;
  } else if (langKey === 'en' || langKey === 'english') {
    langGuideline = `MANDATORY LANGUAGE: ENGLISH.
Example tone: "Johar! I am Sahayak AI, your assistant for the Jharkhand Higher & Technical Education Problem Solving Portal. How can I assist you with civic complaints or student project credits?"
CRITICAL: Respond entirely in clear, friendly English.`;
  } else if (langKey === 'hi' || langKey === 'hindi') {
    langGuideline = `MANDATORY LANGUAGE: PURE HINDI (हिन्दी in Devanagari script).
Example tone: "जोहार! मैं सहायक AI हूँ। मैं झारखंड उच्च एवं तकनीकी शिक्षा समस्या समाधान पोर्टल से आपकी सहायता के लिए उपस्थित हूँ। आप सड़क, पानी, बिजली या किसी भी नागरिक समस्या के बारे में बता सकते हैं।"
CRITICAL: Write in proper Hindi with Devanagari script.`;
  } else if (langKey === 'mun' || langKey === 'mundari') {
    langGuideline = `MANDATORY LANGUAGE: MUNDARI (मुंडारी / Mundari).
Use authentic Mundari tribal language words common in Ranchi, Khunti, and West Singhbhum.
Example tone: "जोहार! अञ सहायक AI तनाञ। आतु रेयाः चापाकल, दाः, होरा या बिजली रेयाः समस्या काजी दाइयापे। अञ विश्वविद्यालय आर छात्र-को लेकाते समस्या समाधान रे मदद इञ एमापेया।"
You may write in Devanagari or Latin script with common Mundari phrasing.`;
  } else if (langKey === 'sat' || langKey === 'santhali' || langKey === 'santali') {
    langGuideline = `MANDATORY LANGUAGE: SANTHALI (Santali / ᱥᱟᱱᱛᱟᱲᱤ).
Use natural Santali phrasing commonly understood across Jharkhand (Santhal Parganas, Kolhan).
Example tone: "Johar! Ing do Sahayak AI kanaing. Jharkhand portal re atu renah handpump, dah, hor se bijli somosa laime. Ing aam puro goro emama."
Write in Latin/English characters for smooth readability (or concise Ol Chiki: ᱡᱚᱦᱟᱨ! ᱤᱧᱫᱚ ᱥᱟᱦᱟᱭᱚᱠ AI ᱠᱟᱹᱱᱟᱹᱧ ᱾). Do not repeat glyphs.`;
  } else if (langKey === 'ho') {
    langGuideline = `MANDATORY LANGUAGE: HO (𑢹𑣉 / हो भाषा).
Use authentic Ho indigenous language spoken in Kolhan (Chaibasa, East/West Singhbhum, Saraikela).
Example tone: "जोहार! अयं सहायक AI तनां। हातु रेयाः दाः, होरा, बिजली रेयाः गोहड़ा काजी दाइयेपे। कोल्हान विश्वविद्यालय आर इन्जीनियरिङ छात्र-को अमुवाः समस्या समाधान रे गोड़ोको एमा।"
You may write in Devanagari or Latin/Warang Chiti script with respectful Ho tribal vocabulary.`;
  } else {
    langGuideline = `MANDATORY LANGUAGE: Match user's preferred language (${language}). Greet with 'Johar!' and be warmly conversational.`;
  }

  const systemPrompt = `You are 'Sahayak AI' (सहायक AI), the official intelligent civic assistant of Jharkhand Higher & Technical Education Problem Solving Portal (SIH26043).
Current District: ${district || 'Ranchi'}

${langGuideline}

Capabilities:
1. If intent is FILE_COMPLAINT:
   - Politely ask for missing details (exact village/ward, nature of issue, severity).
   - If user provided enough details, summarize the complaint and let them know it is logged for university assignment.
2. If intent is CHECK_STATUS:
   - Ask for their Ticket ID (e.g., JH-XXXX) or district if not provided.
3. If intent is ASK_GUIDELINES:
   - Explain how students and universities solve citizen problems under NEP 2020 experiential learning.
4. If GENERAL_CHAT:
   - Greet warmly and explain what you can help with in the required language.

Context from Knowledge Base:
${retrievedContext || 'No additional knowledge base context needed.'}

Previous conversation history:
${history.map((m) => `${m.role === 'user' ? 'User' : 'Sahayak'}: ${m.content}`).join('\n')}

Generate a helpful, friendly response strictly following the mandatory language specified above.
If the user provided a full complaint with clear issue + location, append a JSON block at the very end formatted as:
\`\`\`json
{
  "isComplaintReady": true,
  "extractedTitle": "...",
  "extractedDescription": "...",
  "extractedDistrict": "..."
}
\`\`\`
Otherwise, just respond conversationally without the json block.`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: userMessage },
    ];

    const reply = await generateAIResponse(messages, { temperature: 0.4 });

    // Check if JSON block was included for complaint readiness
    let complaintData = null;
    const jsonMatch = reply.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        complaintData = JSON.parse(jsonMatch[1]);
      } catch {}
    }

    const cleanReply = reply.replace(/```json[\s\S]*?```/, '').trim();

    return {
      botReply: cleanReply,
      complaintData,
      steps: [`[Chatbot Response] Generated reply in ${langKey}. Complaint ready: ${!!complaintData?.isComplaintReady}`],
    };
  } catch (err) {
    const fallbackReplies = {
      hinglish: 'Johar! Main Sahayak AI hoon. Aap Jharkhand portal par apni samasya batayein, main poori madad karunga.',
      english: 'Johar! I am Sahayak AI. Please tell me about your civic issue or query, and I will assist you right away.',
      hi: 'नमस्ते! मैं सहायक AI हूँ। कृपया झारखंड पोर्टल पर अपनी नागरिक समस्या बताएं, मैं आपकी पूरी सहायता करूँगा।',
      hindi: 'नमस्ते! मैं सहायक AI हूँ। कृपया झारखंड पोर्टल पर अपनी नागरिक समस्या बताएं, मैं आपकी पूरी सहायता करूँगा।',
      mun: 'जोहार! अञ सहायक AI तनाञ। आतु रेयाः समस्या काजी दाइयापे, अञ पूरा मदद इञ एमापेया।',
      mundari: 'जोहार! अञ सहायक AI तनाञ। आतु रेयाः समस्या काजी दाइयापे, अञ पूरा मदद इञ एमापेया।',
      sat: 'ᱡᱚᱦᱟᱨ! ᱤᱧᱫᱚ ᱥᱟᱦᱟᱭᱚᱠ AI ᱠᱟᱹᱱᱟᱹᱧ ᱾ ᱟᱹᱛᱩ ᱨᱮᱱᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱞᱟᱹᱭ ᱢᱮ, ᱤᱧ ᱜᱚᱲᱚ ᱮᱢᱟᱢᱟ ᱾',
      santhali: 'ᱡᱚᱦᱟᱨ! ᱤᱧᱫᱚ ᱥᱟᱦᱟᱭᱚᱠ AI ᱠᱟᱹᱱᱟᱹᱧ ᱾ ᱟᱹᱛᱩ ᱨᱮᱱᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱞᱟᱹᱭ ᱢᱮ, ᱤᱧ ᱜᱚᱲᱚ ᱮᱢᱟᱢᱟ ᱾',
      ho: 'जोहार! अयं सहायक AI तनां। हातु रेयाः गोहड़ा काजी दाइयेपे, अयं गोड़ो इञ एमापेया।',
    };

    return {
      botReply: fallbackReplies[langKey] || fallbackReplies.hinglish,
      complaintData: null,
      steps: [`[Chatbot Response] Fallback reply generated for ${langKey}`],
    };
  }
};

module.exports = responseNode;
