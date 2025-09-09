
export interface GeminiResponseData {
  extractedText: string;
  summary: string;
  praisePoints: string[];
  improvementPoints: string[];
}

export type ProcessStatus = 'pending' | 'processing' | 'success' | 'error';

export interface ProcessResult {
  id: string;
  fileName: string;
  status: ProcessStatus;
  data?: GeminiResponseData;
  error?: string;
}
