const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let splash;
let mainWindow;

function createSplashScreen() {
  splash = new BrowserWindow({
    width: 500,
    height: 400,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    center: true,
    show: true,
    icon: path.join(__dirname, 'resources/favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  splash.loadFile(path.join(__dirname, 'resources/splash.html'));
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    icon: path.join(__dirname, 'resources/favicon.ico'),
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true, // Needed so scripts can run with node features if necessary
    },
  });

  mainWindow.loadURL('https://kirka.io');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (splash) splash.close();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    const scriptsPath = path.join(app.getPath('documents'), 'ThatKirkaClient', 'scripts');

    fs.readdir(scriptsPath, (err, files) => {
      if (err) {
        console.error('Failed to read scripts folder:', err);
        return;
      }

      files.forEach(file => {
        if (file.endsWith('.js')) {
          const fullPath = path.join(scriptsPath, file);
          fs.readFile(fullPath, 'utf8', (err, content) => {
            if (err) {
              console.error(`Failed to read script ${file}:`, err);
              return;
            }
            console.log(`Injecting script: ${file}`);
            mainWindow.webContents.executeJavaScript(content).catch(console.error);
          });
        }
      });
    });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createSplashScreen();

  ipcMain.once('sound-ended', () => {
    createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
