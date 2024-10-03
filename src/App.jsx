import { useEffect, useState } from 'react';
import ChartComponent from './ChartComponent';
import CoinSelector from './CoinSelector';
import TimeframeSelector from './TimeframeSelector';

const App = () => {
  const coins = ['ethusdt', 'bnbusdt', 'dotusdt'];
  const [symbol, setSymbol] = useState(coins[0]);
  const [interval, setInterval] = useState('1m');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(symbol)) || [];
    setChartData(storedData);

    let ws;
    const connectWebSocket = () => {
      ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`);

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const candlestick = message.k;

        if (candlestick.x) {
          const newData = {
            time: candlestick.t,
            open: candlestick.o,
            high: candlestick.h,
            low: candlestick.l,
            close: candlestick.c,
          };

          const updatedData = [...chartData, newData];
          setChartData(updatedData);
          localStorage.setItem(symbol, JSON.stringify(updatedData));
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed, attempting to reconnect...');
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
    };
  }, [symbol, interval, chartData]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Binance Market Data</h1>
      <div className="flex justify-center mb-4 space-x-4">
        <CoinSelector coins={coins} selectedCoin={symbol} onSelect={setSymbol} />
        <TimeframeSelector onSelect={setInterval} />
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <ChartComponent data={chartData} />
      </div>
    </div>
  );
};

export default App;
