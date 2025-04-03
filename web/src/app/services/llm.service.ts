import { Injectable } from "@angular/core";
import { MalariaData } from "../malaria/malaria-data";

@Injectable({
    providedIn: 'root'
  })
export class LlmService {
  
    constructor() { }

    async transformImageToMalariaData(imageFile: File): Promise<MalariaData> {
        // Simulate LLM processing with a delay
        await this.delay(3000);
        
        // Return mock structured data
        return this.getMockMalariaData();
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
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