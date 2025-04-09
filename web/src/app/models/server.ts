import { Selectable } from "./selectable";

export interface Server extends Selectable {
}

export const servers: Server[] = [
    {
        id: 'ai-dhis2-dataentry',
        name: 'AI DHIS2 Data Entry',
        icon: '🤖'
    },
    {
        id: 'mock-server',
        name: 'Mock Server',
        icon: '🔍'
    }
];