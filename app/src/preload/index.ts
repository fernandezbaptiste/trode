import { contextBridge, ipcRenderer } from 'electron';

// Type for installed skill
interface InstalledSkill {
  name: string;
  path: string;
  description?: string;
  source: 'project' | 'global';
}

// Type for Tessl status
interface TesslStatus {
  installed: boolean;
  authenticated: boolean;
  username?: string;
}

// Type for skill eval
interface SkillEval {
  skillName: string;
  score?: number;
  lift?: number;
  hasEval: boolean;
}

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  quit: () => ipcRenderer.send('quit-app'),
  scanSkills: (): Promise<InstalledSkill[]> => ipcRenderer.invoke('scan-skills'),
  getTesslStatus: (): Promise<TesslStatus> => ipcRenderer.invoke('tessl-status'),
  runTesslLogin: (): Promise<boolean> => ipcRenderer.invoke('tessl-login'),
  getSkillEvals: (skillNames: string[]): Promise<Record<string, SkillEval>> =>
    ipcRenderer.invoke('get-skill-evals', skillNames),
  openExternal: (url: string) => ipcRenderer.send('open-external', url),
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      quit: () => void;
      scanSkills: () => Promise<InstalledSkill[]>;
      getTesslStatus: () => Promise<TesslStatus>;
      runTesslLogin: () => Promise<boolean>;
      getSkillEvals: (skillNames: string[]) => Promise<Record<string, SkillEval>>;
      openExternal: (url: string) => void;
    };
  }
}
