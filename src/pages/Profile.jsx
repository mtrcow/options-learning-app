import { Link } from 'react-router-dom';

function Profile() {
  const completedLessons = JSON.parse(localStorage.getItem('completedLessonsList') || '[]').length;
  const totalLessons = 8;
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);
  
  const trades = JSON.parse(localStorage.getItem('simTrades') || '[]');
  const balance = parseFloat(localStorage.getItem('simBalance') || '100000');
  
  const achievements = [
    { id: 1, name: '初學者', desc: '完成第一課', icon: '🎓', unlocked: completedLessons >= 1 },
    { id: 2, name: '學習中', desc: '完成5課', icon: '📚', unlocked: completedLessons >= 5 },
    { id: 3, name: '期權達人', desc: '完成全部8課', icon: '🏆', unlocked: completedLessons >= 8 },
    { id: 4, name: '模擬交易員', desc: '完成第一筆模擬交易', icon: '💹', unlocked: trades.length >= 1 },
    { id: 5, name: '活躍用戶', desc: '連續學習3天', icon: '🔥', unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-bg p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">我的</h1>
        <p className="text-text-secondary text-sm">學習檔案</p>
      </div>

      {/* Profile Card */}
      <div className="bg-bg-secondary rounded-2xl p-5 mb-4 border border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-2xl">
            📈
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">期權學習者</h2>
            <p className="text-text-secondary text-sm">Level {Math.floor(completedLessons / 3) + 1}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-bg-secondary rounded-2xl p-4 border border-white/5">
          <p className="text-text-secondary text-xs mb-1">完成課程</p>
          <p className="text-white text-2xl font-bold">{completedLessons}/{totalLessons}</p>
        </div>
        <div className="bg-bg-secondary rounded-2xl p-4 border border-white/5">
          <p className="text-text-secondary text-xs mb-1">模擬交易</p>
          <p className="text-white text-2xl font-bold">{trades.length}</p>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="bg-bg-secondary rounded-2xl p-5 mb-4 border border-white/5">
        <h3 className="text-white font-semibold mb-4">學習進度</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-secondary">基礎概念</span>
            <span className="text-accent">{completedLessons}/8</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent to-accent-secondary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        
        <Link 
          to="/lessons"
          className="block text-center py-3 bg-accent/20 text-accent rounded-xl text-sm font-medium hover:bg-accent/30 transition-all"
        >
          {completedLessons < totalLessons ? '繼續學習' : '複習課程'}
        </Link>
      </div>

      {/* Virtual Portfolio */}
      <div className="bg-bg-secondary rounded-2xl p-5 mb-4 border border-white/5">
        <h3 className="text-white font-semibold mb-4">模擬投資組合</h3>
        <div className="flex justify-between items-center mb-4">
          <span className="text-text-secondary text-sm">虛擬餘額</span>
          <span className="text-accent font-bold text-lg">${balance.toLocaleString()}</span>
        </div>
        
        {trades.length > 0 ? (
          <div className="space-y-2">
            <p className="text-text-secondary text-xs mb-2">最近交易</p>
            {trades.slice(0, 3).map((trade) => (
              <div key={trade.id} className="flex justify-between items-center py-2 border-b border-white/5">
                <div>
                  <span className="text-white text-sm">{trade.symbol}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                    trade.direction === 'call' 
                      ? 'bg-accent/20 text-accent' 
                      : 'bg-loss/20 text-loss'
                  }`}>
                    {trade.direction === 'call' ? 'CALL' : 'PUT'}
                  </span>
                </div>
                <span className="text-text-secondary text-xs">${trade.strike}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary text-sm text-center py-4">暫無交易記錄</p>
        )}
        
        <Link 
          to="/simulator"
          className="block text-center py-3 bg-gradient-to-r from-accent to-accent-secondary rounded-xl text-white text-sm font-semibold mt-4 hover:opacity-90 transition-all"
        >
          去模擬交易
        </Link>
      </div>

      {/* Achievements */}
      <div className="bg-bg-secondary rounded-2xl p-5 border border-white/5">
        <h3 className="text-white font-semibold mb-4">成就</h3>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div 
              key={ach.id}
              className={`p-3 rounded-xl text-center transition-all ${
                ach.unlocked 
                  ? 'bg-accent/20' 
                  : 'bg-bg opacity-50'
              }`}
            >
              <div className="text-2xl mb-1">{ach.icon}</div>
              <p className={`text-xs font-medium ${ach.unlocked ? 'text-white' : 'text-text-secondary'}`}>
                {ach.name}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">{ach.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
