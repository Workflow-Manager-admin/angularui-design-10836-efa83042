import { Component } from '@angular/core';
import { DashboardChartsComponent } from './dashboard-charts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardChartsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular';
}
