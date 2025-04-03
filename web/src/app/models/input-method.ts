export interface InputMethod {
  id: string;
  name: string;
  icon: string;
  forInputType: string;
  description?: string;
}

export const inputMethods: InputMethod[] = [
  // Methods for manual input
  {
    id: 'form',
    name: 'Form',
    icon: '📝',
    forInputType: 'manual',
  },
  
  // Methods for photo input
  {
    id: 'camera',
    name: 'Take Photo',
    icon: '📸',
    forInputType: 'photo',
  },
  {
    id: 'upload-photo',
    name: 'Upload Photo',
    icon: '📂',
    forInputType: 'photo',
  },
  
  // Methods for audio input
  {
    id: 'microphone',
    name: 'Record Audio',
    icon: '🎙️',
    forInputType: 'audio',
  },
  {
    id: 'upload-audio',
    name: 'Upload Audio',
    icon: '📂',
    forInputType: 'audio',
  }
];

export function getMethodsForInputType(inputTypeId: string): InputMethod[] {
  return inputMethods.filter(method => method.forInputType === inputTypeId);
} 