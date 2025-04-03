import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OcrService } from '../services/ocr.service';
import { LlmService } from '../services/llm.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-ocr-image-processor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-to-text-processor.component.html',
  styleUrls: ['./image-to-text-processor.component.scss']
})
export class ImageToTextComponent implements OnChanges {
  @Input() imageFile: File | null = null;
  @Input() processingMethod: string = '';
  @Output() textExtracted = new EventEmitter<string>();
  
  extractedText: string = '';
  isProcessing: boolean = false;
  processingComplete: boolean = false;
  processingError: string | null = null;
  
  private textChanges = new Subject<string>();

  constructor(private ocrService: OcrService, private llmService: LlmService) {
    // Set up debounced text changes to avoid too many emissions
    this.textChanges.pipe(
      debounceTime(500) // Wait for 500ms of inactivity before emitting
    ).subscribe(text => {
      this.textExtracted.emit(text);
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    if (changes['imageFile'] && this.imageFile) {
      this.resetState();
      // Automatically start processing when image is loaded
      this.processImage();
    }
  }
  
  onTextChanged(text: string): void {
    console.log('Text changed, emitting after debounce');
    this.textChanges.next(text);
  }
  
  processImage(): void {
    if (!this.imageFile) {
      console.error('No image file to process');
      return;
    }
    
    console.log('Processing image:', this.imageFile.name);
    this.isProcessing = true;
    this.processingComplete = false;
    this.processingError = null;
    
    if (this.processingMethod === 'ocr') {
      // Use the OCR service for local processing
      this.processWithOcr();
    }
  }
  
  private async processWithOcr(): Promise<void> {
    try {
      if (!this.imageFile) return;
      
      const text = await this.ocrService.transformImageToText(this.imageFile);
      this.extractedText = text;
      this.setProcessingComplete();
      // Emit the initial text
      this.textExtracted.emit(text);
    } catch (error) {
      console.error('OCR processing error:', error);
      this.processingError = 'An error occurred during OCR processing. Please try again.';
      this.isProcessing = false;
    }
  }
  
  private setProcessingComplete(): void {
    console.log('Setting processing complete');
    this.isProcessing = false;
    this.processingComplete = true;
  }
  
  retryProcessing(): void {
    this.processingError = null;
    this.processImage();
  }
  
  private resetState(): void {
    console.log('Resetting state');
    this.extractedText = '';
    this.isProcessing = false;
    this.processingComplete = false;
    this.processingError = null;
  }
} 