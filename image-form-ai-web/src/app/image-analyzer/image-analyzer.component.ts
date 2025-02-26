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
      await worker.terminate();
      
      const extractedData = this.extractFormData(text);
      this.formDataExtracted.emit(extractedData);
      this.isAnalyzing = false;
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

    // Extract name (assuming format like "Name: John Doe" or "Patient: John Doe")
    const nameMatch = text.match(/(?:name|patient):\s*([^\n]+)/i);
    if (nameMatch && nameMatch[1]) {
      formData.name = nameMatch[1].trim();
    }

    // Extract age (assuming format like "Age: 45" or "Age: 45 years")
    const ageMatch = text.match(/age:\s*(\d+)/i);
    if (ageMatch && ageMatch[1]) {
      formData.age = parseInt(ageMatch[1], 10);
    }

    // Check for symptoms
    formData.fever = this.checkForSymptom(lines, ['fever', 'high temperature']);
    formData.chills = this.checkForSymptom(lines, ['chills', 'shivering']);
    formData.sweating = this.checkForSymptom(lines, ['sweating', 'perspiration', 'night sweats']);
    formData.headache = this.checkForSymptom(lines, ['headache', 'head pain']);
    formData.nausea = this.checkForSymptom(lines, ['nausea', 'feeling sick']);
    formData.vomiting = this.checkForSymptom(lines, ['vomiting', 'throwing up']);
    formData.musclePain = this.checkForSymptom(lines, ['muscle pain', 'body ache', 'myalgia']);
    formData.fatigue = this.checkForSymptom(lines, ['fatigue', 'tiredness', 'weakness']);

    // Look for other symptoms
    const otherSymptomsMatch = text.match(/other symptoms:?\s*([^\n]+)/i);
    if (otherSymptomsMatch && otherSymptomsMatch[1]) {
      formData.otherSymptoms = otherSymptomsMatch[1].trim();
    }

    return formData;
  }

  private checkForSymptom(lines: string[], keywords: string[]): boolean {
    return lines.some(line => {
      return keywords.some(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        return regex.test(line) && !line.includes('no ' + keyword) && !line.includes('not ' + keyword);
      });
    });
  }
} 