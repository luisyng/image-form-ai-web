import { Injectable } from '@angular/core';
import { LlmServiceFactory, LlmService } from './llm.service';
import { ProcessManager } from '../models/process-manager';
import { ProcessMethod } from '../models/process-method';
import { FormMetadata } from '../models/form-metadata';
import { FormDataProjection } from '../models/form-data';

@Injectable({
  providedIn: 'root'
})
export class LlmProcessManagerFactory {
  constructor(private llmServiceFactory: LlmServiceFactory) {}

  getImageToDataManager(method: ProcessMethod, metadata: FormMetadata): ProcessManager<File, FormDataProjection> {
    return new ImageToDataProcessManager(this.llmServiceFactory.getLlmService(metadata), method);
  }

  getAudioToTextManager(method: ProcessMethod, metadata: FormMetadata): ProcessManager<File, string> {
    return new AudioToTextProcessManager(this.llmServiceFactory.getLlmService(metadata), method);
  }

  getTextToDataManager(method: ProcessMethod, metadata: FormMetadata): ProcessManager<string, FormDataProjection> {
    return new TextToDataProcessManager(this.llmServiceFactory.getLlmService(metadata), method);
  }
}

class ImageToDataProcessManager extends ProcessManager<File, FormDataProjection> {
  constructor(private llmService: LlmService, method: ProcessMethod) {
    super(method);
  }

  processData(file: File): Promise<FormDataProjection> {
    return this.llmService.transformImageToFormData(file);
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

class TextToDataProcessManager extends ProcessManager<string, FormDataProjection> {
  constructor(private llmService: LlmService, method: ProcessMethod) {
    super(method);
  }

  processData(text: string): Promise<FormDataProjection> {
    return this.llmService.extractFormDataFromText(text);
  }
} 