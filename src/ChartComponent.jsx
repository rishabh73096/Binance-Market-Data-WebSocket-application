import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const symbols = {
    ETH: 'ethusdt',
    BNB: 'bnbusdt',
    DOT: 'dotusdt',
};

const intervals = ['1m', '3m', '5m'];

const ChartComponent = () => {
    const [selectedCoin, setSelectedCoin] = useState(symbols.ETH);
    const [selectedInterval, setSelectedInterval] = useState(intervals[0]);
    const [candlestickData, setCandlestickData] = useState({});
    const [chartData, setChartData] = useState({ datasets: [] });

    useEffect(() => {
        const fetchDataFromLocalStorage = () => {
            const storedData = localStorage.getItem(selectedCoin + selectedInterval);
            if (storedData) {
                setCandlestickData(JSON.parse(storedData));
                updateChartData(JSON.parse(storedData));
            }
        };

        fetchDataFromLocalStorage();

        const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedCoin}@kline_${selectedInterval}`);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const kline = message.k;

            if (kline && kline.x) {
                const newData = {
                    time: new Date(kline.t).toLocaleTimeString(),
                    open: parseFloat(kline.o),
                    high: parseFloat(kline.h),
                    low: parseFloat(kline.l),
                    close: parseFloat(kline.c),
                };

                const updatedData = { ...candlestickData, [newData.time]: newData };
                setCandlestickData(updatedData);
                localStorage.setItem(selectedCoin + selectedInterval, JSON.stringify(updatedData));
                updateChartData(updatedData);
            }
        };

        return () => ws.close();
    }, [selectedCoin, selectedInterval]);

    const updateChartData = (data) => {
        const labels = Object.keys(data);
        const prices = labels.map((time) => data[time]);

        const newChartData = {
            labels,
            datasets: [
                {
                    label: 'Candlestick Chart',
                    data: prices.map((item) => ({
                        x: item.time,
                        y: [item.open, item.high, item.low, item.close],
                    })),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
            ],
        };

        setChartData(newChartData);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5">
            <h1 className="text-3xl mb-5 ">Cryptocurrency Live Candlestick Chart</h1>
            <div className="mb-4">
                <select
                    className="p-2 border rounded"
                    onChange={(e) => setSelectedCoin(e.target.value)}
                    value={selectedCoin}
                >
                    <option value={symbols.ETH}>ETH/USDT</option>
                    <option value={symbols.BNB}>BNB/USDT</option>
                    <option value={symbols.DOT}>DOT/USDT</option>
                </select>
                <select
                    className="p-2 border rounded ml-4"
                    onChange={(e) => setSelectedInterval(e.target.value)}
                    value={selectedInterval}
                >
                    {intervals.map((interval) => (
                        <option key={interval} value={interval}>
                            {interval}
                        </option>
                    ))}
                </select>
            </div>
            <Line data={chartData} options={{ responsive: true }} />
        </div>
    );
};

export default ChartComponent;