import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LlmService } from '../services/llm.service';
import { MalariaData } from '../malaria/malaria-data';
import { MalariaSummaryComponent } from '../malaria/malaria-summary/malaria-summary.component';

@Component({
  selector: 'app-llm-processor',
  standalone: true,
  imports: [CommonModule, FormsModule, MalariaSummaryComponent],
  templateUrl: './llm-processor.component.html',
  styleUrls: ['./llm-processor.component.scss']
})
export class LlmProcessorComponent implements OnChanges {
  @Input() imageFile: File | null = null;
  @Output() dataParsed = new EventEmitter<MalariaData>();
  
  apiToken: string = '';
  showToken: boolean = false;
  isProcessing: boolean = false;
  processingError: string | null = null;
  extractedData: MalariaData | null = null;
  
  // Add a new state variable to track the input stage
  showApiInput: boolean = true;
  
  constructor(private llmService: LlmService) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageFile'] && this.imageFile) {
      this.resetState();
      // We don't automatically process now - we wait for the token
      this.showApiInput = true;
    }
  }
  
  toggleTokenVisibility(): void {
    this.showToken = !this.showToken;
  }
  
  isValidApiKey(): boolean {
    return this.apiToken.trim().startsWith('sk-') && this.apiToken.trim().length > 10;
  }
  
  processWithToken(): void {
    if (!this.isValidApiKey()) {
      this.processingError = 'Please enter a valid OpenAI API key starting with "sk-".';
      return;
    }
    
    if (!this.imageFile) {
      this.processingError = 'No image file to process.';
      return;
    }
    
    // Hide the API input when processing starts
    this.showApiInput = false;
    this.processImage();
  }
  
  processImage(): void {
    this.isProcessing = true;
    this.processingError = null;
    
    this.llmService.setApiKey(this.apiToken.trim());
    
    this.llmService.transformImageToMalariaData(this.imageFile!)
      .then(data => {
        this.extractedData = data;
        this.dataParsed.emit(data);
        this.isProcessing = false;
        // Clear the API token from memory after successful processing
        this.apiToken = '';
      })
      .catch(error => {
        console.error('Error processing image with LLM:', error);
        this.processingError = 'Failed to extract data from the image. Please check your API key and try again.';
        this.isProcessing = false;
        // Show the API input again on error
        this.showApiInput = true;
      });
  }
  
  resetAndRetry(): void {
    this.resetState();
    this.showApiInput = true;
  }
  
  resetState(): void {
    this.isProcessing = false;
    this.processingError = null;
    this.extractedData = null;
    // Don't reset the API token if the user has entered it
  }
} 