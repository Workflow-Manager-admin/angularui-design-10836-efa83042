import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * AnalyticsCardsComponent displays multiple analytics/statistics
 * cards such as Device OS Distribution, Top Manufacturers, and
 * Quick Network Stats, to be added to the dashboard.
 */
// PUBLIC_INTERFACE
@Component({
  selector: 'app-analytics-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="dashboard-cards-analytics-row">
    <!-- OS Distribution -->
    <div class="dashboard-card analytics-card">
      <h2>Device OS Distribution</h2>
      <ul class="analytics-list">
        <li><span>IOS XE</span> <span class="analytics-value">14</span></li>
        <li><span>UniFi OS</span> <span class="analytics-value">7</span></li>
        <li><span>QTS</span> <span class="analytics-value">5</span></li>
        <li><span>Windows IoT</span> <span class="analytics-value">2</span></li>
      </ul>
    </div>
    <!-- Top Manufacturers -->
    <div class="dashboard-card analytics-card">
      <h2>Top Manufacturers</h2>
      <ul class="analytics-list">
        <li><span>Cisco</span> <span class="analytics-value">15</span></li>
        <li><span>Ubiquiti</span> <span class="analytics-value">7</span></li>
        <li><span>QNAP</span> <span class="analytics-value">5</span></li>
        <li><span>Epson</span> <span class="analytics-value">2</span></li>
      </ul>
    </div>
    <!-- Network Health Stats -->
    <div class="dashboard-card analytics-card">
      <h2>Network Health</h2>
      <ul class="analytics-list">
        <li><span>Avg. Latency</span> <span class="analytics-value">13 ms</span></li>
        <li><span>Packet Loss</span> <span class="analytics-value">0.02%</span></li>
        <li><span>Max. Uptime</span> <span class="analytics-value">154 days</span></li>
        <li><span>CPU Usage</span> <span class="analytics-value">62%</span></li>
      </ul>
    </div>
  </section>
  `,
  styleUrl: './analytics-cards.component.css'
})
export class AnalyticsCardsComponent {}
