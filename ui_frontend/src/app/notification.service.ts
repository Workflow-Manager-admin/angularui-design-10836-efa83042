import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Type for notification structure
export interface NotificationMessage {
  id: number;            // Unique id
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  deviceId?: string;
  timestamp?: Date;
  read?: boolean;
}

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<NotificationMessage[]>([]);
  public readonly notifications$: Observable<NotificationMessage[]> = this.notificationsSubject.asObservable();

  private counter = 1;

  // PUBLIC_INTERFACE
  getNotifications(): NotificationMessage[] {
    return this.notificationsSubject.getValue();
  }

  // PUBLIC_INTERFACE
  addNotification(msg: Omit<NotificationMessage, 'id' | 'timestamp' | 'read'>) {
    const noti: NotificationMessage = {
      ...msg,
      id: this.counter++,
      timestamp: new Date(),
      read: false
    };
    const updated = [noti, ...this.getNotifications()];
    this.notificationsSubject.next(updated);
  }

  // PUBLIC_INTERFACE
  markAllAsRead() {
    const updated = this.getNotifications().map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updated);
  }

  // PUBLIC_INTERFACE
  markAsRead(id: number) {
    const updated = this.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    this.notificationsSubject.next(updated);
  }

  // PUBLIC_INTERFACE
  clearNotifications() {
    this.notificationsSubject.next([]);
  }

  // PUBLIC_INTERFACE
  mockDemoDeviceEvent() {
    // Call to simulate device status events for demo
    const examples = [
      {
        title: 'Device Offline',
        message: 'Device "Storage NAS" (192.168.1.7) went offline.',
        type: 'warning'
      },
      {
        title: 'Device Online',
        message: 'Device "Switch Floor 2" (192.168.1.31) is back online.',
        type: 'success'
      },
      {
        title: 'Temperature Alert',
        message: 'Device "Main Router" temperature exceeds threshold (51°C).',
        type: 'error'
      },
      {
        title: 'New Device',
        message: 'A new device "POS Terminal 2" was added to the network.',
        type: 'info'
      }
    ];
    const idx = Math.floor(Math.random() * examples.length);
    this.addNotification(examples[idx]);
  }
}
