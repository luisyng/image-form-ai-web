import { Injectable } from "@angular/core";
import { MalariaData } from "../malaria/malaria-data";

@Injectable({
    providedIn: 'root'
  })
export class LlmService {
  
    constructor() { }
    
    async transformImageToText(imageFile: File): Promise<string> {
        // Simulate LLM processing with a delay
        await this.delay(2000);
        
        // Return mock extracted text
        return this.getMockExtractedText();
    }

    async transformImageToMalariaData(imageFile: File): Promise<MalariaData> {
        // Simulate LLM processing with a delay
        await this.delay(3000);
        
        // Return mock structured data
        return this.getMockMalariaData();
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private getMockExtractedText(): string {
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

    private getMockMalariaData(): MalariaData {
        return {
            name: 'John Altman',
            age: 30,
            fever: true,
            chills: true,
            sweating: false,
            headache: true,
            nausea: false,
            vomiting: true,
            musclePain: true,
            fatigue: false,
            otherSymptoms: 'No other symptoms',
        }
    }
}