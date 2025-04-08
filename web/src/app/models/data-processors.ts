import { MalariaParserProcessManagerService } from "../services/malaria-parser-process-manager.service";

import { Injectable } from "@angular/core";
import { ProcessManager } from "./process-manager";
import { OcrProcessManagerService } from "../services/ocr-process-manager.service";
import { ProcessMethod } from "./process-method";
import { DataEntryConfig } from "./data-entry-config";
import { LlmProcessManagerFactory } from "../services/llm-process-manager.service";
import { FormData } from "./form-data";

@Injectable({
    providedIn: 'root'
})
export class DataProcessorsFactory {

    constructor(
        private ocrProcessManager: OcrProcessManagerService,
        private llmProcessManagerFactory: LlmProcessManagerFactory,
        private malariaParserProcessManager: MalariaParserProcessManagerService
    ) {}

    getProcessors(c: DataEntryConfig, formData: FormData): DataProcessors {
        return new DataProcessors(
            this.getProcessManager(c.selectedProcessMethod),
            this.getProcessManagerForText(c.selectedProcessMethodforText, formData)
        );
    }

    private getProcessManager(method: ProcessMethod | null): ProcessManager<any, any> | null {
        if (method?.id === 'ocr') {
          return this.ocrProcessManager;
        } else if (method?.id === 'ai-image-to-json') {
          return this.llmProcessManagerFactory.getImageToDataManager(method);
        } else if (method?.id === 'ai-audio-transcription') {
          return this.llmProcessManagerFactory.getAudioToTextManager(method);
        } else {
          return null;
        }
      }

      private getProcessManagerForText(method: ProcessMethod | null, formData: FormData): ProcessManager<string, any> | null {
        if (method?.id === 'parsing') {
          const parserManager = this.malariaParserProcessManager;
          parserManager.setFormData(formData);
          return parserManager;
        } else if (method?.id === 'ai-text-to-json') {
          return this.llmProcessManagerFactory.getTextToDataManager(method);
        } else {
          return null;
        }
      }
}

export class DataProcessors {
    constructor(
        public readonly processManager: ProcessManager<any, any> | null = null,
        public readonly processManagerForText: ProcessManager<string, any> | null = null,
        
    ) {
    }
}
