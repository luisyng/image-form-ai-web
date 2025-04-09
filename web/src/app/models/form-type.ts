import { Selectable } from "./selectable";

export interface FormType extends Selectable {
}

export const formTypes: FormType[] = [
    {
        id: 'malaria',
        name: 'Malaria Symptoms',
        icon: '🦠'
    },
    {
        id: 'immunization',
        name: 'Immunization',
        icon: '💉'
    }
];