import { Injectable } from '@angular/core';
import { ProcessManager } from '../models/process-manager';
import { MalariaData } from '../malaria/malaria-data';
import { FormDataParserService } from '../malaria/malaria-parser.service';
import { ProcessMethod } from '../models/process-method';
import { FormData } from '../models/form-data';

@Injectable({
  providedIn: 'root'
})
export class MalariaParserProcessManagerService extends ProcessManager<string, any> {
  private static readonly PARSER_METHOD: ProcessMethod = {
    id: 'parsing',
    name: 'Text Parser',
    description: 'Parse the text to extract structured data.',
    icon: '💻',
    inputType: 'text',
    outputType: 'JSON'
  };
  
  private formData: FormData | null = null;
  
  constructor(private malariaParserService: FormDataParserService) {
    super(MalariaParserProcessManagerService.PARSER_METHOD);
  }
  
  setFormData(formData: FormData): void {
    this.formData = formData;
  }
  
  processData(text: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let parsedData;
        
        if (this.formData) {
          // Use the generic parser if we have form data
          parsedData = this.malariaParserService.parseTextToFormData(text, this.formData);
        } else {
          // Fall back to the legacy parser
          parsedData = this.malariaParserService.parseText(text);
        }
        
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    });
  }
} 