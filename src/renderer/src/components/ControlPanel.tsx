import React from 'react';
import './ControlPanel.css';

interface ControlPanelProps {
  onLoadCSV: () => void;
}

function ControlPanel({ onLoadCSV }: ControlPanelProps) {
  return (
    <div className="control-panel">
      <button onClick={onLoadCSV}>Load CSV</button>
      {/* Add more buttons and controls here */}
    </div>
  );
}

export default ControlPanel;