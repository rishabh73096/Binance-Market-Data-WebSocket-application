import React from 'react';

const TimeframeSelector = ({ onSelect }) => {
  const intervals = ['1m', '3m', '5m'];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Select Timeframe:</label>
      <select 
        onChange={(e) => onSelect(e.target.value)} 
        className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
      >
        {intervals.map((interval) => (
          <option key={interval} value={interval}>
            {interval}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeframeSelector;
