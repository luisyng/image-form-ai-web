import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OcrService } from '../services/ocr.service';

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

  constructor(private ocrService: OcrService) {}
  
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
    
    if (this.processingMethod === 'ocr') {
      // Use the OCR service for local processing
      this.processWithOcr();
    } else {
      // For LLM processing, we'll use mock data for now
      this.processWithLlm();
    }
  }
  
  private async processWithOcr(): Promise<void> {
    try {
      if (!this.imageFile) return;
      
      const text = await this.ocrService.analyzeImage(this.imageFile);
      this.extractedText = text;
      this.processingComplete = true;
      this.isProcessing = false;
      this.textExtracted.emit(text);
    } catch (error) {
      console.error('OCR processing error:', error);
      this.processingError = 'An error occurred during OCR processing. Please try again.';
      this.isProcessing = false;
    }
  }
  
  private processWithLlm(): void {
    // Simulate LLM processing with a timeout
    setTimeout(() => {
      try {
        this.extractedText = this.simulateLlmExtraction();
        this.processingComplete = true;
        this.isProcessing = false;
        this.textExtracted.emit(this.extractedText);
      } catch (error) {
        this.processingError = 'An error occurred during LLM processing. Please try again.';
        this.isProcessing = false;
      }
    }, 2000);
  }
  
  private simulateLlmExtraction(): string {
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
  
  retryProcessing(): void {
    this.processImage();
  }
  
  updateExtractedText(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.extractedText = textarea.value;
    this.textExtracted.emit(this.extractedText);
  }
} 