import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { DataPipelineBuildComponent } from './data-pipeline-build/data-pipeline-build.component';
import { DataEntryConfig } from './models/data-entry-config';
import { DataEntryPipeline } from './models/data-entry-pipeline';
import { DataProcessorsFactory } from './models/data-processors';

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

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private dataProcessorsFactory: DataProcessorsFactory
  ) {

  }

  onConfigReady(c: DataEntryConfig) {
    this.c = c;
    this.instantiatePipeline(c);
  }

  onNewPipelineRequested() {
    this.c = null;
    this.p = null;
  }

  onNewEntryRequested() {
    this.p = null;
    this.changeDetectorRef.detectChanges();
    if (this.c) {
      this.instantiatePipeline(this.c);
    }
  }

  private instantiatePipeline(c: DataEntryConfig) {
    this.p = new DataEntryPipeline(c, this.dataProcessorsFactory);
  }
}
