
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponseData } from '../types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const fileToGenerativePart = async (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('ファイルサイズは10MBを超えることはできません。');
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('対応しているファイル形式はJPEG, PNG, WebPのみです。');
  }

  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data,
      mimeType: file.type,
    },
  };
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    extractedText: {
      type: Type.STRING,
      description: "画像から抽出された全ての日本語テキスト。改行もそのまま含めてください。",
    },
    summary: {
      type: Type.STRING,
      description: "抽出されたテキストを元の30-50%程度の長さに要約したもの。",
    },
    praisePoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "文章の良い点や褒めるべき点を2〜3個、箇条書きにしたリスト。",
    },
    improvementPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "文章をより良くするための改善提案を2〜3個、優しく箇条書きにしたリスト。",
    },
  },
  required: ["extractedText", "summary", "praisePoints", "improvementPoints"],
};

const prompt = `
添付された画像を分析し、以下のタスクを実行して、指定されたJSON形式で出力を提供してください。
1. **OCR**: 画像からすべての日本語テキストを抽出します。元のテキストの改行は維持してください。
2. **要約**: 抽出したテキストを、主要なポイントを保持しつつ、元の長さの約30〜50%に要約してください。
3. **フィードバック**: テキストを分析し、建設的なフィードバックを提供してください。
   - **褒めポイント (praisePoints)**: 優れた構成、明確な表現、説得力のある点など、少なくとも2つの肯定的な側面を特定してください。
   - **改善ポイント (improvementPoints)**: 誤字脱字の可能性、より明確な表現、構成の改善案など、2つ以上の改善点を優しく提案してください。提案は前向きな形で表現してください。
`;

export const processImageWithGemini = async (file: File): Promise<GeminiResponseData> => {
  try {
    const imagePart = await fileToGenerativePart(file);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const jsonString = response.text.trim();
    const parsedData: GeminiResponseData = JSON.parse(jsonString);
    return parsedData;

  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error instanceof Error) {
      throw new Error(`AIの処理中にエラーが発生しました: ${error.message}`);
    }
    throw new Error('AIの処理中に不明なエラーが発生しました。');
  }
};
