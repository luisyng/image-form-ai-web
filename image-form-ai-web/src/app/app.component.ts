import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataEntryComponent } from './data-entry/data-entry.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DataEntryComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AI Data Capture';
}
