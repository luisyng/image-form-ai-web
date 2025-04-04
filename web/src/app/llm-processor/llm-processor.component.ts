import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalariaData } from '../malaria/malaria-data';
import { LlmService } from '../services/llm.service';
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
  @Input() audioFile: File | null = null;
  @Output() dataParsed = new EventEmitter<MalariaData>();
  
  isProcessing: boolean = false;
  processingError: string | null = null;
  extractedData: MalariaData | null = null;
  
  constructor(private llmService: LlmService) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['imageFile'] && this.imageFile) || (changes['audioFile'] && this.audioFile)) {
      this.resetState();
      // Auto-process when a file is provided
      this.processMedia();
    }
  }
  
  resetState(): void {
    this.processingError = null;
    this.extractedData = null;
    this.isProcessing = false;
  }
  
  processMedia(): void {
    if (!this.imageFile && !this.audioFile) {
      this.processingError = 'No media file to process.';
      return;
    }
    
    this.isProcessing = true;
    this.processingError = null;
    
    // Determine which type of file to process
    if (this.imageFile) {
      this.processImage();
    } else if (this.audioFile) {
      this.processAudio();
    }
  }
  
  processImage(): void {
    this.llmService.transformImageToMalariaData(this.imageFile!)
      .then(data => {
        this.extractedData = data;
        this.dataParsed.emit(data);
        this.isProcessing = false;
      })
      .catch(error => {
        console.error('Error processing image with LLM:', error);
        this.processingError = 'Failed to extract data from the image. Please try again later.';
        this.isProcessing = false;
      });
  }
  
  processAudio(): void {
    this.llmService.transformAudioToMalariaData(this.audioFile!)
      .then(data => {
        this.extractedData = data;
        this.dataParsed.emit(data);
        this.isProcessing = false;
      })
      .catch(error => {
        console.error('Error processing audio with LLM:', error);
        this.processingError = 'Failed to extract data from the audio. Please try again later.';
        this.isProcessing = false;
      });
  }
  
  retry(): void {
    this.resetState();
    this.processMedia();
  }
} 