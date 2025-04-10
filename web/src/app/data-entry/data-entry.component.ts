import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from '../form/form.component';
import { DataEntryStageComponent, StageStatus } from '../data-entry-stage/data-entry-stage.component';
import { FileLoaderComponent } from '../file-loader/file-loader.component';
import { CameraCaptureComponent } from '../camera-capture/camera-capture.component';
import { BackendDataSenderComponent } from '../backend-data-sender/backend-data-sender.component';
import { AudioRecorderComponent } from '../audio-recorder/audio-recorder.component';
import { DataEntryPipeline } from '../models/data-entry-pipeline';
import { DataEntryConfig } from '../models/data-entry-config';
import { TextInputComponent } from '../text-input/text-input.component';
import { DataProcessorComponent } from '../data-processor/data-processor.component';
import { BackendSender } from '../backend-data-sender/backend-sender.interface';
import { BackendSenderFactory } from '../backend-data-sender/backend-sender-factory.service';

@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [
    CommonModule, 
    FormComponent, 
    DataEntryStageComponent, 
    FileLoaderComponent,
    CameraCaptureComponent,
    BackendDataSenderComponent,
    AudioRecorderComponent,
    TextInputComponent,
    DataProcessorComponent
  ],
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent implements OnInit {
  @Input() c!: DataEntryConfig;
  @Input() p!: DataEntryPipeline;
  @Output() newPipelineRequested = new EventEmitter<void>();
  @Output() newEntryRequested = new EventEmitter<void>();

  backendSender!: BackendSender;

  constructor(private backendSenderFactory: BackendSenderFactory) {
  }

  ngOnInit(): void {
    this.backendSender = this.backendSenderFactory.getSender(this.c.selectedServer!);
  }

  successIfNotNull(value: any): StageStatus {
    return value !== null && value != '' ? 'success' : 'normal';
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  startNewEntry(): void {
    this.scrollToTop();
    this.newEntryRequested.emit();
  }
  
  createNewPipeline(): void {
    this.scrollToTop();
    this.newPipelineRequested.emit();
  }

  getFormStageTitle(): string {
    const title = this.c.isManualEntry() ? 'Fill Form' : 'Review Data';
    return title + ': ' + this.c.selectedForm?.name;
  }
}