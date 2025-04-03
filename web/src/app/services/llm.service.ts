import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class LlmService {
  
    constructor() { }
    
    async transformImageToText(file: File): Promise<string> {
        return this.simulateLlmExtraction();
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