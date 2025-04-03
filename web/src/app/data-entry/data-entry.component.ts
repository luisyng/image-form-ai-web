import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalariaFormComponent } from '../malaria/malaria-form/malaria-form.component';
import { DataEntryStageComponent } from '../data-entry-stage/data-entry-stage.component';
import { FormSelectorComponent } from '../form-selector/form-selector.component';
import { InputTypeSelectorComponent } from '../input-type-selector/input-type-selector.component';
import { ImageLoaderComponent } from '../image-loader/image-loader.component';
import { CameraCaptureComponent } from '../camera-capture/camera-capture.component';
import { ImageProcessMethodComponent } from '../image-process-method/image-process-method.component';
import { OcrImageProcessorComponent } from '../ocr-image-processor/ocr-image-processor.component';
import { MalariaParserComponent } from '../malaria/malaria-parser/malaria-parser.component';
import { BackendDataSenderComponent } from '../backend-data-sender/backend-data-sender.component';
import { DataEntryPipeline } from '../models/data-entry-pipeline';

@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [
    CommonModule, 
    MalariaFormComponent, 
    DataEntryStageComponent, 
    FormSelectorComponent,
    InputTypeSelectorComponent,
    ImageLoaderComponent,
    CameraCaptureComponent,
    ImageProcessMethodComponent,
    OcrImageProcessorComponent,
    MalariaParserComponent,
    BackendDataSenderComponent
  ],
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent {
  p = new DataEntryPipeline();
} 