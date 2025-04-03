import { Selectable } from "./selectable";

export interface InputType extends Selectable {
}

export const inputTypes: InputType[] = [
    {
      id: 'manual',
      name: 'Manual',
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
    },
];