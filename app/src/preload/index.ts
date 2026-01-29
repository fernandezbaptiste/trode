import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  quit: () => ipcRenderer.send('quit-app'),
  // Future IPC methods will be added here
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      quit: () => void;
    };
  }
}
