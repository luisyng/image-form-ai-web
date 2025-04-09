import { FormMetadata } from "./form-metadata";
import { FormType } from "./form-type";

export const malariaFormData: FormMetadata = {
    id: 'malaria',
    name: 'Malaria',
    description: 'Malaria symptoms form',
    elements: [
        {
            id: 'name',
            name: 'Patient Name',
            type: 'TEXT',
            required: true,
            alternateLabels: ['name', 'patient', 'patient name']
        },
        {
            id: 'age',
            name: 'Age',
            type: 'AGE',
            required: true
        },
        {
            id: 'gender',
            name: 'Gender',
            type: 'TEXT',
            required: false,
            options: [
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' }
            ]
        },
        {
            id: 'fever',
            name: 'Fever',
            type: 'BOOLEAN',
            defaultValue: false,
            required: true
        },
        {
            id: 'chills',
            name: 'Chills',
            type: 'BOOLEAN',    
            defaultValue: false,
            required: true
        },
        {
            id: 'sweating',
            name: 'Sweating',
            type: 'BOOLEAN',
            defaultValue: false,
            required: true
        },
        {
            id: 'headache',
            name: 'Headache',
            type: 'BOOLEAN',
            defaultValue: false,
            required: true
        },
        {
            id: 'nausea',
            name: 'Nausea',
            type: 'BOOLEAN',
            defaultValue: false,
            required: true
        },
        {
            id: 'vomiting',
            name: 'Vomiting',
            type: 'BOOLEAN',
            defaultValue: false,
            required: true
        },
        {
            id: 'musclePain',
            name: 'Muscle Pain',
            type: 'BOOLEAN',
            defaultValue: false,
            required: true
        },
        {
            id: 'fatigue',
            name: 'Fatigue',
            type: 'BOOLEAN',
            defaultValue: false,
            required: true
        },
        {
            id: 'otherSymptoms',
            name: 'Other Symptoms',
            type: 'TEXT',
            required: false
        }
    ]
}

export const immunizationFormData: FormMetadata = {
    id: 'immunization',
    name: 'Immunization',
    description: 'Immunization form',
    elements: [
        {
            id: 'weight6Months',
            name: 'Weight at 6 months',
            type: 'INTEGER_ZERO_OR_POSITIVE',
            required: false
        },
        {
            id: 'weight12Months',
            name: 'Weight at 12 months',
            type: 'INTEGER_ZERO_OR_POSITIVE',
            required: false
        },
        {
            id: 'weight18Months',
            name: 'Weight at 18 months',
            type: 'INTEGER_ZERO_OR_POSITIVE',
            required: false
        }
    ]
}

export const getFormMetadataForForm = (form: FormType): FormMetadata => {
    if (form.id === 'malaria') {
        return malariaFormData;
    } else if (form.id === 'immunization') {
        return immunizationFormData;
    }
    return malariaFormData;
}