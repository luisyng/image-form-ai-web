import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class LlmPromptService {
  

  createMalariaDataPrompt(from: string): string {
    return `
      You are an AI assistant specialized in analyzing medical images and text and extracting structured data about malaria cases.

      Please analyze the provided ${from} and extract the following information in a structured JSON format:
      - Patient name
      - Patient age
      - Symptoms (fever, chills, sweating, headache, nausea, vomiting, muscle pain, fatigue, other symptoms)

      Please respond with raw JSON only, without wrapping it in a code block or any other extra characters.

      It must have this structure:
      {
        "name": string,
        "age": number,
        "fever": boolean,
        "chills": boolean,
        "sweating": boolean,
        "headache": boolean,
        "nausea": boolean,
        "vomiting": boolean,
        "musclePain": boolean,
        "fatigue": boolean,
        "otherSymptoms": string
      }

      If any field is not available in the image, use null for strings, 0 for numbers, and false for booleans.
      `;
  }
}