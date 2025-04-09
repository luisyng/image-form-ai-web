export type ValueType = 'TEXT' | 'INTEGER_ZERO_OR_POSITIVE' | 'AGE' | 'DATE' | 'BOOLEAN';

export interface DataElement {
    id: string;
    type: ValueType;
    name: string;
    placeholder?: string;
    required?: boolean;
    options?: SelectOption[];
    defaultValue?: any;
    alternateLabels?: string[]; // For text parsing
}

export interface FormMetadata {
    id: string;
    programId: string;
    name: string;
    description?: string;
    elements: DataElement[];
}

export interface SelectOption {
    value: string;
    label: string;
}