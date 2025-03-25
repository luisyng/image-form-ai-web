import { Injectable } from '@angular/core';
import { MalariaData } from './malaria-data';

@Injectable({
  providedIn: 'root'
})
export class MalariaParserService {

  constructor() { }

  parseText(text: string): MalariaData {
    const data = new MalariaData();
    
    // Split the text into lines for better processing
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineLower = line.toLowerCase();
      
      // Parse name - look for specific name patterns
      if (lineLower.includes('name:') || lineLower.includes('patient:') || 
          lineLower.includes('patient name:') || lineLower.includes('full name:')) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          // Preserve original case for the value
          data.name = line.substring(colonIndex + 1).trim();
          
          // Check if the next line might be part of the name (no colon)
          if (i + 1 < lines.length && !lines[i + 1].includes(':')) {
            const nextLine = lines[i + 1].trim();
            // Only append if it's not likely to be another field
            if (!this.isLikelyAnotherField(nextLine)) {
              data.name += ' ' + nextLine;
              i++; // Skip the next line since we've processed it
            }
          }
        }
      }
      
      // Parse age - look for specific age patterns
      else if (lineLower.includes('age:') || lineLower.includes('age (years):') || lineLower.includes('years:')) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          // Extract numeric part from the age
          const ageValue = line.substring(colonIndex + 1).trim();
          const ageMatch = ageValue.match(/\d+/);
          if (ageMatch) {
            data.age = parseInt(ageMatch[0], 10);
          }
        }
      }
      
      // Parse symptoms
      else if (this.isSymptomLine(lineLower)) {
        this.parseSymptomLine(lineLower, data);
      }
      
      // Parse other symptoms
      else if (lineLower.includes('other symptoms:') || lineLower.includes('notes:') || lineLower.includes('additional:')) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          // Preserve original case for the value
          data.otherSymptoms = line.substring(colonIndex + 1).trim();
          
          // Check if there are more lines of other symptoms
          let j = i + 1;
          while (j < lines.length && !this.isLikelyAnotherField(lines[j])) {
            data.otherSymptoms += ' ' + lines[j].trim();
            j++;
          }
          i = j - 1; // Update the index to skip processed lines
        }
      }
    }
    
    return data;
  }
  
  private isSymptomLine(lineLower: string): boolean {
    const symptomKeywords = [
      'fever', 'chills', 'sweating', 'headache', 
      'nausea', 'vomiting', 'muscle pain', 'musculepain', 
      'muscle-pain', 'fatigue'
    ];
    
    // Check if the line contains any symptom keyword
    return symptomKeywords.some(keyword => lineLower.includes(keyword));
  }
  
  private parseSymptomLine(lineLower: string, data: MalariaData): void {
    const isPositive = lineLower.includes('yes') || lineLower.includes('true') || lineLower.includes('positive') || 
                       lineLower.includes('✓') || lineLower.includes('✔') || lineLower.includes('☑');
    const isNegative = lineLower.includes('no') || lineLower.includes('false') || lineLower.includes('negative') || 
                       lineLower.includes('✗') || lineLower.includes('✘') || lineLower.includes('☐');
    
    // Default to positive if there's a symptom mentioned without explicit yes/no
    const hasSymptom = isPositive || (!isNegative && !lineLower.includes(':'));
    
    if (lineLower.includes('fever')) {
      data.fever = hasSymptom;
    }
    if (lineLower.includes('chills')) {
      data.chills = hasSymptom;
    }
    if (lineLower.includes('sweating')) {
      data.sweating = hasSymptom;
    }
    if (lineLower.includes('headache')) {
      data.headache = hasSymptom;
    }
    if (lineLower.includes('nausea')) {
      data.nausea = hasSymptom;
    }
    if (lineLower.includes('vomiting')) {
      data.vomiting = hasSymptom;
    }
    if (lineLower.includes('muscle pain') || lineLower.includes('musculepain') || lineLower.includes('muscle-pain')) {
      data.musclePain = hasSymptom;
    }
    if (lineLower.includes('fatigue')) {
      data.fatigue = hasSymptom;
    }
  }
  
  private isLikelyAnotherField(line: string): boolean {
    // Check if the line is likely to be the start of another field
    const fieldKeywords = [
      'name:', 'age:', 'fever:', 'chills:', 'sweating:', 'headache:', 
      'nausea:', 'vomiting:', 'muscle pain:', 'fatigue:', 'other symptoms:',
      'patient:', 'gender:', 'sex:', 'date:', 'diagnosis:', 'treatment:'
    ];
    
    const lineLower = line.toLowerCase();
    
    // Check if the line contains any field keyword
    return fieldKeywords.some(keyword => lineLower.includes(keyword)) || 
           // Or if it looks like a bullet point or numbered list
           /^[-•*]\s/.test(line) || 
           /^\d+[.)]/.test(line);
  }
} 