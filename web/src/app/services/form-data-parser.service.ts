import { FormMetadata, DataElement, SelectOption } from '../models/form-metadata';
import { FormDataProjection } from '../models/form-data';

export class FormDataParser {
  constructor(private formMetadata: FormMetadata) {}

  /**
   * Parse text into a FormDataProjection based on the form definition
   * 
   * @param text The text to parse
   * @returns A FormDataProjection with the parsed data matching the form structure
   */
  parseTextToFormProjection(text: string): FormDataProjection {
    // Create an empty result object
    const result: FormDataProjection = {};
    
    // Split the text into lines for better processing
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Process each form element
    for (const element of this.formMetadata.elements) {
      // Look for the element in the text
      const value = this.extractValueForElement(lines, element);
      
      // Add the value to the result object if found
      if (value !== undefined) {
        result[element.id] = value;
      }
    }
    
    return result;
  }
  
  /**
   * Extract a value for a specific form element from the text
   * 
   * @param lines The lines of text to search
   * @param element The form element to extract a value for
   * @returns The extracted value, or undefined if not found
   */
  private extractValueForElement(lines: string[], element: DataElement): any {
    const elementType = element.type;
    const possibleLabels = [
      element.name.toLowerCase(),
      ...(element.alternateLabels || []).map((label: string) => label.toLowerCase())
    ];
    
    // Look for the element in the text
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      // Check if the line contains any of the possible labels
      const matchedLabel = possibleLabels.find(label => 
        line.includes(label)
      );
      
      if (matchedLabel) {
        // Extract the value based on the element type
        switch (elementType) {
          case 'TEXT':
          case 'DATE':
          case 'INTEGER_ZERO_OR_POSITIVE':
          case 'AGE':
            return this.extractTextValue(lines[i], matchedLabel);
          case 'BOOLEAN':
            return this.extractBooleanValue(lines[i], matchedLabel);
          default:
            return undefined;
        }
      }
    }
    
    return undefined;
  }
  
  /**
   * Extract a text value from a line
   * 
   * @param line The line to extract from
   * @param label The label to look for
   * @returns The extracted text value
   */
  private extractTextValue(line: string, label: string): string {
    // Remove the label and any separators like ":" from the line
    const labelPattern = new RegExp(`${label}\\s*:?\\s*`, 'i');
    return line.replace(labelPattern, '').trim();
  }
  
  /**
   * Extract a boolean value from a line
   * 
   * @param line The line to extract from
   * @param label The label to look for
   * @returns The extracted boolean value
   */
  private extractBooleanValue(line: string, label: string): boolean {
    const lineLower = line.toLowerCase();
    const valueText = this.extractTextValue(line, label).toLowerCase();
    
    // Check for positive indicators
    const positiveIndicators = ['yes', 'true', 'positive', 'present', '+', '✓', '✔'];
    const negativeIndicators = ['no', 'false', 'negative', 'absent', '-', '✗', '✘'];
    
    if (positiveIndicators.some(indicator => valueText.includes(indicator))) {
      return true;
    }
    
    if (negativeIndicators.some(indicator => valueText.includes(indicator))) {
      return false;
    }
    
    // If no clear indicators, check if the line itself suggests a positive
    return !negativeIndicators.some(indicator => lineLower.includes(indicator));
  }
  
  /**
   * Extract a select value from a line
   * 
   * @param line The line to extract from
   * @param label The label to look for
   * @param options The available options
   * @returns The extracted select value
   */
  private extractSelectValue(line: string, label: string, options: SelectOption[]): string {
    const valueText = this.extractTextValue(line, label).toLowerCase();
    
    // Find the option that best matches the text
    const matchedOption = options.find(option => 
      valueText.includes(option.value.toLowerCase()) || 
      valueText.includes(option.label.toLowerCase())
    );
    
    return matchedOption ? matchedOption.value : '';
  }
  
  /**
   * Extract a text area value from multiple lines
   * 
   * @param lines All lines of text
   * @param startIndex The index of the line with the label
   * @param label The label to look for
   * @returns The extracted text area value
   */
  private extractTextAreaValue(lines: string[], startIndex: number, label: string): string {
    // Get the initial value from the first line
    let value = this.extractTextValue(lines[startIndex], label);
    
    // Look for additional lines that might be part of this text area
    let currentIndex = startIndex + 1;
    while (currentIndex < lines.length) {
      const nextLine = lines[currentIndex];
      
      // Stop if we hit another field
      if (this.isLikelyAnotherField(nextLine)) {
        break;
      }
      
      // Add this line to the value
      value += '\n' + nextLine;
      currentIndex++;
    }
    
    return value;
  }
  
  /**
   * Check if a line is likely to be the start of another field
   * 
   * @param line The line to check
   * @returns True if the line is likely another field, false otherwise
   */
  private isLikelyAnotherField(line: string): boolean {
    const lineLower = line.toLowerCase();
    
    // Common field patterns
    const fieldPatterns = [
      /^[a-z\s]+:\s*/i,  // "Field name: value"
      /^[0-9]+\.\s+/,    // "1. Item"
      /^[-•*]\s+/,       // "- Item" or "• Item"
      /^[A-Z][a-z]+:/    // "Field:"
    ];
    
    return fieldPatterns.some(pattern => pattern.test(line));
  }
} 