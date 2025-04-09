import { Injectable } from "@angular/core";
import { DataElement, FormMetadata } from "../models/form-metadata";
@Injectable({
    providedIn: 'root'
  })
export class LlmPromptService {

  createExpectedStructure(metadata: FormMetadata): string {
    // Start building the structure object
    const structure = '{\n';
    
    // Add each field with its type
    const fields = metadata.elements.map(element => {
      const type = this.getTypeForElement(element);
      return `    "${element.id}": ${type}`;
    });
    
    // Join all fields and close the object
    return structure + fields.join(',\n') + '\n  }';
  }
  
  private getTypeForElement(element: DataElement): string {
    switch (element.type) {
      case 'text':
      case 'textarea':
        return 'string';
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'select':
        // For select, we could optionally include the valid values
        return `string /* One of: ${element.options?.map(o => o.value).join(', ')} */`;
      default:
        return 'any';
    }
  } 

  createFormDataPrompt(from: string, metadata: FormMetadata): string {
    const expectedStructure = this.createExpectedStructure(metadata);
    console.log('Expected structure:', expectedStructure);
    
    return `
      You are an AI assistant specialized in analyzing medical images and text and extracting structured data about malaria cases.

      Please analyze the provided ${from} and extract the following information in a JSON with this structure:
      ${expectedStructure}
    
      Please respond with raw JSON only, without wrapping it in a code block or any other extra characters.

      If any field is not available in the image, use null for strings, 0 for numbers, and false for booleans.
      `;
  }
}