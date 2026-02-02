interface TesslSetupProps {
  installed: boolean;
  onLogin: () => void;
  onOpenDocs: () => void;
}

export function TesslSetup({ installed, onLogin, onOpenDocs }: TesslSetupProps) {
  return (
    <div className="tessl-setup">
      <div className="setup-header">
        <span className="setup-icon">&#x1F527;</span>
        <span className="setup-title">Setup Required</span>
      </div>

      <div className="setup-content">
        <p className="setup-text">
          To see skill eval scores, install the Tessl CLI:
        </p>

        <code className="setup-command">npm install -g @tessl/cli</code>

        {installed ? (
          <>
            <p className="setup-text">Then authenticate:</p>
            <button className="setup-btn" onClick={onLogin}>
              Run tessl login
            </button>
          </>
        ) : (
          <p className="setup-hint">
            After installing, restart the app.
          </p>
        )}
      </div>

      <div className="setup-footer">
        <button className="docs-link" onClick={onOpenDocs}>
          &#x1F4D6; View docs at docs.tessl.io
        </button>
      </div>
    </div>
  );
}
