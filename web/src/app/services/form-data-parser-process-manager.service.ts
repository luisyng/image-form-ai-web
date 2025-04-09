import { Injectable } from '@angular/core';
import { ProcessManager } from '../models/process-manager';
import { FormDataParser } from './form-data-parser.service';
import { ProcessMethod } from '../models/process-method';
import { FormMetadata } from '../models/form-metadata';
import { FormDataProjection } from '../models/form-data';

@Injectable({
  providedIn: 'root'
})
export class FormDataParserProcessManagerService extends ProcessManager<string, FormDataProjection> {
  private static readonly PARSER_METHOD: ProcessMethod = {
    id: 'parsing',
    name: 'Text Parser',
    description: 'Parse the text to extract structured data.',
    icon: '💻',
    inputType: 'text',
    outputType: 'JSON'
  };
  
  private formMetadata: FormMetadata | null = null;
  private parser: FormDataParser | null = null;
  
  constructor() {
    super(FormDataParserProcessManagerService.PARSER_METHOD);
  }
  
  setFormData(formMetadata: FormMetadata): void {
    this.formMetadata = formMetadata;
    this.parser = new FormDataParser(formMetadata);
  }
  
  processData(text: string): Promise<FormDataProjection> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.parser) {
          throw new Error('No form metadata provided for parsing');
        }
        
        const parsedData = this.parser.parseTextToFormProjection(text);
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    });
  }
} 