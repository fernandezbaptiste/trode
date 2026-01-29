import { Tray, BrowserWindow, nativeImage } from 'electron';
import path from 'path';

let tray: Tray | null = null;
let window: BrowserWindow | null = null;

const WINDOW_WIDTH = 320;
const WINDOW_HEIGHT = 480;

export function getWindow(): BrowserWindow | null {
  return window;
}

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    show: false,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    backgroundColor: '#1a1a1a',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the renderer
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Hide window when it loses focus
  win.on('blur', () => {
    win.hide();
  });

  return win;
}

function positionWindowNearTray(win: BrowserWindow, trayBounds: Electron.Rectangle) {
  const { x, y, width, height } = trayBounds;
  const winBounds = win.getBounds();

  // Position window below tray icon, centered horizontally
  const posX = Math.round(x + width / 2 - winBounds.width / 2);
  const posY = Math.round(y + height + 4);

  win.setPosition(posX, posY, false);
}

function toggleWindow() {
  if (!window) {
    window = createWindow();
  }

  if (window.isVisible()) {
    window.hide();
  } else {
    const trayBounds = tray?.getBounds();
    if (trayBounds) {
      positionWindowNearTray(window, trayBounds);
    }
    window.show();
    window.focus();
  }
}

export function createTray() {
  // Create a 16x16 template icon for macOS menu bar
  // Simple "T" shape icon encoded as base64 PNG
  const iconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOklEQVQ4T2NkYGD4z0ABYGRgYGCgxAAWBgYGhs+fP1PFgP///zOQawALAwMDw6dPn6hmwMePH6lmAAD2sAkR8C6t2wAAAABJRU5ErkJggg==';

  let icon = nativeImage.createFromDataURL(`data:image/png;base64,${iconBase64}`);

  // If icon creation failed, try loading from file
  if (icon.isEmpty()) {
    const iconPath = path.join(__dirname, '../../assets/tray-icon.png');
    icon = nativeImage.createFromPath(iconPath);
  }

  // If still empty, create a simple colored square as fallback
  if (icon.isEmpty()) {
    const size = 16;
    const canvas = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        // Create a simple "T" shape
        const isT = (y < 4) || (x >= 6 && x <= 9);
        if (isT) {
          canvas[i] = 0;       // R (black for template)
          canvas[i + 1] = 0;   // G
          canvas[i + 2] = 0;   // B
          canvas[i + 3] = 255; // A (fully opaque)
        } else {
          canvas[i + 3] = 0;   // Transparent
        }
      }
    }
    icon = nativeImage.createFromBuffer(canvas, { width: size, height: size });
  }

  // Set as template image for macOS (adapts to dark/light mode)
  icon.setTemplateImage(true);

  tray = new Tray(icon);
  tray.setToolTip('Trode - Claude Code Monitor');

  tray.on('click', () => {
    toggleWindow();
  });

  tray.on('right-click', () => {
    toggleWindow();
  });
}
