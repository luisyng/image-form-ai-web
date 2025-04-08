import { Injectable } from '@angular/core';
import { LlmService } from './llm.service';
import { ProcessManager } from '../data-processor/data-processor.component';
import { MalariaData } from '../malaria/malaria-data';
import { ProcessMethod } from '../models/process-method';

@Injectable({
  providedIn: 'root'
})
export class LlmProcessManagerFactory {
  constructor(private llmService: LlmService) {}
  
  getManager(method: ProcessMethod): ProcessManager<File, MalariaData> {
    return new LlmProcessManager(this.llmService, method);
  }
}

export class LlmProcessManager implements ProcessManager<File, MalariaData> {
  constructor(
    private llmService: LlmService,
    private processingMethod: ProcessMethod
  ) {}
  
  processData(file: File): Promise<MalariaData> {
    if (this.processingMethod.id === 'ai-image-to-json') {
      return this.llmService.transformImageToMalariaData(file);
    } else if (this.processingMethod.id === 'ai-audio-transcription') {
      return this.llmService.transformAudioToMalariaData(file);
    }
    
    throw new Error(`Unsupported processing method: ${this.processingMethod.id}`);
  }
  
  getProcessName(): string {
    return this.processingMethod.name || 'AI Analysis';
  }
} 