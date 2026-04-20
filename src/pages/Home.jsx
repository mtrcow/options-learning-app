import { Link } from 'react-router-dom';

function Home() {
  const completedLessons = parseInt(localStorage.getItem('completedLessons') || '0');
  const totalLessons = 8;
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-bg p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">期權學習平台</h1>
        <p className="text-text-secondary text-sm">美國期權 · 從零開始</p>
      </div>

      {/* Progress Card */}
      <div className="bg-bg-secondary rounded-2xl p-5 mb-4 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-text-secondary text-sm">學習進度</span>
          <span className="text-accent font-bold">{completedLessons}/{totalLessons} 課</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent to-accent-secondary rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-text-secondary text-xs mt-2">{progressPercent}% 完成</p>
      </div>

      {/* Market Overview */}
      <div className="bg-bg-secondary rounded-2xl p-5 mb-4 border border-white/5">
        <h2 className="text-white font-semibold mb-4">市場概覽</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-sm">SPY (S&P 500)</span>
            <span className="text-profit text-sm font-mono">+0.45%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-sm">QQQ (Nasdaq)</span>
            <span className="text-profit text-sm font-mono">+0.82%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-sm">VIX (波動率)</span>
            <span className="text-loss text-sm font-mono">-2.15%</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link 
          to="/lessons"
          className="bg-bg-secondary rounded-2xl p-5 border border-white/5 hover:border-accent/50 transition-all active:scale-95"
        >
          <div className="text-3xl mb-2">📚</div>
          <h3 className="text-white font-semibold text-sm mb-1">繼續學習</h3>
          <p className="text-text-secondary text-xs">
            {completedLessons < totalLessons ? `第 ${completedLessons + 1} 課` : '已完成'}
          </p>
        </Link>

        <Link 
          to="/simulator"
          className="bg-bg-secondary rounded-2xl p-5 border border-white/5 hover:border-accent/50 transition-all active:scale-95"
        >
          <div className="text-3xl mb-2">📊</div>
          <h3 className="text-white font-semibold text-sm mb-1">模擬交易</h3>
          <p className="text-text-secondary text-xs">紙上練習</p>
        </Link>
      </div>

      {/* Bottom action */}
      <Link 
        to="/market"
        className="block bg-gradient-to-r from-accent to-accent-secondary rounded-2xl p-4 text-center hover:opacity-90 transition-all active:scale-98"
      >
        <span className="text-white font-semibold">查看行情</span>
      </Link>
    </div>
  );
}

export default Home;
