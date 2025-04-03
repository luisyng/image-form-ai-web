export interface InputType {
    id: string;
    name: string;
    icon: string;
}

export const inputTypes: InputType[] = [
    {
      id: 'manual',
      name: 'Manual Entry',
      icon: '✏️'
    },
    {
      id: 'image',
      name: 'Upload Photo',
      icon: '🖼️',
    },
    {
      id: 'camera',
      name: 'Take Photo',
      icon: '📷',
    },
    {
      id: 'audio',
      name: 'Record Audio',
      icon: '🎤',
    }
];