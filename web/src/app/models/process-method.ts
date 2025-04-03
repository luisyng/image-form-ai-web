export interface ProcessMethod {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export const processMethods: ProcessMethod[] = [
    {
        id: 'ocr',
        name: 'Local image processing',
        description: 'Process the image locally on your device. Faster but may be less accurate for complex forms.',
        icon: '💻'
    },
    {
        id: 'llm',
        name: 'Send to LLM',
        description: 'Send the image to a Large Language Model for processing. More accurate but requires internet connection and may take longer and cost money.',
        icon: '🤖'
    }
];