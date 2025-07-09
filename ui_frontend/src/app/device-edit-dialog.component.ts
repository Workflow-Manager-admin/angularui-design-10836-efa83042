import { Component, Input, Output, EventEmitter, OnInit, Inject, PLATFORM_ID, ElementRef, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceDetails } from './device-details-dialog.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-device-edit-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="modal-backdrop" (click)="onClose($event)">
  <form #modalDialogEl class="modal-dialog" (ngSubmit)="onSubmit()" (click)="$event.stopPropagation()" tabindex="0" role="dialog" aria-modal="true">
    <header class="modal-header">
      <h3>Edit Device</h3>
      <button class="modal-close-btn" aria-label="Close edit dialog" (click)="close.emit(); $event.preventDefault()">&times;</button>
    </header>
    <div class="modal-body">
      <div class="edit-fields-grid">
        <label>
          <span>Name</span>
          <input type="text" [(ngModel)]="editData.name" name="name" required autocomplete="off"/>
        </label>
        <label>
          <span>IP Address</span>
          <input type="text" [(ngModel)]="editData.ip" name="ip" required autocomplete="off"/>
        </label>
        <label>
          <span>Status</span>
          <select [(ngModel)]="editData.status" name="status" required>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </label>
        <label>
          <span>Model</span>
          <input type="text" [(ngModel)]="editData.model" name="model"/>
        </label>
        <label>
          <span>Manufacturer</span>
          <input type="text" [(ngModel)]="editData.manufacturer" name="manufacturer"/>
        </label>
        <label>
          <span>Location</span>
          <input type="text" [(ngModel)]="editData.location" name="location"/>
        </label>
        <label>
          <span>Type</span>
          <input type="text" [(ngModel)]="editData.type" name="type"/>
        </label>
        <label>
          <span>Software Version</span>
          <input type="text" [(ngModel)]="editData.version" name="version"/>
        </label>
        <!-- Extra fields, optional -->
        <label>
          <span>Uptime</span>
          <input type="text" [(ngModel)]="editData.uptime" name="uptime"/>
        </label>
        <label>
          <span>Product Class</span>
          <input type="text" [(ngModel)]="editData.productClass" name="productClass"/>
        </label>
        <label>
          <span>Connection Type</span>
          <input type="text" [(ngModel)]="editData.connectionType" name="connectionType"/>
        </label>
        <label>
          <span>Signal (dBm)</span>
          <input type="text" [(ngModel)]="editData.signalStrength" name="signalStrength"/>
        </label>
        <label>
          <span>Temperature (°C)</span>
          <input type="text" [(ngModel)]="editData.temperature" name="temperature"/>
        </label>
        <label>
          <span>Memory Usage (%)</span>
          <input type="text" [(ngModel)]="editData.memoryUsage" name="memoryUsage"/>
        </label>
      </div>
    </div>
    <footer class="modal-footer">
      <button type="submit" class="modal-btn modal-btn-primary">Save</button>
      <button type="button" class="modal-btn modal-btn-close" (click)="close.emit()">Cancel</button>
    </footer>
  </form>
</div>
  `,
  styleUrls: ['./device-edit-dialog.component.css']
})
export class DeviceEditDialogComponent implements OnInit, AfterViewInit {
  @Input() device!: DeviceDetails;
  @Output() save = new EventEmitter<DeviceDetails>();
  @Output() close = new EventEmitter<void>();

  editData: DeviceDetails = { 
    name: '', ip: '', status: 'Offline', model: '', manufacturer: '', version: '', location: '', type: ''
  };

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

  ngOnInit(): void {
    this.editData = { ...(this.device ?? {}) };
  }
  ngAfterViewInit(): void {
    if (this.isBrowser && this.dialogRef) {
      this._renderer.selectRootElement(this.dialogRef.nativeElement, true).focus();
    }
  }

  onSubmit() {
    this.save.emit({ ...this.editData });
    this.close.emit();
  }
  // For closing by clicking modal backdrop.
  onClose(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
