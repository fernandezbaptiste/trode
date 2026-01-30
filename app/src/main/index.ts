import { app, ipcMain, shell } from 'electron';
import { createTray, getWindow } from './tray';
import { scanForSkills, getProjectPath } from '../services/skillsScanner';
import { checkTesslStatus, runTesslLogin, getSkillEvals } from '../services/tesslCli';

// Handle IPC events
ipcMain.on('quit-app', () => {
  app.quit();
});

// Handle skills scanning
ipcMain.handle('scan-skills', () => {
  const projectPath = getProjectPath();
  return scanForSkills(projectPath);
});

// Handle Tessl CLI
ipcMain.handle('tessl-status', () => {
  return checkTesslStatus();
});

ipcMain.handle('tessl-login', () => {
  return runTesslLogin();
});

ipcMain.handle('get-skill-evals', (_event, skillNames: string[]) => {
  return getSkillEvals(skillNames);
});

// Open external URL
ipcMain.on('open-external', (_event, url: string) => {
  shell.openExternal(url);
});

// Hide dock icon on macOS
if (process.platform === 'darwin') {
  app.dock.hide();
}

app.whenReady().then(() => {
  createTray();
});

app.on('window-all-closed', () => {
  // Keep app running even when window is closed (menu bar app)
});

app.on('activate', () => {
  const win = getWindow();
  if (win) {
    win.show();
  }
});
