import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { DataPipelineBuildComponent } from './data-pipeline-build/data-pipeline-build.component';
import { DataEntryConfig } from './models/data-entry-config';
import { DataEntryPipeline } from './models/data-entry-pipeline';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DataEntryComponent, DataPipelineBuildComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AI Data Capture';

  c: DataEntryConfig | null = null; 
  p: DataEntryPipeline | null = null;

  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  onConfigReady(c: DataEntryConfig) {
    this.c = c;
    this.p = new DataEntryPipeline(c);
  }

  onNewPipelineRequested() {
    this.c = null;
    this.p = null;
  }

  onNewEntryRequested() {
    this.p = null;
    this.changeDetectorRef.detectChanges();
    if (this.c) {
      this.p = new DataEntryPipeline(this.c);
    }
  } 
}
