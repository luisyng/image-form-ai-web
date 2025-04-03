import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalariaFormComponent } from '../malaria/malaria-form/malaria-form.component';
import { DataEntryStageComponent } from '../data-entry-stage/data-entry-stage.component';
import { SelectorComponent } from '../selector/selector.component';
import { InputTypeSelectorComponent } from '../input-type-selector/input-type-selector.component';
import { InputMethodSelectorComponent } from '../input-method-selector/input-method-selector.component';
import { ImageLoaderComponent } from '../image-loader/image-loader.component';
import { CameraCaptureComponent } from '../camera-capture/camera-capture.component';
import { ImageProcessMethodComponent } from '../image-process-method/image-process-method.component';
import { ImageToTextComponent } from '../image-to-text-processor/image-to-text-processor.component';
import { LlmProcessorComponent } from '../llm-processor/llm-processor.component';
import { MalariaParserComponent } from '../malaria/malaria-parser/malaria-parser.component';
import { BackendDataSenderComponent } from '../backend-data-sender/backend-data-sender.component';
import { DataEntryPipeline } from '../models/data-entry-pipeline';
import { FormType, formTypes } from '../models/form-type';
@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [
    CommonModule, 
    MalariaFormComponent, 
    DataEntryStageComponent, 
    SelectorComponent,
    InputTypeSelectorComponent,
    InputMethodSelectorComponent,
    ImageLoaderComponent,
    CameraCaptureComponent,
    ImageProcessMethodComponent,
    ImageToTextComponent,
    LlmProcessorComponent,
    MalariaParserComponent,
    BackendDataSenderComponent
  ],
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent {
  p = new DataEntryPipeline();
  availableForms: FormType[] = formTypes;
} 