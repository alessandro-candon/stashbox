import {app, BrowserWindow, ipcMain} from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import {gcpBucket, GcpBucket} from "./main/gcp/bucket";
import {localFilesystem, LocalFilesystem} from "./main/local/filesystem";
import {localStore, LocalStore} from "./main/local/store";


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const exportedFunctions = {
  ...gcpBucket,
  ...localFilesystem,
  ...localStore
}
for (const k of Object.keys(exportedFunctions)) {
  ipcMain.handle(k, (...args) => {
    console.log('ipcMain.handle', k, args);
    return exportedFunctions[k](...args);
  })
}