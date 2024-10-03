const CoinSelector = ({ coins, selectedCoin, onSelect }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Select Coin:</label>
      <select
        value={selectedCoin}
        onChange={(e) => onSelect(e.target.value)}
        className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
      >
        {coins.map((coin) => (
          <option key={coin} value={coin}>
            {coin.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CoinSelector;
