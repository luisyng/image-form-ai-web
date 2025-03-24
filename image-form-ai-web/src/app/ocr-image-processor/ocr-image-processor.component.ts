import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ocr-image-processor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ocr-image-processor.component.html',
  styleUrls: ['./ocr-image-processor.component.scss']
})
export class OcrImageProcessorComponent implements OnChanges {
  @Input() imageFile: File | null = null;
  @Input() processingMethod: string = '';
  @Output() textExtracted = new EventEmitter<string>();
  
  extractedText: string = '';
  isProcessing: boolean = false;
  processingComplete: boolean = false;
  processingError: string | null = null;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageFile'] && this.imageFile) {
      this.processImage();
    }
  }
  
  processImage(): void {
    if (!this.imageFile) return;
    
    this.isProcessing = true;
    this.processingComplete = false;
    this.processingError = null;
    
    // Simulate OCR processing with a timeout
    setTimeout(() => {
      try {
        // In a real application, this would call an OCR service
        // For now, we'll simulate the extraction with mock data
        this.extractedText = this.simulateOcrExtraction();
        this.processingComplete = true;
        this.isProcessing = false;
        this.textExtracted.emit(this.extractedText);
      } catch (error) {
        this.processingError = 'An error occurred during image processing. Please try again.';
        this.isProcessing = false;
      }
    }, 2000); // Simulate 2 second processing time
  }
  
  private simulateOcrExtraction(): string {
    // This is a mock function that would be replaced with actual OCR in a real app
    if (this.processingMethod === 'ocr') {
      return `Patient Name: John Smith
Date of Birth: 15/05/1985
Gender: Male
Temperature: 38.5°C
Symptoms: Fever, Headache, Chills
Malaria Test: Positive
Treatment: Artemisinin-based combination therapy
Notes: Patient to return for follow-up in 3 days`;
    } else {
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
  
  retryProcessing(): void {
    this.processImage();
  }
  
  updateExtractedText(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.extractedText = textarea.value;
    this.textExtracted.emit(this.extractedText);
  }
} 