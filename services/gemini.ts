
import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse } from "../types";

// 确保在 process 不存在时不会抛出 ReferenceError
const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const getAiNarration = async (
  rollTotal: number, 
  diceCount: number,
  previousScore: number, 
  isVictory: boolean
): Promise<AiResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `用户刚刚掷出了 ${diceCount} 个骰子，总和为 ${rollTotal}。
      当前游戏状态：累计得分 ${previousScore + rollTotal}。
      请作为一个毒舌但幽默的“骰子大师”给予评论。
      回复语言必须是中文。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING, description: "AI 的解说词" },
            mood: { 
              type: Type.STRING, 
              enum: ["happy", "taunting", "impressed", "neutral"],
              description: "AI 的情绪状态" 
            }
          },
          required: ["message", "mood"]
        }
      }
    });

    return JSON.parse(response.text) as AiResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      message: `你掷出了 ${rollTotal}！`,
      mood: "neutral"
    };
  }
};
