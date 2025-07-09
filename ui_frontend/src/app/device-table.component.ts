import { Component, Input, Signal, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * DeviceTableComponent displays a list of devices in a responsive,
 * searchable, and filterable table/card layout, matching dashboard UI.
 * It uses an internal search/filter input, but allows parent to set initial devices.
 */
// PUBLIC_INTERFACE
@Component({
  selector: 'app-device-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-table.component.html',
  styleUrl: './device-table.component.css'
})
export class DeviceTableComponent implements OnInit {
  /** List of all devices (input from parent, could wire to API/service) */
  @Input() devices: any[] = [];

  searchQuery = signal('');
  statusFilter = signal<'all'|'online'|'offline'>('all');

  filteredDevices: Signal<any[]> = computed(() => {
    let filtered = this.devices;
    const q = this.searchQuery().toLowerCase().trim();
    if (q.length > 0) {
      filtered = filtered.filter(d =>
        d.name?.toLowerCase().includes(q) ||
        d.ip?.toLowerCase().includes(q) ||
        d.model?.toLowerCase().includes(q) ||
        d.manufacturer?.toLowerCase().includes(q)
      );
    }
    if (this.statusFilter() !== 'all') {
      filtered = filtered.filter(
        d => (this.statusFilter() === 'online' ? d.status === 'Online' : d.status === 'Offline')
      );
    }
    return filtered;
  });

  onlineCount = computed(() => this.devices.filter(d => d.status === 'Online').length);
  offlineCount = computed(() => this.devices.filter(d => d.status === 'Offline').length);

  ngOnInit() {
    // If no devices yet, use local mock (so empty input shows some demo)
    if (!this.devices || this.devices.length === 0) {
      this.devices = [
        {
          name: 'Main Router',
          ip: '192.168.1.1',
          status: 'Online',
          model: 'ISR 4331',
          manufacturer: 'Cisco',
          version: '16.09.04',
          location: 'Main Office',
          type: 'Router'
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
    }
  }

  // These wrapper methods catch (input) and (change) events from the template.
  // They extract the value safely from the event.
  // PUBLIC_INTERFACE
  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  // PUBLIC_INTERFACE
  onStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    // Ensure only allowed type values.
    const val = (target.value ?? 'all') as 'all'|'online'|'offline';
    this.statusFilter.set(val);
  }
}
