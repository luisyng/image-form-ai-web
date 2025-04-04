import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { DataPipelineBuildComponent } from './data-pipeline-build/data-pipeline-build.component';
import { DataEntryConfig } from './models/data-entry-config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DataEntryComponent, DataPipelineBuildComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AI Data Capture';

  dataEntryConfig: DataEntryConfig | null = null; 

  onConfigReady(config: DataEntryConfig) {
    this.dataEntryConfig = config;
  }
}
