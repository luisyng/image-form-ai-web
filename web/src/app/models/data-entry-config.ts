import { FormType } from './form-type';
import { InputType } from './input-type';
import { getInputMethodsForType, InputMethod } from './input-method';
import { getProcessMethodsForType, ProcessMethod } from './process-method';
import { formTypes } from './form-type';
import { inputTypes } from './input-type';
import { Injectable } from '@angular/core';
import { FormMetadata } from './form-metadata';
import { getFormMetadataForForm } from './form-metadata-samples';
import { servers } from './server';
import { Server } from './server';
import { Dhis2BackendAdapter } from '../dhis2/dhis2-backend-adapter';

@Injectable({
  providedIn: 'root'
})
export class DataEntryConfigFactory {

  constructor(
    private dhis2Adapter: Dhis2BackendAdapter
  ) {}

  createConfig(): DataEntryConfig {
    return new DataEntryConfig(this.dhis2Adapter);
  }

}

export class DataEntryConfig {

  availableServers: Server[] = servers;
  availableForms: FormType[] = [];
  availableInputTypes: InputType[] = inputTypes;
  availableInputMethods!: InputMethod[];
  availableProcessMethods!: ProcessMethod[];
  availableProcessMethodsForText = getProcessMethodsForType('text');
  
  selectedForm: FormType | null = null;
  selectedFormMetadata: FormMetadata | null = null;
  selectedInputType: InputType | null = null;
  selectedInputMethod: InputMethod | null = null;
  selectedProcessMethod: ProcessMethod | null = null;
  selectedProcessMethodforText: ProcessMethod | null = null;
  selectedServer: Server | null = null;
 
  constructor(private dhis2Adapter: Dhis2BackendAdapter) {}
  
  handleServerSelection(server: Server): void {
    this.selectedServer = server;
    this.selectedForm = null;
    this.selectedFormMetadata = null;
    this.selectedInputType = null;
    this.selectedInputMethod = null;
    this.selectedProcessMethod = null;
    this.selectedProcessMethodforText = null;

    if (server.type === 'dhis2') {
      // Load forms from DHIS2
      this.availableForms = [];
      this.dhis2Adapter.getForms().subscribe({
        next: (forms) => {
          this.availableForms = forms;
        },
        error: (error) => {
          console.error('Error loading DHIS2 forms:', error);
          this.availableForms = [];
        }
      });
    } else {
      // Use default forms for other server types
      this.availableForms = formTypes;
    }
    
    console.log('Selected server:', server);
  }
  
  handleFormSelection(form: FormType): void {
    this.selectedForm = form;
    this.selectedFormMetadata = getFormMetadataForForm(form);
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
    return this.selectedServer !== null &&
      this.selectedForm !== null &&
      this.selectedInputType !== null &&
      (this.selectedInputType.id === 'manual' || this.selectedInputMethod !== null) &&
      !(this.selectedInputType.id === 'photo' && this.selectedProcessMethod === null) &&
      !(this.isProcessingToText() && this.selectedProcessMethodforText === null);
  }
} 