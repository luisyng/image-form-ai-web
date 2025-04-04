import { FormType } from './form-type';
import { InputType } from './input-type';
import { getInputMethodsForType, InputMethod } from './input-method';
import { getProcessMethodsForType, ProcessMethod } from './process-method';
import { formTypes } from './form-type';
import { inputTypes } from './input-type';

export class DataEntryConfig {
  availableForms: FormType[] = formTypes;
  availableInputTypes: InputType[] = inputTypes;
  availableInputMethods!: InputMethod[];
  availableProcessMethods!: ProcessMethod[];
  selectedForm: FormType | null = null;
  selectedInputType: InputType | null = null;
  selectedInputMethod: InputMethod | null = null;
  selectedProcessMethod: ProcessMethod | null = null;
 
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
    console.log('Selected process method:', method);
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

  isComplete(): boolean {
    return this.selectedForm !== null &&
      this.selectedInputType !== null &&
      (this.selectedInputType.id === 'manual' || this.selectedInputMethod !== null) &&
      !(this.selectedInputType.id === 'photo' && this.selectedProcessMethod === null);
  }
} 