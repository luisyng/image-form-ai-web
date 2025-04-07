import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalariaData } from '../malaria/malaria-data';
import { LlmService } from '../services/llm.service';
import { MalariaSummaryComponent } from '../malaria/malaria-summary/malaria-summary.component';
import { ProcessMethod } from '../models/process-method';

@Component({
  selector: 'app-llm-processor',
  standalone: true,
  imports: [CommonModule, MalariaSummaryComponent],
  templateUrl: './llm-processor.component.html',
  styleUrls: ['./llm-processor.component.scss']
})
export class LlmProcessorComponent implements OnChanges {
  @Input() processingMethod: ProcessMethod | null = null;
  @Input() file: File | null = null;
  @Output() dataParsed = new EventEmitter<MalariaData>();
  
  isProcessing: boolean = false;
  processingError: string | null = null;
  extractedData: MalariaData | null = null;
  
  constructor(private llmService: LlmService) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['imageFile'] && this.file) || (changes['audioFile'] && this.file)) {
      this.resetState();
      // Auto-process when a file is provided
      this.processMedia();
    }
  }

  getTypeStr(): string {
    return this.processingMethod?.inputType === 'photo' ? 'photo' : 'audio recording';
  }
  
  resetState(): void {
    this.processingError = null;
    this.extractedData = null;
    this.isProcessing = false;
  }
  
  processMedia(): void {
    if (!this.file && !this.file) {
      this.processingError = 'No media file to process.';
      return;
    }
    
    this.isProcessing = true;
    this.processingError = null;
    
    this.processInternally();
  }

  private processCall(): Promise<MalariaData> {
    if (this.processingMethod?.id === 'ai-image-to-json') {
      return this.llmService.transformImageToMalariaData(this.file!);
    } else if (this.processingMethod?.id === 'ai-audio-transcription') {
      return this.llmService.transformAudioToMalariaData(this.file!);
    }
  }

  private processInternally(): void {
    this.processCall()
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
  
  retry(): void {
    this.resetState();
    this.processMedia();
  }
} 