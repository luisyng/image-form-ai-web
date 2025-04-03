export interface InputType {
    id: string;
    name: string;
    icon: string;
}

export const inputTypes: InputType[] = [
    {
      id: 'manual',
      name: 'Manual Entry',
      icon: '✏️',
    },
    {
      id: 'photo',
      name: 'Photo',
      icon: '📷',
    },
    {
      id: 'audio',
      name: 'Audio',
      icon: '🎤',
    }
];