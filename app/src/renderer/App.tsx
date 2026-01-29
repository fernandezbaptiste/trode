function App() {
  const handleQuit = () => {
    window.electronAPI.quit();
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Trode</h1>
        <span className="badge">Pro</span>
      </header>

      <main className="content">
        <p className="placeholder">Claude Code usage monitor coming soon...</p>
      </main>

      <footer className="footer">
        <button className="footer-btn" onClick={() => {}}>
          Settings
        </button>
        <button className="footer-btn quit-btn" onClick={handleQuit}>
          Quit
        </button>
      </footer>
    </div>
  );
}

export default App;
