import { contextBridge, ipcRenderer } from 'electron';

// Type for installed skill
interface InstalledSkill {
  name: string;
  path: string;
  description?: string;
  source: 'project' | 'global';
}

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  quit: () => ipcRenderer.send('quit-app'),
  scanSkills: (): Promise<InstalledSkill[]> => ipcRenderer.invoke('scan-skills'),
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      quit: () => void;
      scanSkills: () => Promise<InstalledSkill[]>;
    };
  }
}
