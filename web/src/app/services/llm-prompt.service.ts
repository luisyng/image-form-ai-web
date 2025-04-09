import { Injectable } from "@angular/core";
import { FormMetadata } from "../models/form-metadata";
@Injectable({
    providedIn: 'root'
  })
export class LlmPromptService {

  createExpectedStructure(metadata: FormMetadata): string {
    return `
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
    `
  }
  

  createFormDataPrompt(from: string, metadata: FormMetadata): string {
    return `
      You are an AI assistant specialized in analyzing medical images and text and extracting structured data about malaria cases.

      Please analyze the provided ${from} and extract the following information in a JSON with this structure:
      ${this.createExpectedStructure(metadata)}
    
      Please respond with raw JSON only, without wrapping it in a code block or any other extra characters.

      If any field is not available in the image, use null for strings, 0 for numbers, and false for booleans.
      `;
  }
}