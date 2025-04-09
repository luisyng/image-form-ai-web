import { Injectable } from '@angular/core';
import { LlmServiceFactory, LlmService } from './llm.service';
import { ProcessManager } from '../models/process-manager';
import { MalariaData } from '../malaria/malaria-data';
import { ProcessMethod } from '../models/process-method';
import { FormMetadata } from '../models/form-metadata';

@Injectable({
  providedIn: 'root'
})
export class LlmProcessManagerFactory {
  constructor(private llmServiceFactory: LlmServiceFactory) {}

  getImageToDataManager(method: ProcessMethod, metadata: FormMetadata): ProcessManager<File, MalariaData> {
    return new ImageToDataProcessManager(this.llmServiceFactory.getLlmService(metadata), method);
  }

  getAudioToTextManager(method: ProcessMethod, metadata: FormMetadata): ProcessManager<File, string> {
    return new AudioToTextProcessManager(this.llmServiceFactory.getLlmService(metadata), method);
  }

  getTextToDataManager(method: ProcessMethod, metadata: FormMetadata): ProcessManager<string, MalariaData> {
    return new TextToDataProcessManager(this.llmServiceFactory.getLlmService(metadata), method);
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