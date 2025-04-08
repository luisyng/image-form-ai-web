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
  
  getManager<T, R>(method: ProcessMethod): ProcessManager<T, R> {
    if (method.id === 'ai-image-to-json') {
      return new ImageToDataProcessManager(this.llmService, method) as unknown as ProcessManager<T, R>;
    } else if (method.id === 'ai-audio-transcription' || method.id === 'ai-text-to-json') {
      return new AudioToTextProcessManager(this.llmService, method) as unknown as ProcessManager<T, R>;
    } else if (method.id === 'ai-text-to-json') {
      return new TextToDataProcessManager(this.llmService, method) as unknown as ProcessManager<T, R>;
    }
    
    throw new Error(`Unsupported processing method: ${method.id}`);
  }
}

class ImageToDataProcessManager extends ProcessManager<File, MalariaData> {
  constructor(private llmService: LlmService, method: ProcessMethod) {
    super(method);
  }

  processData(file: File): Promise<MalariaData> {
    return this.llmService.transformImageToMalariaData(file);
  }
}

class AudioToTextProcessManager extends ProcessManager<File, string> {
  constructor(private llmService: LlmService, method: ProcessMethod) {
    super(method);
  }

  processData(file: File): Promise<string> {
    return this.llmService.transcribeAudio(file);
  }
}

class TextToDataProcessManager extends ProcessManager<string, MalariaData> {
  constructor(private llmService: LlmService, method: ProcessMethod) {
    super(method);
  }

  processData(text: string): Promise<MalariaData> {
    return this.llmService.extractMalariaDataFromText(text);
  }
} 