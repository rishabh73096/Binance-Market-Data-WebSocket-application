import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-chart-financial'; // Import financial charting library
import dayjs from 'dayjs';
import 'chartjs-adapter-date-fns'; // or 'chartjs-adapter-dayjs' if preferred

// Register necessary components
Chart.register(...registerables);
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
Chart.register(CandlestickController, CandlestickElement);

const ChartComponent = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // Prepare the chart data by converting time and parsing prices
    const chartData = data.map(item => ({
      t: dayjs(item.time).toDate(), // Convert time to Date object using Day.js
      o: parseFloat(item.open),
      h: parseFloat(item.high),
      l: parseFloat(item.low),
      c: parseFloat(item.close),
    }));

    // Destroy previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create a new chart instance
    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'candlestick',
      data: {
        datasets: [{
          label: 'Candlestick Chart',
          data: chartData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              tooltipFormat: 'PPpp', // Format for tooltips
              displayFormats: {
                minute: 'HH:mm',
              },
            },
          },
          y: {
            beginAtZero: false,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return [
                  `Open: ${context.raw.o}`,
                  `High: ${context.raw.h}`,
                  `Low: ${context.raw.l}`,
                  `Close: ${context.raw.c}`,
                ];
              },
            },
          },
        },
      },
    },[data]);

    // Clean up the chart instance on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;
