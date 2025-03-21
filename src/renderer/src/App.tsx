import React, { useState, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import UPlotChart from './components/UPlotChart';
import './App.css';

interface CSVData {
  [key: string]: any;
}

interface CSVError {
  error: string;
}

declare global {
  interface Window {
    electron: {
      loadCSV: () => Promise<CSVData[] | CSVError | null>;
    };
  }
}

function App() {
  const [csvData, setCsvData] = useState<CSVData[] | CSVError | null>(null); // Changed to allow null

  const handleLoadCSV = async () => {
    const data = await window.electron.loadCSV();

    if (data && !("error" in data)) {
      //  значит, это CSVData[]
      setCsvData(data);
    } else if (data && "error" in data) {
      //  значит, это CSVError
      console.error('Failed to load CSV data:', data.error);
      alert(`Failed to load CSV data: ${data.error}`);
      setCsvData(null); // Reset csvData to null when there is an error
    }
  };

  return (
    <div className="app-container">
      <ControlPanel onLoadCSV={handleLoadCSV} />
      <UPlotChart data={csvData && !("error" in csvData) ? csvData : []} />
    </div>
  );
}

export default App;