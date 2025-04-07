import { FormType } from './form-type';
import { InputType } from './input-type';
import { getInputMethodsForType, InputMethod } from './input-method';
import { getProcessMethodsForType, ProcessMethod } from './process-method';
import { formTypes } from './form-type';
import { inputTypes } from './input-type';
import { ProcessManager } from '../data-processor/data-processor.component';
import { OcrProcessManagerService } from '../services/ocr-process-manager.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataEntryConfigFactory {

  constructor(private ocrProcessManager: OcrProcessManagerService) {}

  createConfig(): DataEntryConfig {
    return new DataEntryConfig(this.ocrProcessManager);
  }

}

export class DataEntryConfig {

  availableForms: FormType[] = formTypes;
  availableInputTypes: InputType[] = inputTypes;
  availableInputMethods!: InputMethod[];
  availableProcessMethods!: ProcessMethod[];
  availableProcessMethodsForText = getProcessMethodsForType('text');

  processManager: ProcessManager<File, string> | null = null;

  selectedForm: FormType | null = null;
  selectedInputType: InputType | null = null;
  selectedInputMethod: InputMethod | null = null;
  selectedProcessMethod: ProcessMethod | null = null;
  selectedProcessMethodforText: ProcessMethod | null = null;
 
  constructor(private ocrProcessManager: OcrProcessManagerService) {
    this.processManager = this.ocrProcessManager;
  }
  
  handleFormSelection(form: FormType): void {
    this.selectedForm = form;
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
    console.log('Selected process method:', method);
  }

  handleProcessMethodSelectionforText(method: ProcessMethod): void {
    this.selectedProcessMethodforText = method;
    console.log('Selected process method for text:', method);
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