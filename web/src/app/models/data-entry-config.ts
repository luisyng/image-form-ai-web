import { FormType } from './form-type';
import { InputType } from './input-type';
import { getInputMethodsForType, InputMethod } from './input-method';
import { getProcessMethodsForType, ProcessMethod } from './process-method';
import { formTypes } from './form-type';
import { inputTypes } from './input-type';
import { ProcessManager } from '../models/process-manager';
import { OcrProcessManagerService } from '../services/ocr-process-manager.service';
import { LlmProcessManagerFactory } from '../services/llm-process-manager.service';
import { MalariaParserProcessManagerService } from '../services/malaria-parser-process-manager.service';
import { Injectable } from '@angular/core';
import { FormData } from './form-data';
import { getFormDataForForm } from './form-data-samples';

@Injectable({
  providedIn: 'root'
})
export class DataEntryConfigFactory {

  constructor(
    private ocrProcessManager: OcrProcessManagerService,
    private llmProcessManagerFactory: LlmProcessManagerFactory,
    private malariaParserProcessManager: MalariaParserProcessManagerService
  ) {}

  createConfig(): DataEntryConfig {
    return new DataEntryConfig(
      this.ocrProcessManager, 
      this.llmProcessManagerFactory,
      this.malariaParserProcessManager
    );
  }

}

export class DataEntryConfig {

  availableForms: FormType[] = formTypes;
  availableInputTypes: InputType[] = inputTypes;
  availableInputMethods!: InputMethod[];
  availableProcessMethods!: ProcessMethod[];
  availableProcessMethodsForText = getProcessMethodsForType('text');

  processManager: ProcessManager<any, any> | null = null;
  processManagerForText: ProcessManager<string, any> | null = null;
  
  selectedForm: FormType | null = null;
  selectedFormData: FormData | null = null;
  selectedInputType: InputType | null = null;
  selectedInputMethod: InputMethod | null = null;
  selectedProcessMethod: ProcessMethod | null = null;
  selectedProcessMethodforText: ProcessMethod | null = null;
 
  constructor(
    private ocrProcessManager: OcrProcessManagerService,
    private llmProcessManagerFactory: LlmProcessManagerFactory,
    private malariaParserProcessManager: MalariaParserProcessManagerService
  ) {}
  
  handleFormSelection(form: FormType): void {
    this.selectedForm = form;
    this.selectedFormData = getFormDataForForm(form);
    console.log('Selected form:', form);
  }
  
  handleInputTypeSelection(inputType: InputType): void {
    this.selectedInputType = inputType;
    this.selectedInputMethod = null;
    this.availableInputMethods = getInputMethodsForType(inputType.id);
    this.availableProcessMethods = getProcessMethodsForType(inputType.id);
    console.log('Selected input type:', inputType);
  }
  
  handleInputMethodSelection(method: InputMethod): void {
    this.selectedInputMethod = method;
    console.log('Selected input method:', method);
  }
  
  handleProcessMethodSelection(method: ProcessMethod): void {
    this.selectedProcessMethod = method;
    this.selectedProcessMethodforText = null;
    this.processManager = this.getProcessManager(method);
    
    console.log('Selected process method:', method);
  }

  private getProcessManager(method: ProcessMethod): ProcessManager<any, any> | null {
    if (method.id === 'ocr') {
      return this.ocrProcessManager;
    } else if (method.id === 'ai-image-to-json') {
      return this.llmProcessManagerFactory.getImageToDataManager(method);
    } else if (method.id === 'ai-audio-transcription') {
      return this.llmProcessManagerFactory.getAudioToTextManager(method);
    } else {
      return null;
    }
  }

  handleProcessMethodSelectionforText(method: ProcessMethod): void {
    this.selectedProcessMethodforText = method;
    this.processManagerForText = this.getProcessManagerForText(method);
    
    console.log('Selected process method for text:', method);
  }

  private getProcessManagerForText(method: ProcessMethod): ProcessManager<string, any> | null {
    if (method.id === 'parsing') {
      return this.malariaParserProcessManager;
    } else if (method.id === 'ai-text-to-json') {
      return this.llmProcessManagerFactory.getTextToDataManager(method);
    } else {
      return null;
    }
  }
  
  isManualEntry(): boolean {
    return this.selectedInputType?.id === 'manual';
  }
  
  isPhotoEntry(): boolean {
    return this.selectedInputType?.id === 'photo';
  }
  
  isAudioEntry(): boolean {
    return this.selectedInputType?.id === 'audio';
  }
  
  isCameraMethod(): boolean {
    return this.selectedInputMethod?.id === 'camera';
  }
  
  isUploadPhotoMethod(): boolean {
    return this.selectedInputMethod?.id === 'upload-photo';
  }
  
  isMicrophoneMethod(): boolean {
    return this.selectedInputMethod?.id === 'microphone';
  }
  
  isUploadAudioMethod(): boolean {
    return this.selectedInputMethod?.id === 'upload-audio';
  }

  isProcessingToText(): boolean {
    return this.selectedProcessMethod?.outputType === 'text';
  }

  isComplete(): boolean {
    return this.selectedForm !== null &&
      this.selectedInputType !== null &&
      (this.selectedInputType.id === 'manual' || this.selectedInputMethod !== null) &&
      !(this.selectedInputType.id === 'photo' && this.selectedProcessMethod === null) &&
      !(this.isProcessingToText() && this.selectedProcessMethodforText === null);
  }
} 