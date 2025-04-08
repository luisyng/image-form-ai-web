export interface DataElement {
    id: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'textarea';
    name: string;
    placeholder?: string;
    required?: boolean;
    options?: SelectOption[];
    value?: any;
    alternateLabels?: string[]; // For text parsing
}

export interface FormData {
    id: string;
    name: string;
    description?: string;
    elements: DataElement[];
}

export interface SelectOption {
    value: string;
    label: string;
}