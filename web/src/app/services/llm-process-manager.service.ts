import { Injectable } from '@angular/core';
import { LlmService } from './llm.service';
import { ProcessManager } from '../models/process-manager';
import { MalariaData } from '../malaria/malaria-data';
import { ProcessMethod } from '../models/process-method';

@Injectable({
  providedIn: 'root'
})
export class LlmProcessManagerFactory {
  constructor(private llmService: LlmService) {}
  
  getManager<R>(method: ProcessMethod): ProcessManager<File, R> {
    if (method.id === 'ai-image-to-json' || method.id === 'ai-audio-transcription') {
      return new LlmProcessManager<MalariaData>(this.llmService, method) as unknown as ProcessManager<File, R>;
    } else if (method.id === 'ai-text-to-json') {
      return new LlmProcessManager<string>(this.llmService, method) as unknown as ProcessManager<File, R>;
    }
    
    throw new Error(`Unsupported processing method: ${method.id}`);
  }
}

class ImageToDataProcessManager implements ProcessManager<File, MalariaData> {
  constructor(private llmService: LlmService) {}

  processData(file: File): Promise<MalariaData> {
    return this.llmService.transformImageToMalariaData(file);
  }

  getProcessName(): string {
    return 'Image to Data';
  }
}

export class LlmProcessManager<R> implements ProcessManager<File, R> {
  constructor(
    private llmService: LlmService,
    private processingMethod: ProcessMethod
  ) {}
  
  processData(file: File): Promise<R> {
    if (this.processingMethod.id === 'ai-image-to-json') {
      return this.llmService.transformImageToMalariaData(file) as Promise<R>;
    } else if (this.processingMethod.id === 'ai-audio-transcription') {
      return this.llmService.transcribeAudio(file) as Promise<R>;
    } else if (this.processingMethod.id === 'ai-text-to-json') {
      return this.llmService.transcribeAudio(file) as Promise<R>;
    }
    
    throw new Error(`Unsupported processing method: ${this.processingMethod.id}`);
  }
  
  getProcessName(): string {
    return this.processingMethod.name || 'AI Analysis';
  }
} 