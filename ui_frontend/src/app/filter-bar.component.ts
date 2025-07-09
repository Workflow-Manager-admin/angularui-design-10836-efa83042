import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DeviceFilter {
  search?: string;
  status?: 'all'|'online'|'offline';
  manufacturer?: string;
  location?: string;
  type?: string;
  // Other criteria can be added
}

// PUBLIC_INTERFACE
@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="filter-bar">
    <input class="filter-input" type="search"
      [value]="filters.search||''"
      (input)="onSearch($event)"
      placeholder="Search by name, IP, model…"
      aria-label="Search devices" />

    <select class="filter-select" (change)="onStatus($event)" [value]="filters.status||'all'" aria-label="Status filter">
      <option value="all">All Status</option>
      <option value="online">Online</option>
      <option value="offline">Offline</option>
    </select>

    <select class="filter-select" (change)="onManu($event)" [value]="filters.manufacturer||''" aria-label="Manufacturer filter">
      <option value="">All Manufacturers</option>
      <option *ngFor="let m of manufacturers" [value]="m">{{m}}</option>
    </select>

    <select class="filter-select" (change)="onLoc($event)" [value]="filters.location||''" aria-label="Location filter">
      <option value="">All Locations</option>
      <option *ngFor="let l of locations" [value]="l">{{l}}</option>
    </select>

    <select class="filter-select" (change)="onType($event)" [value]="filters.type||''" aria-label="Type filter">
      <option value="">All Types</option>
      <option *ngFor="let t of types" [value]="t">{{t}}</option>
    </select>
  </div>
  `,
  styleUrl: './filter-bar.component.css'
})
export class FilterBarComponent {
  @Input({required:true}) manufacturers: string[] = [];
  @Input({required:true}) locations: string[] = [];
  @Input({required:true}) types: string[] = [];
  @Input() filters: DeviceFilter = {};

  @Output() filterChanged = new EventEmitter<DeviceFilter>();

  // PUBLIC_INTERFACE
  onSearch(ev: Event) {
    const q = (ev.target as HTMLInputElement).value;
    this.filterChanged.emit({...this.filters, search: q});
  }
  onStatus(ev: Event) {
    const status = (ev.target as HTMLSelectElement).value as 'all'|'online'|'offline';
    this.filterChanged.emit({...this.filters, status});
  }
  onManu(ev: Event) {
    const manufacturer = (ev.target as HTMLSelectElement).value;
    this.filterChanged.emit({...this.filters, manufacturer});
  }
  onLoc(ev: Event) {
    const location = (ev.target as HTMLSelectElement).value;
    this.filterChanged.emit({...this.filters, location});
  }
  onType(ev: Event) {
    const type = (ev.target as HTMLSelectElement).value;
    this.filterChanged.emit({...this.filters, type});
  }
}
