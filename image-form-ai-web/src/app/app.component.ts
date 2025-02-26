import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MalariaFormComponent } from './malaria-form/malaria-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MalariaFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Malaria Symptoms Form';
}
