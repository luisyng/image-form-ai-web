import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataEntryStageComponent, StageStatus } from '../data-entry-stage/data-entry-stage.component';
import { SelectorComponent } from '../selector/selector.component';
import { DataEntryConfig } from '../models/data-entry-config';

@Component({
  selector: 'app-data-pipeline-build',
  standalone: true,
  imports: [
    CommonModule, 
    DataEntryStageComponent, 
    SelectorComponent
  ],
  templateUrl: './data-pipeline-build.component.html',
  styleUrls: ['./data-pipeline-build.component.scss']
})
export class DataPipelineBuildComponent {
  @Output() configReady = new EventEmitter<DataEntryConfig>();
  
  c = new DataEntryConfig();

  successIfNotNull(value: any): StageStatus {
    return value !== null && value != '' ? 'success' : 'normal';
  }

  savePipeline(): void {
    this.configReady.emit(this.c);
  }
} 