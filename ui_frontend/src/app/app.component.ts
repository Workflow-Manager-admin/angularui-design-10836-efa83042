import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardChartsComponent } from './dashboard-charts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DashboardChartsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular';

  // PUBLIC_INTERFACE
  sidebarSections = [
    { label: 'Broadband Service', icon: 'service-broadband' },
    { label: 'LAN Service', icon: 'service-lan' },
    { label: 'Syslog Service', icon: 'service-syslog' }
  ];

  // PUBLIC_INTERFACE
  selectedSidebarIndex = 0;

  // PUBLIC_INTERFACE
  selectSidebar(index: number) {
    this.selectedSidebarIndex = index;
  }
}
