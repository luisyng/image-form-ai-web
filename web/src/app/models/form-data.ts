export interface DataElement {
    id: string;
    name: string;
    description?: string;
    type: 'text' | 'number' | 'boolean' | 'select';
    value?: any;
    options?: any[];
    required: boolean;
}

export interface FormData {
    id: string;
    name: string;
    description?: string;
    elements: DataElement[];
}