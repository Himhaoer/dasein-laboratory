import { GoogleGenAI, Type } from "@google/genai";
import { TheaterAnalysis, Language, Signifier, NarrativeEvent } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- SYSTEM INSTRUCTIONS ---

const getMirrorSystemInstruction = (lang: Language) => `
You are Dasein, the "Sublime Mirror".
Role: A Psychoanalytic Observer (Lacanian/Existentialist).
Task: Engage in a dialogue to help the user articulate their stream of consciousness.
Style: 
- Brief, probing, profound.
- Do not solve problems. Ask about the *desire* behind the problem.
- Do not judge. Mirror the structure of their language.
Language: ${lang === 'zh' ? 'Chinese (Simplified)' : 'English'}.
`;

// --- CHAT SERVICE ---

export const streamChatResponse = async function* (
  history: { role: string; content: string }[], 
  message: string, 
  language: Language
) {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: getMirrorSystemInstruction(language),
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    yield language === 'zh' 
      ? "连接中断。" 
      : "Connection lost.";
  }
};

// --- THEATER ANALYSIS SERVICE ---

export const analyzeConflict = async (dilemma: string, language: Language): Promise<TheaterAnalysis> => {
  try {
    const prompt = `
      Analyze this narrative structure: "${dilemma}".
      Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}.
      
      Identify:
      1. Id Voice (Impulse/Avoidance)
      2. Superego Voice (Mandate/Guilt)
      3. The Symptom (The repetitive knot/pattern)
      4. Authorship (The structural/environmental shift needed)
      5. Emotional State
      
      Return strictly JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            idVoice: { type: Type.STRING },
            superegoVoice: { type: Type.STRING },
            symptom: { type: Type.STRING },
            authorship: { type: Type.STRING },
            emotionalState: { type: Type.STRING }
          },
          required: ["idVoice", "superegoVoice", "symptom", "authorship", "emotionalState"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");
    return JSON.parse(text) as TheaterAnalysis;

  } catch (error) {
    console.error("Theater Error:", error);
    return {
      idVoice: "Error", superegoVoice: "Error", symptom: "Error", authorship: "Error", emotionalState: "Error"
    };
  }
};

// --- CONSTELLATION SERVICE (THE CONNECTIVE TISSUE) ---

export const generateConstellationFromHistory = async (
  history: NarrativeEvent[], 
  language: Language
): Promise<Signifier[]> => {
  
  if (history.length === 0) return [];

  // 1. Serialize History for the AI
  const context = history.map(e => {
    if (e.type === 'log_entry') return `[LOG]: ${e.content}`;
    if (e.type === 'tension_analysis') {
      const data = e.content as TheaterAnalysis;
      return `[ANALYSIS]: Symptom: ${data.symptom}, Knot: ${data.idVoice} vs ${data.superegoVoice}`;
    }
    return '';
  }).join('\n');

  // 2. The "Old Teacher" Prompt
  const prompt = `
    Act as the "Old Teacher" (Sublime Mirror).
    Review the user's Narrative History below. 
    Extract 5-7 "Signifiers" (Master Signifiers/Core Themes) that govern their current life structure.
    
    Target Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}.
    
    For each signifier:
    - 'text': The keyword (e.g. "Control", "Father", "Void").
    - 'insight': A profound, non-judgmental observation linking their logs/analyses to this theme.
    - 'weight': 1 (minor) to 3 (major core theme).
    
    History:
    ${context.substring(0, 10000)} // Limit context window if necessary
  `;

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              insight: { type: Type.STRING },
              weight: { type: Type.NUMBER }
            },
            required: ["text", "insight", "weight"]
          }
        }
      }
    });
    
    const data = JSON.parse(response.text || "[]");
    
    // Position logic: We still randomize positions visually, but the CONTENT is now grounded in reality.
    // In a future version, position could imply semantic distance.
    return data.map((item: any, index: number) => ({
        id: `sig-${Date.now()}-${index}`,
        text: item.text,
        insight: item.insight,
        weight: item.weight,
        x: 15 + Math.random() * 70, 
        y: 15 + Math.random() * 70
    }));

  } catch (e) {
    console.error("Constellation Error:", e);
    return [];
  }
};
