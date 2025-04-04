import { Selectable } from "./selectable";

export interface ProcessMethod extends Selectable {
    forInputType: string;
}

export const processMethods: ProcessMethod[] = [
    {
        id: 'ocr',
        name: 'Local image processing',
        description: 'Process the image locally on your device. Faster but may be less accurate for complex forms.',
        icon: '💻',
        forInputType: 'photo'
    },
    {
        id: 'llm',
        name: 'Send to LLM',
        description: 'Send the image to a Large Language Model for processing. More accurate but requires internet connection and may take longer and cost money.',
        icon: '🤖',
        forInputType: 'photo'
    },
    {
        id: 'llm',
        name: 'Send to LLM',
        description: 'Send the audio to a Large Language Model for processing.',
        icon: '🤖',
        forInputType: 'audio'
    }
];

export function getProcessMethodsForType(inputTypeId: string): ProcessMethod[] {
    return processMethods.filter(method => method.forInputType === inputTypeId);
  } 