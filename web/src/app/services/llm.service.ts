import { Injectable } from "@angular/core";
import { MalariaData } from "../malaria/malaria-data";

@Injectable({
    providedIn: 'root'
  })
export class LlmService {
  
    constructor() { }
    
    async transformImageToText(file: File): Promise<string> {
        return this.simulateLlmExtraction();
    }

    async transformImageToMalariaData(file: File): Promise<MalariaData> {
        return {
            name: 'John Altman',
            age: 30,
            fever: true,
            chills: true,
            sweating: true,
            headache: true,
            nausea: true,
            vomiting: true,
            musclePain: true,
            fatigue: true,
            otherSymptoms: 'No other symptoms',
        }
    }

    private simulateLlmExtraction(): string {
            return `Patient Information:
        - Name: John Smith
        - DOB: 15/05/1985
        - Gender: Male
        
        Clinical Assessment:
        - Temperature: 38.5°C
        - Symptoms: Fever, Headache, Chills, Joint pain
        - Duration of symptoms: 3 days
        
        Diagnostic Results:
        - Malaria Rapid Test: Positive (P. falciparum)
        - Parasite density: ++
        
        Treatment Plan:
        - Artemisinin-based combination therapy (ACT)
        - Dosage: 4 tablets daily for 3 days
        - Paracetamol for fever
        
        Follow-up: Patient to return for review in 3 days`;
    }
}