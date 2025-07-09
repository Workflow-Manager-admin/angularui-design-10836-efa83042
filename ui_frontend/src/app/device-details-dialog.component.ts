import { Component, Input, Output, EventEmitter, OnInit, Inject, PLATFORM_ID, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

// Type for displaying full device details
export interface DeviceDetails {
  name: string;
  ip: string;
  status: 'Online' | 'Offline';
  model: string;
  manufacturer: string;
  version: string;
  location: string;
  type: string;
  // Extra properties to show in details (for demo, can be extended)
  uptime?: string;
  productClass?: string;
  connectionType?: string;
  signalStrength?: string;
  temperature?: string;
  memoryUsage?: string;
}

@Component({
  selector: 'app-device-details-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="modal-backdrop" (click)="onClose($event)">
  <div #modalDialogEl class="modal-dialog" (click)="$event.stopPropagation()" tabindex="0" role="dialog" aria-modal="true">
    <header class="modal-header">
      <h3>Device Details</h3>
      <button class="modal-close-btn" aria-label="Close details dialog" (click)="close.emit()">&times;</button>
    </header>
    <div class="modal-body">
      <div class="device-details-display">
        <div class="detail-row"><strong>Status:</strong> <span [ngClass]="device.status === 'Online' ? 'online' : 'offline'">{{device.status}}</span></div>
        <div class="detail-row"><strong>Name:</strong> {{device.name}}</div>
        <div class="detail-row"><strong>IP Address:</strong> {{device.ip}}</div>
        <div class="detail-row"><strong>Model:</strong> {{device.model}}</div>
        <div class="detail-row"><strong>Manufacturer:</strong> {{device.manufacturer}}</div>
        <div class="detail-row"><strong>Location:</strong> {{device.location}}</div>
        <div class="detail-row"><strong>Type:</strong> {{device.type}}</div>
        <div class="detail-row"><strong>Software Version:</strong> {{device.version}}</div>
        <div class="detail-row" *ngIf="device.uptime"><strong>Uptime:</strong> {{device.uptime}}</div>
        <div class="detail-row" *ngIf="device.productClass"><strong>Product Class:</strong> {{device.productClass}}</div>
        <div class="detail-row" *ngIf="device.connectionType"><strong>Connection Type:</strong> {{device.connectionType}}</div>
        <div class="detail-row" *ngIf="device.signalStrength"><strong>Signal Strength:</strong> {{device.signalStrength}}</div>
        <div class="detail-row" *ngIf="device.temperature"><strong>Temperature:</strong> {{device.temperature}}</div>
        <div class="detail-row" *ngIf="device.memoryUsage"><strong>Memory Usage:</strong> {{device.memoryUsage}}</div>
      </div>
    </div>
    <footer class="modal-footer">
      <button type="button" class="modal-btn modal-btn-edit" (click)="edit.emit()">Edit</button>
      <button type="button" class="modal-btn modal-btn-close" (click)="close.emit()">Close</button>
    </footer>
  </div>
</div>
  `,
  styleUrls: ['./device-details-dialog.component.css']
})
export class DeviceDetailsDialogComponent implements OnInit {
  @Input() device!: DeviceDetails;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  private isBrowser: boolean;

  @ViewChild('modalDialogEl') dialogRef!: ElementRef;

  private readonly _renderer: Renderer2;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    renderer: Renderer2
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._renderer = renderer;
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    // Browser-only, focus the modal dialog for accessibility and keyboard nav
    if (this.isBrowser && this.dialogRef) {
      this._renderer.selectRootElement(this.dialogRef.nativeElement, true).focus();
    }
  }
  // For closing by clicking outside modal surface.
  onClose(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
