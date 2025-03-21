import React, { useRef, useEffect } from 'react';
import uPlot from 'uplot';
import './UPlotChart.css';

interface UPlotChartProps {
  data: any[]; // CSVData[]
}

function UPlotChart({ data }: UPlotChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const uPlotRef = useRef<uPlot | null>(null);

  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      // Extract headers/columns
      const columns = Object.keys(data[0]);

      // Convert data to uPlot format
      const uPlotData: any[] = [
        columns, // column names as the first row
        ...data.map(row => columns.map(col => row[col])) // each row of data
      ];

      // uPlot options
      const opts: uPlot.Options = {
        title: "CSV Data Plot",
        width: 800,
        height: 600,
        series: [
          {}, // x axis
          ...columns.slice(1).map(col => ({ // y axes
            label: col,
            stroke: '#' + Math.floor(Math.random() * 16777215).toString(16) // Random color
          }))
        ],
        axes: [
          {},
          {
            side: 1,
          },
        ]
      };

      // Destroy previous chart if it exists
      if (uPlotRef.current) {
        uPlotRef.current.destroy();
      }

      // Create new chart
      uPlotRef.current = new uPlot(opts, uPlotData, chartRef.current);
    }

    return () => {
      if (uPlotRef.current) {
        uPlotRef.current.destroy();
      }
    };
  }, [data]);

  return <div ref={chartRef} className="uplot-chart" />;
}

export default UPlotChart;