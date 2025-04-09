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
            type: 'text',
            required: true,
            alternateLabels: ['name', 'patient', 'patient name']
        },
        {
            id: 'age',
            name: 'Age',
            type: 'number',
            required: true
        },
        {
            id: 'gender',
            name: 'Gender',
            type: 'select',
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
            type: 'boolean',
            defaultValue: false,
            required: true
        },
        {
            id: 'chills',
            name: 'Chills',
            type: 'boolean',
            defaultValue: false,
            required: true
        },
        {
            id: 'sweating',
            name: 'Sweating',
            type: 'boolean',
            defaultValue: false,
            required: true
        },
        {
            id: 'headache',
            name: 'Headache',
            type: 'boolean',
            defaultValue: false,
            required: true
        },
        {
            id: 'nausea',
            name: 'Nausea',
            type: 'boolean',
            defaultValue: false,
            required: true
        },
        {
            id: 'vomiting',
            name: 'Vomiting',
            type: 'boolean',
            defaultValue: false,
            required: true
        },
        {
            id: 'musclePain',
            name: 'Muscle Pain',
            type: 'boolean',
            defaultValue: false,
            required: true
        },
        {
            id: 'fatigue',
            name: 'Fatigue',
            type: 'boolean',
            defaultValue: false,
            required: true
        },
        {
            id: 'otherSymptoms',
            name: 'Other Symptoms',
            type: 'text',
            required: false
        }
    ]
}

export const getFormMetadataForForm = (form: FormType): FormMetadata => {
    return malariaFormData;
}