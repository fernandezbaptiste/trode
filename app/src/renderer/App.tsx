import { useState, useEffect } from 'react';
import { UsagePanel } from './components/UsagePanel';
import { SkillsPanel } from './components/SkillsPanel';
import { TesslSetup } from './components/TesslSetup';
import { Footer } from './components/Footer';
import { getUsageStats, UsageStats } from '../services/claudeUsage';
import { InstalledSkill } from '../services/skillsScanner';
import { SkillEval, TesslStatus } from '../services/tesslCli';

function App() {
  const [stats, setStats] = useState<UsageStats>(getUsageStats());
  const [skills, setSkills] = useState<InstalledSkill[]>([]);
  const [evals, setEvals] = useState<Record<string, SkillEval>>({});
  const [tesslStatus, setTesslStatus] = useState<TesslStatus | null>(null);
  const [lastUpdated, setLastUpdated] = useState(0);

  useEffect(() => {
    // Load data on mount
    loadData();

    // Update "last updated" counter every second
    const interval = setInterval(() => {
      setLastUpdated((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    // Check Tessl status
    const status = await window.electronAPI.getTesslStatus();
    setTesslStatus(status);

    // Load skills
    const loadedSkills = await window.electronAPI.scanSkills();
    setSkills(loadedSkills);

    // Get evals for skills
    if (loadedSkills.length > 0) {
      const skillNames = loadedSkills.map((s) => s.name);
      const skillEvals = await window.electronAPI.getSkillEvals(skillNames);
      setEvals(skillEvals);
    }
  };

  const handleRefresh = () => {
    setStats(getUsageStats());
    loadData();
    setLastUpdated(0);
  };

  const handleSettings = () => {
    // Placeholder - no functionality yet
  };

  const handleQuit = () => {
    window.electronAPI.quit();
  };

  const handleTesslLogin = async () => {
    await window.electronAPI.runTesslLogin();
    // Refresh status after login attempt
    const status = await window.electronAPI.getTesslStatus();
    setTesslStatus(status);
  };

  const handleOpenDocs = () => {
    window.electronAPI.openExternal('https://docs.tessl.io');
  };

  const handleOpenTessl = () => {
    window.electronAPI.openExternal('https://tessl.io/registry');
  };

  // Show setup panel if Tessl is not configured
  const showSetup = tesslStatus && (!tesslStatus.installed || !tesslStatus.authenticated);

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Claude Usage</h1>
        <span className="badge">Pro</span>
      </header>

      <main className="content">
        <UsagePanel stats={stats} />
        {showSetup ? (
          <TesslSetup
            installed={tesslStatus?.installed ?? false}
            onLogin={handleTesslLogin}
            onOpenDocs={handleOpenDocs}
          />
        ) : (
          <SkillsPanel
            skills={skills}
            evals={evals}
            onOpenTessl={handleOpenTessl}
          />
        )}
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
