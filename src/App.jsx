import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Simulator from './pages/Simulator';
import Market from './pages/Market';
import Profile from './pages/Profile';
import Glossary from './pages/Glossary';

function NavBar() {
  const location = useLocation();
  
  const tabs = [
    { path: '/', icon: '🏠', label: '首頁' },
    { path: '/lessons', icon: '📚', label: '學習' },
    { path: '/simulator', icon: '📊', label: '模擬' },
    { path: '/market', icon: '📈', label: '行情' },
    { path: '/profile', icon: '👤', label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-white/10 z-50">
      <div className="max-w-[480px] mx-auto flex justify-around py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center py-2 px-3 min-w-[60px] transition-all ${
                isActive ? 'text-accent' : 'text-text-secondary'
              }`}
            >
              <span className="text-xl mb-0.5">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-[480px] mx-auto min-h-screen bg-bg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/market" element={<Market />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/glossary" element={<Glossary />} />
        </Routes>
        <NavBar />
      </div>
    </BrowserRouter>
  );
}

export default App;
