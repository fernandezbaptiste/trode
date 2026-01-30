import { app, ipcMain } from 'electron';
import { createTray, getWindow } from './tray';
import { scanForSkills, getProjectPath } from '../services/skillsScanner';

// Handle IPC events
ipcMain.on('quit-app', () => {
  app.quit();
});

// Handle skills scanning
ipcMain.handle('scan-skills', () => {
  const projectPath = getProjectPath();
  return scanForSkills(projectPath);
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
