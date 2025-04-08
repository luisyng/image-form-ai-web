import { FormData } from "./form-data";
import { FormType } from "./form-type";

export const malariaFormData: FormData = {
    id: 'malaria',
    name: 'Malaria',
    description: 'Malaria symptoms form',
    elements: [
        {
            id: 'name',
            name: 'Name',
            type: 'text',
            value: '',
            required: true
        },
        {
            id: 'age',
            name: 'Age',
            type: 'number',
            value: '',
            required: true
        },
        {
            id: 'gender',
            name: 'Gender',
            type: 'select',
            value: '',
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
            value: false,
            required: true
        },
        {
            id: 'chills',
            name: 'Chills',
            type: 'boolean',
            value: false,
            required: true
        },
        {
            id: 'sweating',
            name: 'Sweating',
            type: 'boolean',
            value: false,
            required: true
        },
        {
            id: 'headache',
            name: 'Headache',
            type: 'boolean',
            value: false,
            required: true
        },
        {
            id: 'nausea',
            name: 'Nausea',
            type: 'boolean',
            value: false,
            required: true
        },
        {
            id: 'vomiting',
            name: 'Vomiting',
            type: 'boolean',
            value: false,
            required: true
        },
        {
            id: 'musclePain',
            name: 'Muscle Pain',
            type: 'boolean',
            value: false,
            required: true
        },
        {
            id: 'fatigue',
            name: 'Fatigue',
            type: 'boolean',
            value: false,
            required: true
        },
        {
            id: 'otherSymptoms',
            name: 'Other Symptoms',
            type: 'text',
            value: null,
            required: false
        }
    ]
}

export const getFormDataForForm = (form: FormType): FormData => {
    return malariaFormData;
}