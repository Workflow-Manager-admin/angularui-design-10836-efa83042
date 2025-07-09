import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartDataset } from 'chart.js';

/**
 * Dashboard Charts component displays visualizations for Network Activity,
 * Device Acquisitions, and Content Usage using ng2-charts and mock data.
 * Charts are styled to match dashboard theme with rounded corners and shadows.
 */
@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard-charts.component.html',
  styleUrl: './dashboard-charts.component.css'
})
export class DashboardChartsComponent {
  // Only render charts on the browser (not during SSR/prerender)
  isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // PUBLIC_INTERFACE
  networkActivityChart = {
    datasets: [
      {
        label: 'Inbound Traffic',
        data: [42, 58, 66, 61, 75, 70, 80, 77, 90, 100, 88, 93],
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.18)',
        fill: true,
        tension: 0.32,
        pointRadius: 5,
        pointBackgroundColor: '#1976d2'
      },
      {
        label: 'Outbound Traffic',
        data: [27, 42, 55, 52, 62, 60, 67, 65, 74, 81, 77, 80],
        borderColor: '#ff4081',
        backgroundColor: 'rgba(255,64,129,0.15)',
        fill: true,
        tension: 0.28,
        pointRadius: 5,
        pointBackgroundColor: '#ff4081'
      }
    ] as ChartDataset<'line'>[],
    labels: [
      '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'
    ]
  };
  networkActivityOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: false }
    },
    elements: {
      line: { borderWidth: 3, borderJoinStyle: 'round' },
      point: { borderWidth: 2 }
    },
    scales: {
      x: { grid: { color: 'rgba(200,200,200,0.05)' }},
      y: { grid: { color: 'rgba(150,150,150,0.07)' }}
    }
  };

  // PUBLIC_INTERFACE
  deviceAcquisitionChart = {
    datasets: [
      {
        label: 'Acquisitions',
        data: [3, 6, 9, 7],
        backgroundColor: '#45C29E',
        borderWidth: 2,
        borderRadius: 10,
        barThickness: 28
      }
    ] as ChartDataset<'bar'>[],
    labels: ['Q1', 'Q2', 'Q3', 'Q4']
  };
  deviceAcquisitionOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      x: { grid: { color: 'rgba(200,200,200,0.08)' }},
      y: { grid: { color: 'rgba(150,150,150,0.08)' }, beginAtZero: true }
    }
  };

  // PUBLIC_INTERFACE
  contentUsageChart = {
    datasets: [
      {
        label: 'Video',
        data: [18, 14, 20, 15],
        backgroundColor: 'rgba(25, 118, 210, 0.95)',
        stack: 'main'
      },
      {
        label: 'Web',
        data: [11, 13, 7, 9],
        backgroundColor: 'rgba(100, 181, 246, 0.90)',
        stack: 'main'
      },
      {
        label: 'Gaming',
        data: [5, 7, 8, 6],
        backgroundColor: 'rgba(69,194,158,0.80)',
        stack: 'main'
      },
      {
        label: 'Social',
        data: [6, 8, 5, 7],
        backgroundColor: 'rgba(255,64,129,0.68)',
        stack: 'main'
      }
    ] as ChartDataset<'bar'>[],
    labels: ['Mon', 'Tue', 'Wed', 'Thu']
  };
  contentUsageOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
      title: { display: false }
    },
    scales: {
      x: { stacked: true, grid: { color: 'rgba(220,220,220,0.09)' }},
      y: { stacked: true, beginAtZero: true, grid: { color: 'rgba(150,150,150,0.07)' } }
    }
  };
}
