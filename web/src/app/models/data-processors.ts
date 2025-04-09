import { FormDataParserProcessManagerService } from "../services/form-data-parser-process-manager.service";

import { Injectable } from "@angular/core";
import { ProcessManager } from "./process-manager";
import { OcrProcessManagerService } from "../services/ocr-process-manager.service";
import { ProcessMethod } from "./process-method";
import { DataEntryConfig } from "./data-entry-config";
import { LlmProcessManagerFactory } from "../services/llm-process-manager.service";
import { FormMetadata } from "./form-metadata";

@Injectable({
    providedIn: 'root'
})
export class DataProcessorsFactory {

    constructor(
        private ocrProcessManager: OcrProcessManagerService,
        private llmProcessManagerFactory: LlmProcessManagerFactory,
        private malariaParserProcessManager: FormDataParserProcessManagerService
    ) {}

    getProcessors(c: DataEntryConfig): DataProcessors {
        return new DataProcessors(
            this.getProcessManager(c.selectedProcessMethod!, c.selectedFormMetadata!),
            this.getProcessManagerForText(c.selectedProcessMethodforText, c.selectedFormMetadata!)
        );
    }

    private getProcessManager(method: ProcessMethod | null, formMetadata: FormMetadata): ProcessManager<any, any> | null {
        if (method?.id === 'ocr') {
          return this.ocrProcessManager;
        } else if (method?.id === 'ai-image-to-json') {
          return this.llmProcessManagerFactory.getImageToDataManager(method, formMetadata);
        } else if (method?.id === 'ai-audio-transcription') {
          return this.llmProcessManagerFactory.getAudioToTextManager(method, formMetadata);
        } else {
          return null;
        }
      }

      private getProcessManagerForText(method: ProcessMethod | null, formMetadata: FormMetadata): ProcessManager<string, any> | null {
        if (method?.id === 'parsing') {
          return this.malariaParserProcessManager.getProcessManager(method, formMetadata);
        } else if (method?.id === 'ai-text-to-json') {
          return this.llmProcessManagerFactory.getTextToDataManager(method, formMetadata);
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
