import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { DashboardChartsComponent } from './dashboard-charts.component';
import { DeviceTableComponent, DeviceTableRow } from './device-table.component';
import { DeviceDetailsDialogComponent, DeviceDetails } from './device-details-dialog.component';
import { DeviceEditDialogComponent } from './device-edit-dialog.component';
import { NotificationCenterComponent } from './notification-center.component';
import { NotificationService } from './notification.service';
// New components for analytics cards and filter bar:
import { AnalyticsCardsComponent } from './analytics-cards.component';
import { FilterBarComponent, DeviceFilter } from './filter-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DashboardChartsComponent,
    DeviceTableComponent,
    DeviceDetailsDialogComponent,
    DeviceEditDialogComponent,
    NotificationCenterComponent,
    AnalyticsCardsComponent,
    FilterBarComponent
  ],
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

  // === ADVANCED FILTER BAR/DEVICE LIST STATE ===
  // Source of truth device list (should match DeviceTableComponent mock fallback)
  readonly dashboardDevices: DeviceTableRow[] = [
    {
      name: 'Main Router',
      ip: '192.168.1.1',
      status: 'Online',
      model: 'ISR 4331',
      manufacturer: 'Cisco',
      version: '16.09.04',
      location: 'Main Office',
      type: 'Router',
      uptime: '127 days',
      productClass: 'Router',
      connectionType: 'Ethernet/WiFi',
      signalStrength: '-45 dBm',
      temperature: '42°C',
      memoryUsage: '68%'
    },
    {
      name: 'Switch Floor 2',
      ip: '192.168.1.31',
      status: 'Online',
      model: 'SG350',
      manufacturer: 'Cisco',
      version: '2.5.1',
      location: '2nd Floor',
      type: 'Switch'
    },
    {
      name: 'Storage NAS',
      ip: '192.168.1.7',
      status: 'Offline',
      model: 'TS-451',
      manufacturer: 'QNAP',
      version: '5.1.4',
      location: 'Server Room',
      type: 'Storage'
    },
    {
      name: 'AP-Lobby',
      ip: '192.168.1.15',
      status: 'Online',
      model: 'UniFi AP',
      manufacturer: 'Ubiquiti',
      version: '6.5.28',
      location: 'Lobby',
      type: 'WiFi'
    },
    {
      name: 'POS Terminal 1',
      ip: '192.168.2.10',
      status: 'Offline',
      model: 'Epson TM',
      manufacturer: 'Epson',
      version: '8.2.0',
      location: 'Front Desk',
      type: 'POS'
    },
    {
      name: 'Conference Cam',
      ip: '192.168.2.20',
      status: 'Online',
      model: 'LogiCam Pro',
      manufacturer: 'Logitech',
      version: '3.3.7',
      location: 'Conf Room',
      type: 'Cam'
    }
  ];

  // Unique lists for advanced filter controls
  deviceManufacturers: string[] = [];
  deviceLocations: string[] = [];
  deviceTypes: string[] = [];

  // PUBLIC_INTERFACE
  // Holds the current applied advanced filters (to pass downward)
  activeDeviceFilters: DeviceFilter = {
    search: '',
    status: 'all',
    manufacturer: '',
    location: '',
    type: ''
  };

  // Signal-backed filtered list for device table
  filteredDeviceList: DeviceTableRow[] = [];

  // Populate unique filter values and initialize filtered device list
  private recomputeAdvFiltersAndFilteredList() {
    // Extract unique manufacturers/locations/types from devices:
    const devs = this.dashboardDevices;
    this.deviceManufacturers = Array.from(
      new Set(devs.map(d => d.manufacturer).filter(Boolean))
    ).sort();
    this.deviceLocations = Array.from(
      new Set(devs.map(d => d.location).filter(Boolean))
    ).sort();
    this.deviceTypes = Array.from(
      new Set(devs.map(d => d.type).filter(Boolean))
    ).sort();
    this.applyDeviceFilters();
  }

  // PUBLIC_INTERFACE
  onDeviceFilterChange(filters: DeviceFilter) {
    this.activeDeviceFilters = { ...filters };
    this.applyDeviceFilters();
  }

  // PUBLIC_INTERFACE
  applyDeviceFilters() {
    // Filter devices based on advanced filters.
    let filtered = this.dashboardDevices;
    const f = this.activeDeviceFilters;

    if (f.search && f.search.trim()) {
      const q = f.search.trim().toLowerCase();
      filtered = filtered.filter(d =>
        d.name?.toLowerCase().includes(q)
        || d.ip?.toLowerCase().includes(q)
        || d.model?.toLowerCase().includes(q)
        || d.manufacturer?.toLowerCase().includes(q)
      );
    }
    if (f.status && f.status !== 'all') {
      filtered = filtered.filter(d => d.status.toLowerCase() === f.status);
    }
    if (f.manufacturer) {
      filtered = filtered.filter(d => d.manufacturer === f.manufacturer);
    }
    if (f.location) {
      filtered = filtered.filter(d => d.location === f.location);
    }
    if (f.type) {
      filtered = filtered.filter(d => d.type === f.type);
    }
    this.filteredDeviceList = filtered;
  }

  // ---- END ADVANCED FILTER BAR/DEVICE STATE ----

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

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    notificationService: NotificationService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser && typeof globalThis !== "undefined" && globalThis.window) {
      this.onResize();
    }
    this._notificationService = notificationService;

    // Set up advanced filter values from devices (init on startup):
    this.recomputeAdvFiltersAndFilteredList();
  }

  private _notificationService: NotificationService;


  // PUBLIC_INTERFACE
  triggerDemoNotification() {
    // Triggers a mock device event notification for demo
    this._notificationService.mockDemoDeviceEvent();
  }
}
