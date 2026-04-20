import { useState } from 'react';

function Market() {
  const [symbol, setSymbol] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  
  const mockStocks = {
    'AAPL': { price: 178.50, change: 2.34, changePercent: 1.33 },
    'TSLA': { price: 245.30, change: -5.67, changePercent: -2.26 },
    'NVDA': { price: 875.20, change: 15.40, changePercent: 1.79 },
    'SPY': { price: 512.40, change: 3.21, changePercent: 0.63 },
    'QQQ': { price: 438.60, change: 4.82, changePercent: 1.11 },
    'AMD': { price: 168.90, change: -2.15, changePercent: -1.26 },
    'GOOGL': { price: 175.80, change: 1.23, changePercent: 0.70 },
    'MSFT': { price: 425.30, change: 6.78, changePercent: 1.62 },
    'META': { price: 502.30, change: 8.45, changePercent: 1.71 },
    'AMZN': { price: 185.60, change: 2.10, changePercent: 1.14 }
  };

  const popularSymbols = ['AAPL', 'TSLA', 'NVDA', 'SPY', 'QQQ', 'AMD'];

  const generateOptionChain = (stockPrice) => {
    const strikes = [];
    const baseStrike = Math.round(stockPrice / 5) * 5;
    
    for (let i = -4; i <= 4; i++) {
      const strike = baseStrike + i * 5;
      const itm = (stockPrice > strike ? 'P' : 'C');
      strikes.push({
        strike,
        call: {
          bid: (stockPrice - strike + 3 + Math.random() * 2).toFixed(2),
          ask: (stockPrice - strike + 5 + Math.random() * 2).toFixed(2),
          iv: (30 + Math.random() * 40).toFixed(1),
          vol: Math.floor(1000 + Math.random() * 5000)
        },
        put: {
          bid: (strike - stockPrice + 3 + Math.random() * 2).toFixed(2),
          ask: (strike - stockPrice + 5 + Math.random() * 2).toFixed(2),
          iv: (30 + Math.random() * 40).toFixed(1),
          vol: Math.floor(1000 + Math.random() * 5000)
        },
        isITM: stockPrice > strike ? 'P' : 'C'
      });
    }
    return strikes;
  };

  const handleSearch = () => {
    const upper = symbol.toUpperCase();
    if (mockStocks[upper] || (symbol.length >= 1 && symbol.length <= 5)) {
      const price = mockStocks[upper]?.price || (100 + Math.random() * 200);
      setSelectedSymbol({
        symbol: upper || symbol.toUpperCase(),
        price,
        change: mockStocks[upper]?.change || (Math.random() * 10 - 5),
        changePercent: mockStocks[upper]?.changePercent || (Math.random() * 4 - 2)
      });
    }
  };

  const optionChain = selectedSymbol ? generateOptionChain(selectedSymbol.price) : [];

  return (
    <div className="min-h-screen bg-bg p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">行情板</h1>
        <p className="text-text-secondary text-sm">美股期權 · 延遲報價</p>
      </div>

      {/* Search */}
      <div className="bg-bg-secondary rounded-2xl p-4 mb-4 border border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="輸入股票代碼..."
            className="flex-1 bg-bg border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-accent/20 text-accent px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent/30 transition-all"
          >
            搜索
          </button>
        </div>
      </div>

      {/* Popular Symbols */}
      <div className="mb-4">
        <p className="text-text-secondary text-xs mb-2">熱門股票</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {popularSymbols.map((sym) => (
            <button
              key={sym}
              onClick={() => {
                setSymbol(sym);
                const upper = sym.toUpperCase();
                if (mockStocks[upper]) {
                  setSelectedSymbol({
                    symbol: upper,
                    price: mockStocks[upper].price,
                    change: mockStocks[upper].change,
                    changePercent: mockStocks[upper].changePercent
                  });
                }
              }}
              className="bg-bg-secondary px-4 py-2 rounded-xl text-white text-sm whitespace-nowrap border border-white/5 hover:border-accent/50 transition-all"
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Info */}
      {selectedSymbol && (
        <div className="bg-bg-secondary rounded-2xl p-5 mb-4 border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-white text-xl font-bold">{selectedSymbol.symbol}</h2>
              <p className="text-text-secondary text-xs">美股</p>
            </div>
            <div className="text-right">
              <p className="text-white text-xl font-bold">${selectedSymbol.price.toFixed(2)}</p>
              <p className={`text-sm ${selectedSymbol.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                {selectedSymbol.change >= 0 ? '+' : ''}{selectedSymbol.change.toFixed(2)} 
                ({selectedSymbol.changePercent >= 0 ? '+' : ''}{selectedSymbol.changePercent.toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Option Chain */}
      {selectedSymbol && (
        <div className="bg-bg-secondary rounded-2xl p-4 border border-white/5">
          <h3 className="text-white font-semibold mb-4">期權鏈 (Option Chain)</h3>
          
          {/* Header */}
          <div className="grid grid-cols-7 gap-1 text-xs text-text-secondary mb-2">
            <div className="text-center">Strike</div>
            <div className="text-center">Bid</div>
            <div className="text-center">Ask</div>
            <div className="text-center">IV</div>
            <div className="text-center">Vol</div>
            <div className="text-center">Bid</div>
            <div className="text-center">Ask</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs text-text-secondary mb-1">
            <div className="text-center col-span-4 text-accent text-xs">📈 CALL</div>
            <div className="text-center col-span-3 text-loss text-xs">PUT 📉</div>
          </div>
          
          {/* Rows */}
          <div className="space-y-1">
            {optionChain.map((row) => (
              <div key={row.strike} className="grid grid-cols-7 gap-1 text-xs py-1">
                <div className={`text-center font-medium ${
                  row.strike === Math.round(selectedSymbol.price / 5) * 5 
                    ? 'text-accent bg-accent/10 rounded' 
                    : 'text-white'
                }`}>
                  ${row.strike}
                </div>
                <div className="text-center text-accent">{row.call.bid}</div>
                <div className="text-center text-text-secondary">{row.call.ask}</div>
                <div className="text-center text-text-secondary">{row.call.iv}%</div>
                <div className="text-center text-text-secondary">{row.call.vol}</div>
                <div className="text-center text-loss">{row.put.bid}</div>
                <div className="text-center text-text-secondary">{row.put.ask}</div>
              </div>
            ))}
          </div>
          
          <p className="text-text-secondary text-xs mt-4 text-center">
            * 數據僅供參考，非真實報價
          </p>
        </div>
      )}

      {/* Empty State */}
      {!selectedSymbol && (
        <div className="bg-bg-secondary rounded-2xl p-10 border border-white/5 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-text-secondary text-sm">輸入股票代碼查看行情</p>
        </div>
      )}
    </div>
  );
}

export default Market;
