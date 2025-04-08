import { Injectable } from '@angular/core';
import { ProcessManager } from '../models/process-manager';
import { MalariaData } from '../malaria/malaria-data';
import { MalariaParserService } from '../malaria/malaria-parser.service';
import { ProcessMethod } from '../models/process-method';

@Injectable({
  providedIn: 'root'
})
export class MalariaParserProcessManagerService extends ProcessManager<string, MalariaData> {
  private static readonly PARSER_METHOD: ProcessMethod = {
    id: 'parsing',
    name: 'Malaria Data Parser',
    description: 'Parse the text to extract malaria data.',
    icon: '💻',
    inputType: 'text',
    outputType: 'JSON'
  };
  
  constructor(private malariaParserService: MalariaParserService) {
    super(MalariaParserProcessManagerService.PARSER_METHOD);
  }
  
  processData(text: string): Promise<MalariaData> {
    return new Promise((resolve, reject) => {
      try {
        const parsedData = this.malariaParserService.parseText(text);
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    });
  }
} 