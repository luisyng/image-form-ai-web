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
      const options = this.getOptionsForElement(element);
      const name = element.name;
      return `    "${element.id}": ${type} /* ${name} ${options} */`;
    });
    
    // Join all fields and close the object
    return structure + fields.join(',\n') + '\n  }';
  }
  
  private getTypeForElement(element: DataElement): string {
    switch (element.type) {
      case 'TEXT':
        return 'string';
      case 'INTEGER_ZERO_OR_POSITIVE':
      case 'AGE':
        return 'number';
      case 'BOOLEAN':
        return 'boolean';
      default:
        return 'any';
    }
  }
  

  private getOptionsForElement(element: DataElement): string {
    if (element.options != null && element.options.length > 0) {
      return  `; One of: ${element.options?.map(o => o.value).join(', ')}`;
    }
    return '';
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