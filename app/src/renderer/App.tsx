import { useState, useEffect } from 'react';
import { UsagePanel } from './components/UsagePanel';
import { SkillsPanel } from './components/SkillsPanel';
import { Footer } from './components/Footer';
import { getUsageStats, UsageStats } from '../services/claudeUsage';
import { InstalledSkill } from '../services/skillsScanner';

function App() {
  const [stats, setStats] = useState<UsageStats>(getUsageStats());
  const [skills, setSkills] = useState<InstalledSkill[]>([]);
  const [lastUpdated, setLastUpdated] = useState(0);

  useEffect(() => {
    // Load skills on mount
    window.electronAPI.scanSkills().then(setSkills);

    // Update "last updated" counter every second
    const interval = setInterval(() => {
      setLastUpdated((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setStats(getUsageStats());
    window.electronAPI.scanSkills().then(setSkills);
    setLastUpdated(0);
  };

  const handleSettings = () => {
    // Placeholder - no functionality yet
  };

  const handleQuit = () => {
    window.electronAPI.quit();
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Claude Usage</h1>
        <span className="badge">Pro</span>
      </header>

      <main className="content">
        <UsagePanel stats={stats} />
        <SkillsPanel skills={skills} />
      </main>

      <Footer
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        onSettings={handleSettings}
        onQuit={handleQuit}
      />
    </div>
  );
}

export default App;
