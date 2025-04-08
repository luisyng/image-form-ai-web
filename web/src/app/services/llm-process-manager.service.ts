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

  getImageToDataManager(method: ProcessMethod): ProcessManager<File, MalariaData> {
    return new ImageToDataProcessManager(this.llmService, method);
  }

  getAudioToTextManager(method: ProcessMethod): ProcessManager<File, string> {
    return new AudioToTextProcessManager(this.llmService, method);
  }

  getTextToDataManager(method: ProcessMethod): ProcessManager<string, MalariaData> {
    return new TextToDataProcessManager(this.llmService, method);
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