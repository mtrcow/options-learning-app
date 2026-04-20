import { useState, useEffect } from 'react';

function Simulator() {
  const [symbol, setSymbol] = useState('');
  const [direction, setDirection] = useState('call'); // call or put
  const [strike, setStrike] = useState('');
  const [premium, setPremium] = useState('');
  const [stockPrice, setStockPrice] = useState(null);
  const [balance, setBalance] = useState(
    parseFloat(localStorage.getItem('simBalance') || '100000')
  );
  const [trades, setTrades] = useState(
    JSON.parse(localStorage.getItem('simTrades') || '[]')
  );
  const [calculated, setCalculated] = useState(null);

  const mockPrices = {
    'AAPL': 178.50,
    'TSLA': 245.30,
    'NVDA': 875.20,
    'SPY': 512.40,
    'QQQ': 438.60,
    'AMD': 168.90,
    'GOOGL': 175.80,
    'MSFT': 425.30
  };

  const searchStock = () => {
    const upper = symbol.toUpperCase();
    if (mockPrices[upper]) {
      setStockPrice(mockPrices[upper]);
    } else {
      setStockPrice(150 + Math.random() * 100);
    }
  };

  const calculatePL = () => {
    if (!stockPrice || !strike || !premium) return;
    
    const s = parseFloat(stockPrice);
    const k = parseFloat(strike);
    const p = parseFloat(premium);
    const isCall = direction === 'call';
    
    // Breakeven
    const breakeven = isCall ? k + p : k - p;
    
    // P/L at current price
    let plAtCurrent;
    if (isCall) {
      plAtCurrent = Math.max(0, s - k) - p;
    } else {
      plAtCurrent = Math.max(0, k - s) - p;
    }
    
    // Max values
    const maxProfit = isCall ? '無限' : (k - p).toFixed(2);
    const maxLoss = isCall ? p.toFixed(2) : '無限';
    
    setCalculated({
      breakeven,
      plAtCurrent,
      maxProfit,
      maxLoss,
      isITM: isCall ? s > k : s < k
    });
  };

  const executeTrade = () => {
    if (!symbol || !strike || !premium || parseFloat(premium) <= 0) return;
    
    const cost = parseFloat(premium) * 100; // 1 contract = 100 shares
    if (cost > balance) {
      alert('餘額不足！');
      return;
    }
    
    const newTrade = {
      id: Date.now(),
      symbol: symbol.toUpperCase(),
      direction,
      strike: parseFloat(strike),
      premium: parseFloat(premium),
      stockPrice,
      timestamp: new Date().toLocaleString('zh-HK')
    };
    
    const newTrades = [newTrade, ...trades];
    setTrades(newTrades);
    setBalance(balance - cost);
    localStorage.setItem('simTrades', JSON.stringify(newTrades));
    localStorage.setItem('simBalance', balance.toString());
  };

  useEffect(() => {
    if (stockPrice && strike && premium) {
      calculatePL();
    }
  }, [stockPrice, strike, premium, direction]);

  return (
    <div className="min-h-screen bg-bg p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">模擬交易</h1>
        <p className="text-text-secondary text-sm">虛擬資金 · 紙上練習</p>
      </div>

      {/* Balance */}
      <div className="bg-bg-secondary rounded-2xl p-4 mb-4 border border-white/5">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary text-sm">虛擬餘額</span>
          <span className="text-accent font-bold text-xl">${balance.toLocaleString()}</span>
        </div>
      </div>

      {/* Trade Input */}
      <div className="bg-bg-secondary rounded-2xl p-5 mb-4 border border-white/5">
        <h2 className="text-white font-semibold mb-4">新建交易</h2>
        
        {/* Symbol */}
        <div className="mb-4">
          <label className="text-text-secondary text-xs mb-1 block">股票代碼</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="例如：AAPL"
              className="flex-1 bg-bg border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent outline-none"
            />
            <button
              onClick={searchStock}
              className="bg-accent/20 text-accent px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent/30 transition-all"
            >
              查詢
            </button>
          </div>
          {stockPrice && (
            <p className="text-profit text-xs mt-2">
              現價: ${stockPrice.toFixed(2)}
            </p>
          )}
        </div>

        {/* Direction Toggle */}
        <div className="mb-4">
          <label className="text-text-secondary text-xs mb-2 block">方向</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDirection('call')}
              className={`py-3 rounded-xl text-sm font-medium transition-all ${
                direction === 'call'
                  ? 'bg-accent text-white'
                  : 'bg-bg text-text-secondary border border-white/10'
              }`}
            >
              📈 Call (睇好)
            </button>
            <button
              onClick={() => setDirection('put')}
              className={`py-3 rounded-xl text-sm font-medium transition-all ${
                direction === 'put'
                  ? 'bg-loss text-white'
                  : 'bg-bg text-text-secondary border border-white/10'
              }`}
            >
              📉 Put (睇淡)
            </button>
          </div>
        </div>

        {/* Strike & Premium */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-text-secondary text-xs mb-1 block">行使價</label>
            <input
              type="number"
              value={strike}
              onChange={(e) => setStrike(e.target.value)}
              placeholder="185.00"
              className="w-full bg-bg border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="text-text-secondary text-xs mb-1 block">權利金 (每份)</label>
            <input
              type="number"
              value={premium}
              onChange={(e) => setPremium(e.target.value)}
              placeholder="5.00"
              step="0.01"
              className="w-full bg-bg border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent outline-none"
            />
          </div>
        </div>

        <button
          onClick={executeTrade}
          disabled={!symbol || !strike || !premium}
          className="w-full bg-gradient-to-r from-accent to-accent-secondary py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
        >
          落單 (成本 ${premium ? (parseFloat(premium) * 100 || 0).toFixed(2) : '0.00'})
        </button>
      </div>

      {/* Calculation Results */}
      {calculated && (
        <div className="bg-bg-secondary rounded-2xl p-5 mb-4 border border-white/5">
          <h2 className="text-white font-semibold mb-4">📊 分析結果</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg rounded-xl p-3">
              <p className="text-text-secondary text-xs mb-1">現價狀態</p>
              <p className={`font-bold ${calculated.isITM ? 'text-profit' : 'text-loss'}`}>
                {calculated.isITM ? '價內 (ITM)' : '價外 (OTM)'}
              </p>
            </div>
            <div className="bg-bg rounded-xl p-3">
              <p className="text-text-secondary text-xs mb-1">盈利平衡點</p>
              <p className="text-white font-bold">${calculated.breakeven.toFixed(2)}</p>
            </div>
            <div className="bg-bg rounded-xl p-3">
              <p className="text-text-secondary text-xs mb-1">目前盈虧</p>
              <p className={`font-bold ${calculated.plAtCurrent >= 0 ? 'text-profit' : 'text-loss'}`}>
                {calculated.plAtCurrent >= 0 ? '+' : ''}{calculated.plAtCurrent.toFixed(2)}
              </p>
            </div>
            <div className="bg-bg rounded-xl p-3">
              <p className="text-text-secondary text-xs mb-1">最大盈利</p>
              <p className="text-profit font-bold">{calculated.maxProfit}</p>
            </div>
          </div>
        </div>
      )}

      {/* Trade History */}
      <div className="bg-bg-secondary rounded-2xl p-5 border border-white/5">
        <h2 className="text-white font-semibold mb-4">交易記錄</h2>
        {trades.length === 0 ? (
          <p className="text-text-secondary text-sm text-center py-4">暫無交易記錄</p>
        ) : (
          <div className="space-y-3">
            {trades.slice(0, 5).map((trade) => (
              <div key={trade.id} className="bg-bg rounded-xl p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-white font-medium">{trade.symbol}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                      trade.direction === 'call' 
                        ? 'bg-accent/20 text-accent' 
                        : 'bg-loss/20 text-loss'
                    }`}>
                      {trade.direction === 'call' ? 'CALL' : 'PUT'}
                    </span>
                  </div>
                  <span className="text-text-secondary text-xs">{trade.timestamp}</span>
                </div>
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>Strike: ${trade.strike}</span>
                  <span>Premium: ${trade.premium}</span>
                  <span>Cost: ${(trade.premium * 100).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Simulator;
