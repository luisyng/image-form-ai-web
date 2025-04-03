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
    description: 'Fill out a form manually'
  },
  
  // Methods for photo input
  {
    id: 'camera',
    name: 'Take Photo',
    icon: '📸',
    forInputType: 'photo',
    description: 'Use your camera to take a photo'
  },
  {
    id: 'upload-photo',
    name: 'Upload Photo',
    icon: '🖼️',
    forInputType: 'photo',
    description: 'Upload an existing photo'
  },
  
  // Methods for audio input
  {
    id: 'microphone',
    name: 'Record Audio',
    icon: '🎙️',
    forInputType: 'audio',
    description: 'Use your microphone to record audio'
  },
  {
    id: 'upload-audio',
    name: 'Upload Audio',
    icon: '🔊',
    forInputType: 'audio',
    description: 'Upload an existing audio file'
  }
];

export function getMethodsForInputType(inputTypeId: string): InputMethod[] {
  return inputMethods.filter(method => method.forInputType === inputTypeId);
} 