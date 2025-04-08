import { Injectable } from '@angular/core';
import { ProcessManager } from '../models/process-manager';
import { MalariaData } from '../malaria/malaria-data';
import { MalariaParserService } from '../malaria/malaria-parser.service';

@Injectable({
  providedIn: 'root'
})
export class MalariaParserProcessManagerService implements ProcessManager<string, MalariaData> {
  constructor(private malariaParserService: MalariaParserService) {}
  
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
  
  getProcessName(): string {
    return 'Malaria Data Parser';
  }
} 