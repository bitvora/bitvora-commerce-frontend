/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import numeral from 'numeral';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
);

interface AreaChartProps {
  data: number[];
  showPrimary?: boolean;
  showYAxisLabel?: boolean;
  labels: string[];
  label: string;
  labelFormatter?: (value: string) => string;
}

function getGradient(ctx: any, chartArea: any): any {
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

  gradient.addColorStop(1, '#5C487F');
  gradient.addColorStop(0.3, '#1E162C');
  gradient.addColorStop(0.2, '#15101E');
  gradient.addColorStop(0, '#100C17');

  return gradient;
}

export const AreaChart = ({
  data,
  showPrimary = false,
  showYAxisLabel = true,
  labels,
  label,
  labelFormatter
}: AreaChartProps) => {
  return (
    <Line
      height={500}
      data={{
        labels,
        datasets: [
          {
            label,
            data,
            borderColor: '#78619E',
            borderWidth: 3,
            fill: 'start',
            tension: 0.4,
            backgroundColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;

              if (!chartArea) return;
              return getGradient(ctx, chartArea);
            }
          }
        ]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            ticks: {
              color: showYAxisLabel ? '#9791a1' : 'transparent',
              autoSkip: false,
              count: 5,
              maxTicksLimit: 7,
              padding: 20
            },
            grid: {
              color: '#9791a1',
              drawOnChartArea: true,
              drawTicks: false,
              lineWidth: 0.1
            },
            beginAtZero: true
          },
          x: {
            display: showPrimary
          }
        },
        plugins: {
          title: {
            display: false
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: function (tooltipItem) {
                return labelFormatter ? labelFormatter(tooltipItem[0].label) : tooltipItem[0].label;
              },
              label: function () {
                return label;
              },
              afterLabel: function () {
                return '________________';
              },
              footer: function (tooltipItem) {
                return tooltipItem[0].formattedValue.toString() + ' SATS';
              }
            },
            enabled: true,
            intersect: true,
            mode: 'point',
            titleColor: '#C69A71',
            titleSpacing: 2,
            titleMarginBottom: 5,
            titleFont: {
              size: 12,
              weight: 'bolder'
            },
            bodyColor: '#EFEDF1',
            displayColors: false,
            borderWidth: 1
          }
        }
      }}
    />
  );
};

interface BarChartProps {
  dataset: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }>;
  showPrimary?: boolean;
  labels: string[];
}

export const BarChart = ({ dataset, labels, showPrimary = false }: BarChartProps) => {
  return (
    <Bar
      height={600}
      data={{
        labels,
        datasets: dataset.map(({ data, label, backgroundColor, borderColor }) => ({
          label,
          data,
          backgroundColor,
          borderWidth: 2,
          borderSkipped: false,
          borderRadius: 10,
          borderColor
        }))
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          legend: {
            position: 'bottom',
            labels: {
              generateLabels: function (chart) {
                const labels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
                labels.forEach((label: any) => {
                  const dataset = chart.data.datasets[label.datasetIndex];
                  const sum = dataset.data.reduce(
                    (acc: any, currentValue: any) => acc + currentValue,
                    0
                  );
                  label.text += `    ${numeral(sum).format('0,0')} SATS`;
                });
                return labels;
              },
              color: '#EFEDF1',
              padding: 25,
              boxWidth: 5,
              font: {
                size: 13,
                weight: 'bolder'
              }
            }
          },
          tooltip: {
            callbacks: {
              title: function (tooltipItem) {
                return tooltipItem[0].label;
              },
              label: function (tooltipItem) {
                return tooltipItem.dataset.label;
              },
              afterLabel: function () {
                return '________________';
              },
              footer: function (tooltipItem) {
                return `${numeral(Math.abs(Number(tooltipItem[0].raw))).format('0,0')} SATS`;
              }
            },
            enabled: true,
            intersect: true,
            mode: 'point',
            titleColor: '#C69A71',
            titleSpacing: 2,
            titleMarginBottom: 5,
            titleFont: {
              size: 12,
              weight: 'bolder'
            },
            bodyColor: '#EFEDF1',
            displayColors: false,
            borderWidth: 1
          }
        },
        scales: {
          x: {
            display: showPrimary
          },
          y: {
            beginAtZero: false,
            ticks: {
              callback: function (value) {
                return Math.abs(Number(value));
              }
            },
            grid: {
              color: '#9791a1',
              drawOnChartArea: true,
              drawTicks: false,
              lineWidth: 0.1
            }
          }
        }
      }}
    />
  );
};
