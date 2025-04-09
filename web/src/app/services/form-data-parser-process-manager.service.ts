import { Injectable } from '@angular/core';
import { ProcessManager } from '../models/process-manager';
import { FormDataParser } from './form-data-parser.service';
import { ProcessMethod } from '../models/process-method';
import { FormDataProjection } from '../models/form-data';
import { FormMetadata } from '../models/form-metadata';

@Injectable({
  providedIn: 'root'
})
export class FormDataParserProcessManagerService {
  getProcessManager(method: ProcessMethod, metadata: FormMetadata): FormDataParserProcessManager {
    return new FormDataParserProcessManager(method, new FormDataParser(metadata));
  } 
}

export class FormDataParserProcessManager extends ProcessManager<string, FormDataProjection> {

  
  constructor(method: ProcessMethod, private parser: FormDataParser ) {
    super(method);
    this.parser = parser;
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