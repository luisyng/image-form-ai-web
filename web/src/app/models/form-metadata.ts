export interface DataElement {
    id: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'textarea';
    name: string;
    placeholder?: string;
    required?: boolean;
    options?: SelectOption[];
    defaultValue?: any;
    alternateLabels?: string[]; // For text parsing
}

export interface FormMetadata {
    id: string;
    name: string;
    description?: string;
    elements: DataElement[];
}

export interface SelectOption {
    value: string;
    label: string;
}