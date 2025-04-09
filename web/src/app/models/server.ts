import { Selectable } from "./selectable";

export interface Server extends Selectable {
    type: 'dhis2' | 'mock'; 
}

export const servers: Server[] = [
    {
        id: 'ai-dhis2-dataentry',
        name: 'AI DHIS2 Data Entry',
        icon: '🤖',
        type: 'dhis2'
    },
    {
        id: 'mock-server',
        name: 'Mock Server',
        icon: '🔍',
        type: 'mock'
    }
];