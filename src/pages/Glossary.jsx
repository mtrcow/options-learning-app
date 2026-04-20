import { useState } from 'react';
import { glossary } from '../data/glossary';

function Glossary() {
  const [search, setSearch] = useState('');

  const filtered = glossary.filter(item => 
    item.term.toLowerCase().includes(search.toLowerCase()) ||
    item.zh.includes(search) ||
    item.def.includes(search)
  );

  return (
    <div className="min-h-screen bg-bg p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">詞彙表</h1>
        <p className="text-text-secondary text-sm">中英對照 · 專業術語</p>
      </div>

      {/* Search */}
      <div className="bg-bg-secondary rounded-2xl p-4 mb-4 border border-white/5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋術語..."
          className="w-full bg-bg border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent outline-none"
        />
      </div>

      {/* Results Count */}
      <p className="text-text-secondary text-xs mb-3">
        找到 {filtered.length} 個術語
      </p>

      {/* Glossary List */}
      <div className="space-y-3">
        {filtered.map((item, index) => (
          <div 
            key={index}
            className="bg-bg-secondary rounded-2xl p-4 border border-white/5"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-accent font-medium text-sm">{item.term}</h3>
                <p className="text-white font-semibold text-sm">{item.zh}</p>
              </div>
            </div>
            <p className="text-text-secondary text-xs leading-relaxed">
              {item.def}
            </p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="bg-bg-secondary rounded-2xl p-10 border border-white/5 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-text-secondary text-sm">未找到相關術語</p>
        </div>
      )}
    </div>
  );
}

export default Glossary;
