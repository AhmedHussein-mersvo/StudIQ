import axios from 'axios';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import { OPENROUTER_API_KEY } from '@env';

const OPENROUTER_MODELS = [
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'openai/gpt-oss-120b:free',
  'openai/gpt-oss-20b:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'nousresearch/hermes-3-llama-3.1-405b:free',
];

export type StudyQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export type StudyResult = {
  title: string;
  summary: string;
  keyPoints: string[];
  questions: StudyQuestion[];
};

const buildStudyPrompt = () => `
Create AI study materials from the attached document.

Return only valid JSON with this exact shape:
{
  "title": "Short lesson title",
  "summary": "Simple paragraph summary",
  "keyPoints": ["Important point 1", "Important point 2"],
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C"],
      "answer": "The correct option text"
    }
  ]
}
`;

const parseStudyResult = (content: string): StudyResult => {
  const cleanedContent = content
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const jsonStart = cleanedContent.indexOf('{');
  const jsonEnd = cleanedContent.lastIndexOf('}');

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('AI response did not include a valid JSON result.');
  }

  const jsonText = cleanedContent.slice(jsonStart, jsonEnd + 1);

  return JSON.parse(jsonText);
};

const getFileMimeType = (file: DocumentPickerResponse) => {
  if (file.type) {
    return file.type;
  }

  const fileName = file.name?.toLowerCase() ?? '';

  if (fileName.endsWith('.pdf')) {
    return 'application/pdf';
  }

  if (fileName.endsWith('.doc')) {
    return 'application/msword';
  }

  if (fileName.endsWith('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }

  if (fileName.endsWith('.ppt')) {
    return 'application/vnd.ms-powerpoint';
  }

  if (fileName.endsWith('.pptx')) {
    return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  }

  if (fileName.endsWith('.xls')) {
    return 'application/vnd.ms-excel';
  }

  if (fileName.endsWith('.xlsx')) {
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }

  return 'application/octet-stream';
};

const normalizeDataUrlMimeType = (dataUrl: string, mimeType: string) => {
  const base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
  return `data:${mimeType};base64,${base64Data}`;
};

const readFileAsDataUrl = async (file: DocumentPickerResponse) => {
  const response = await fetch(file.uri);
  const blob = await response.blob();
  const mimeType = getFileMimeType(file);

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Unable to read the uploaded file.'));
    };

    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(normalizeDataUrlMimeType(reader.result, mimeType));
        return;
      }

      reject(new Error('Unable to encode the uploaded file.'));
    };

    reader.readAsDataURL(blob);
  });
};

const assertOpenRouterApiKey = () => {
  if (!OPENROUTER_API_KEY?.trim()) {
    throw new Error(
      'OpenRouter API key is missing. Add OPENROUTER_API_KEY to .env, restart Metro with --reset-cache, then rebuild the app.',
    );
  }
};

const getOpenRouterErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.error?.message;

    if (typeof responseMessage === 'string') {
      if (/user not found/i.test(responseMessage)) {
        return 'Invalid OpenRouter API key. Check OPENROUTER_API_KEY in .env, restart Metro with --reset-cache, then rebuild the app.';
      }

      return responseMessage;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to generate study materials from this file.';
};

export const generateSummary = async (
  file: DocumentPickerResponse,
): Promise<StudyResult> => {
  try {
    assertOpenRouterApiKey();
    const fileData = await readFileAsDataUrl(file);
    let lastError: unknown;

    for (const model of OPENROUTER_MODELS) {
      try {
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: buildStudyPrompt(),
                  },
                  {
                    type: 'file',
                    file: {
                      filename: file.name ?? 'study-document',
                      file_data: fileData,
                    },
                  },
                ],
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const content = response.data.choices[0].message.content;
        return parseStudyResult(content);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  } catch (error) {
    throw new Error(getOpenRouterErrorMessage(error));
  }
};
