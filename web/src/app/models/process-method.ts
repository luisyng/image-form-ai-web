import { Selectable } from "./selectable";

export interface ProcessMethod extends Selectable {
    inputType: string;
    outputType: string;
}

export const processMethods: ProcessMethod[] = [
    {
        id: 'ai-image-to-json',
        name: 'AI: image to form data',
        description: 'Use a multi-modal LLM to convert the image to our form data. Model: OpenAI GPT-4o mini.',
        icon: '🤖',
        inputType: 'photo',
        outputType: 'JSON'
    },
    {
        id: 'ai-audio-transcription',
        name: 'AI: audio to text',
        description: 'Use an AI to transcribe the audio. Model: OpenAI Whisper.',
        icon: '🤖',
        inputType: 'audio',
        outputType: 'text'
    },
    {
        id: 'ai-text-to-json',
        name: 'AI: text to form data',
        description: 'Use a multi-modal LLM to convert the text to our form data. Model: OpenAI GPT-4o mini.',
        icon: '🤖',
        inputType: 'text',
        outputType: 'JSON'
    },
    {
        id: 'ocr',
        name: 'OCR: image to text',
        description: 'Process the image locally on your device. Library: Tesseract OCR.',
        icon: '💻',
        inputType: 'photo',
        outputType: 'text'
    },
    {
        id: 'parsing',
        name: 'Old School Parsing',
        description: 'Parse the text to extract the data.',
        icon: '💻',
        inputType: 'text',
        outputType: 'JSON'
    },
];

export function getProcessMethodsForType(inputTypeId: string): ProcessMethod[] {
    return processMethods.filter(method => method.inputType === inputTypeId);
  } 