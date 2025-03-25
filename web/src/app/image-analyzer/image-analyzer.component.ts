import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createWorker } from 'tesseract.js';

export interface MalariaFormData {
  name: string;
  age: number;
  fever: boolean;
  chills: boolean;
  sweating: boolean;
  headache: boolean;
  nausea: boolean;
  vomiting: boolean;
  musclePain: boolean;
  fatigue: boolean;
  otherSymptoms?: string;
}

@Component({
  selector: 'app-image-analyzer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-analyzer.component.html',
  styleUrls: ['./image-analyzer.component.scss']
})
export class ImageAnalyzerComponent {
  @Output() formDataExtracted = new EventEmitter<MalariaFormData>();
  
  isAnalyzing = false;
  previewUrl: string | null = null;
  recognitionProgress = 0;
  errorMessage = '';
  dataExtracted = false;
  extractedText = '';

  async analyzeImage(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.previewUrl = URL.createObjectURL(file);
    this.isAnalyzing = true;
    this.recognitionProgress = 0;
    this.errorMessage = '';
    this.extractedText = '';

    try {
      const worker = await createWorker({
        logger: progress => {
          if (progress.status === 'recognizing text') {
            this.recognitionProgress = Math.round(progress.progress * 100);
          }
        }
      });

      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(file);
      console.log('Extracted text:', text);
      
      this.extractedText = text;
      
      await worker.terminate();
      
      const extractedData = this.extractFormData(text);
      this.formDataExtracted.emit(extractedData);
      this.dataExtracted = true;
      this.isAnalyzing = false;
      
      setTimeout(() => {
        this.dataExtracted = false;
      }, 3000);
    } catch (error) {
      console.error('Error analyzing image:', error);
      this.errorMessage = 'Failed to analyze the image. Please try again.';
      this.isAnalyzing = false;
    }
  }

  private extractFormData(text: string): MalariaFormData {
    // This is a simplified extraction logic
    // In a real application, you would use more sophisticated NLP or pattern matching
    const lines = text.split('\n').map(line => line.trim().toLowerCase());
    
    const formData: MalariaFormData = {
      name: '',
      age: 0,
      fever: false,
      chills: false,
      sweating: false,
      headache: false,
      nausea: false,
      vomiting: false,
      musclePain: false,
      fatigue: false,
      otherSymptoms: ''
    };

    // Enhanced name extraction with multiple patterns
    // Try various formats like "Name: John Doe", "Patient: John Doe", "Patient Name: John Doe"
    const namePatterns = [
      /(?:name|patient name|patient)[\s:]+([A-Za-z\s.-]+)/i,
      /(?:full name)[\s:]+([A-Za-z\s.-]+)/i,
      /(?:mr\.|mrs\.|ms\.|dr\.)\s+([A-Za-z\s.-]+)/i,
      /(?:patient information|patient details)[\s\S]*?(?:name)[\s:]+([A-Za-z\s.-]+)/i
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[1].trim().length > 0) {
        formData.name = match[1].trim();
        break;
      }
    }

    // If no name found yet, try to find the first line that looks like a name
    if (!formData.name) {
      for (const line of lines) {
        // Look for lines that are just names (2-3 words, all alphabetic)
        const words = line.split(/\s+/).filter(word => word.length > 0);
        if (words.length >= 2 && words.length <= 3 && 
            words.every(word => /^[A-Za-z.-]+$/.test(word)) &&
            words.join(' ').length > 5) {
          formData.name = words.join(' ');
          break;
        }
      }
    }

    // Enhanced age extraction with multiple patterns
    const agePatterns = [
      /age[\s:]+(\d+)/i,
      /(\d+)[\s]*(?:years|yrs|yr)[\s]*(?:old)?/i,
      /(?:patient|patient age)[\s:]+(\d+)/i,
      /(?:dob|date of birth)[\s:]+.*?(\d{1,2})[\s]*(?:years|yrs)/i
    ];

    for (const pattern of agePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const age = parseInt(match[1], 10);
        if (age > 0 && age < 120) {
          formData.age = age;
          break;
        }
      }
    }

    // If no age found yet, look for any numbers that could be age
    if (!formData.age) {
      const allNumbers = text.match(/\b(\d+)\b/g);
      if (allNumbers) {
        for (const num of allNumbers) {
          const age = parseInt(num, 10);
          if (age > 0 && age < 120) {
            // Check if this number appears near age-related words
            const context = text.substring(Math.max(0, text.indexOf(num) - 20), 
                                          Math.min(text.length, text.indexOf(num) + 20));
            if (/age|year|old|patient/i.test(context)) {
              formData.age = age;
              break;
            }
          }
        }
      }
    }

    // Check for symptoms
    formData.fever = this.checkForSymptom(lines, ['fever', 'high temperature', 'elevated temperature', 'febrile']);
    formData.chills = this.checkForSymptom(lines, ['chills', 'shivering', 'rigors']);
    formData.sweating = this.checkForSymptom(lines, ['sweating', 'perspiration', 'night sweats', 'diaphoresis']);
    formData.headache = this.checkForSymptom(lines, ['headache', 'head pain', 'cephalgia']);
    formData.nausea = this.checkForSymptom(lines, ['nausea', 'feeling sick', 'queasy']);
    formData.vomiting = this.checkForSymptom(lines, ['vomiting', 'throwing up', 'emesis']);
    formData.musclePain = this.checkForSymptom(lines, ['muscle pain', 'body ache', 'myalgia', 'arthralgia']);
    formData.fatigue = this.checkForSymptom(lines, ['fatigue', 'tiredness', 'weakness', 'malaise', 'lethargy']);

    // Look for other symptoms
    const otherSymptomsPatterns = [
      /other symptoms:?\s*([^\n]+)/i,
      /additional symptoms:?\s*([^\n]+)/i,
      /notes:?\s*([^\n]+)/i,
      /remarks:?\s*([^\n]+)/i
    ];

    for (const pattern of otherSymptomsPatterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[1].trim().length > 0) {
        formData.otherSymptoms = match[1].trim();
        break;
      }
    }

    return formData;
  }

  private checkForSymptom(lines: string[], keywords: string[]): boolean {
    return lines.some(line => {
      return keywords.some(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        return regex.test(line) && 
               !line.includes('no ' + keyword) && 
               !line.includes('not ' + keyword) &&
               !line.includes('denies ' + keyword) &&
               !line.includes('negative for ' + keyword);
      });
    });
  }
} 