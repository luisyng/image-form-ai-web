import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalariaFormComponent } from '../malaria/malaria-form/malaria-form.component';
import { DataEntryStageComponent, StageStatus } from '../data-entry-stage/data-entry-stage.component';
import { ImageLoaderComponent } from '../image-loader/image-loader.component';
import { CameraCaptureComponent } from '../camera-capture/camera-capture.component';
import { ImageToTextComponent } from '../image-to-text-processor/image-to-text-processor.component';
import { LlmProcessorComponent } from '../llm-processor/llm-processor.component';
import { MalariaParserComponent } from '../malaria/malaria-parser/malaria-parser.component';
import { BackendDataSenderComponent } from '../backend-data-sender/backend-data-sender.component';
import { DataEntryPipeline } from '../models/data-entry-pipeline';
import { DataEntryConfig } from '../models/data-entry-config';

@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [
    CommonModule, 
    MalariaFormComponent, 
    DataEntryStageComponent, 
    ImageLoaderComponent,
    CameraCaptureComponent,
    ImageToTextComponent,
    LlmProcessorComponent,
    MalariaParserComponent,
    BackendDataSenderComponent
  ],
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent {
  @Input() c: DataEntryConfig = new DataEntryConfig();
  @Input() p!: DataEntryPipeline;
  @Output() newPipelineRequested = new EventEmitter<void>();
  @Output() newEntryRequested = new EventEmitter<void>();

  successIfNotNull(value: any): StageStatus {
    return value !== null && value != '' ? 'success' : 'normal';
  }
  
  startNewEntry(): void {
    this.newEntryRequested.emit();
  }
  
  createNewPipeline(): void {
    this.newPipelineRequested.emit();
  }
} 