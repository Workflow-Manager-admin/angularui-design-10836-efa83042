import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { DashboardChartsComponent } from './dashboard-charts.component';
import { DeviceTableComponent } from './device-table.component';
import { DeviceDetailsDialogComponent, DeviceDetails } from './device-details-dialog.component';
import { DeviceEditDialogComponent } from './device-edit-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DashboardChartsComponent, DeviceTableComponent, DeviceDetailsDialogComponent, DeviceEditDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular';

  // PUBLIC_INTERFACE
  sidebarSections = [
    {
      label: 'Broadband Service',
      short: '🖧',
      icon: 'service-broadband',
      tooltip: 'Broadband Service'
    },
    {
      label: 'LAN Service',
      short: '🌐',
      icon: 'service-lan',
      tooltip: 'LAN Service'
    },
    {
      label: 'Syslog Service',
      short: '📋',
      icon: 'service-syslog',
      tooltip: 'Syslog Service'
    },
    {
      label: 'Export & Download',
      short: '⬇️',
      icon: 'service-export',
      tooltip: 'Export & Download',
      special: true
    },
    {
      label: 'Filtering & Advanced Search',
      short: '🔎',
      icon: 'service-filter',
      tooltip: 'Filtering & Advanced Search',
      special: true
    }
  ];

  // PUBLIC_INTERFACE
  selectedSidebarIndex = 0;

  // PUBLIC_INTERFACE
  sidebarCollapsed = false;

  // PUBLIC_INTERFACE
  isSmallScreen = false;

  // For platform detection (SSR safe)
  private isBrowser: boolean;

  // ==================
  // Device Details/Edit Dialog State
  // ==================
  selectedDevice: DeviceDetails|null = null;
  showDetailsDialog = false;
  showEditDialog = false;

  // PUBLIC_INTERFACE
  openDeviceDetails(device: DeviceDetails) {
    this.selectedDevice = device;
    this.showDetailsDialog = true;
    this.showEditDialog = false;
  }
  // PUBLIC_INTERFACE
  closeDetailsDialog() {
    this.showDetailsDialog = false;
  }
  // PUBLIC_INTERFACE
  openEditDialog() {
    this.showDetailsDialog = false;
    this.showEditDialog = true;
  }
  // PUBLIC_INTERFACE
  closeEditDialog() {
    this.showEditDialog = false;
  }
  // PUBLIC_INTERFACE
  saveDeviceEdit(edited: DeviceDetails) {
    // For now just close dialog and optionally update mock data
    // (replace with real API call or update logic later)
    if (this.selectedDevice) {
      Object.assign(this.selectedDevice, edited);
    }
    this.closeEditDialog();
    this.showDetailsDialog = true; // Optionally reopen details dialog updated.
  }

  // PUBLIC_INTERFACE
  selectSidebar(index: number) {
    this.selectedSidebarIndex = index;
  }

  // PUBLIC_INTERFACE
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // PUBLIC_INTERFACE
  @HostListener('window:resize', [])
  onResize() {
    if (this.isBrowser && typeof globalThis !== "undefined" && globalThis.window) {
      this.isSmallScreen = globalThis.window.innerWidth <= 780;
      if (this.isSmallScreen) {
        this.sidebarCollapsed = true;
      }
    }
  }

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser && typeof globalThis !== "undefined" && globalThis.window) {
      this.onResize();
    }
  }
}
