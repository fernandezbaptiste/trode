import { app, ipcMain } from 'electron';
import { createTray, getWindow } from './tray';

// Handle IPC events
ipcMain.on('quit-app', () => {
  app.quit();
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
