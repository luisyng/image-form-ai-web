import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LlmService } from '../services/llm.service';
import { MalariaData } from '../malaria/malaria-data';
import { MalariaSummaryComponent } from '../malaria/malaria-summary/malaria-summary.component';

@Component({
  selector: 'app-llm-processor',
  standalone: true,
  imports: [CommonModule, MalariaSummaryComponent],
  templateUrl: './llm-processor.component.html',
  styleUrls: ['./llm-processor.component.scss']
})
export class LlmProcessorComponent implements OnChanges {
  @Input() imageFile: File | null = null;
  @Output() dataParsed = new EventEmitter<MalariaData>();
  
  isProcessing = false;
  processingError: string | null = null;
  extractedData: MalariaData | null = null;
  
  constructor(private llmService: LlmService) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageFile'] && this.imageFile) {
      this.resetState();
      this.processImage();
    }
  }
  
  processImage(): void {
    if (!this.imageFile) {
      console.error('No image file to process');
      return;
    }
    
    this.isProcessing = true;
    this.processingError = null;
    
    this.llmService.transformImageToMalariaData(this.imageFile)
      .then(data => {
        this.extractedData = data;
        this.dataParsed.emit(data);
        this.isProcessing = false;
      })
      .catch(error => {
        console.error('Error processing image with LLM:', error);
        this.processingError = 'Failed to extract data from the image. Please try again.';
        this.isProcessing = false;
      });
  }
  
  retryProcessing(): void {
    this.resetState();
    this.processImage();
  }
  
  private resetState(): void {
    this.isProcessing = false;
    this.processingError = null;
    this.extractedData = null;
  }
} 