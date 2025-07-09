import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, NotificationMessage } from './notification.service';
import { Subscription } from 'rxjs';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="notif-container">
  <button class="notif-bell" aria-label="Notifications" [attr.aria-expanded]="dropdownOpen"
    (click)="toggleDropdown()" [class.has-unread]="unreadCount > 0">
    <span class="material-symbols-outlined bell-icon">notifications</span>
    <span *ngIf="unreadCount > 0" class="notif-dot" aria-label="{{unreadCount}} unread notifications">{{unreadCount}}</span>
  </button>
  <div *ngIf="dropdownOpen" class="notif-dropdown" (mouseleave)="dropdownOpen=false" tabindex="0" role="menu" aria-label="Notifications">
    <div class="notif-dropdown-header">
      <span>Notifications</span>
      <button class="notif-clear-btn" (click)="clearAll($event)" type="button">Clear All</button>
    </div>
    <div *ngIf="notifications.length === 0" class="notif-empty">No notifications yet.</div>
    <div *ngFor="let n of notifications.slice(0,8)" class="notif-item" [class.notif-unread]="!n.read" (mouseenter)="markRead(n.id)">
      <span class="notif-icon" [ngClass]="n.type || 'info'">
        <span class="material-symbols-outlined">{{getIcon(n.type)}}</span>
      </span>
      <div class="notif-content">
        <div class="notif-title">{{n.title || 'Notification'}}</div>
        <div class="notif-body">{{n.message}}</div>
        <div class="notif-time">{{formatTime(n.timestamp)}}</div>
      </div>
    </div>
    <div *ngIf="notifications.length > 8" class="notif-more">Only showing last 8</div>
  </div>
  <!-- Toast popups (latest only, auto-dismiss after 5s) -->
  <div *ngIf="activeToast" class="notif-toast" [ngClass]="activeToast.type">
    <span class="notif-icon"><span class="material-symbols-outlined">{{getIcon(activeToast.type)}}</span></span>
    <span>{{activeToast.message}}</span>
    <button class="notif-toast-close" (click)="dismissToast()" aria-label="Dismiss notification">&times;</button>
  </div>
</div>
  `,
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent implements OnInit, OnDestroy {
  notifications: NotificationMessage[] = [];
  unreadCount = 0;
  dropdownOpen = false;
  toastTimer: number | null = null;
  activeToast: NotificationMessage | null = null;
  private notiSub?: Subscription;

  private notificationService = inject(NotificationService);

  // Utility: linter/SSR-safe setTimeout/clearTimeout using globalThis only and property access
  private safeSetTimeout(...args: any[]): number {
    const st = (globalThis as any)['setTimeout'];
    return typeof st === 'function' ? st(...args) : 0;
  }
  private safeClearTimeout(id: any) {
    const ct = (globalThis as any)['clearTimeout'];
    if (typeof ct === 'function') ct(id);
  }

  ngOnInit() {
    this.notiSub = this.notificationService.notifications$.subscribe(nots => {
      this.notifications = nots;
      this.unreadCount = nots.filter(n => !n.read).length;
      if (nots.length > 0 && !nots[0].read) {
        this.showToast(nots[0]);
      }
    });
  }

  ngOnDestroy() {
    this.notiSub?.unsubscribe();
    if (this.toastTimer) this.safeClearTimeout(this.toastTimer);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.safeSetTimeout(() => this.notificationService.markAllAsRead(), 350);
    }
  }
  markRead(id: number) {
    this.notificationService.markAsRead(id);
  }
  clearAll(evt: MouseEvent) {
    evt.stopPropagation();
    this.notificationService.clearNotifications();
    this.dropdownOpen = false;
  }

  getIcon(type?: string) {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error':   return 'error';
      case 'warning': return 'warning';
      case 'info':
      default:        return 'info';
    }
  }
  formatTime(date?: Date) {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = (+now - +d) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)} hr ago`;
    return d.toLocaleString();
  }
  // Toast popup logic for unobtrusive alerts
  showToast(msg: NotificationMessage) {
    this.activeToast = msg;
    if (this.toastTimer) this.safeClearTimeout(this.toastTimer);
    this.toastTimer = this.safeSetTimeout(() => this.dismissToast(), 5100);
  }
  dismissToast() {
    this.activeToast = null;
  }
}
