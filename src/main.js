// Import dependencies using CommonJS require
const { app, BrowserWindow } = require('electron');
const path = require('path');
const started = require('electron-squirrel-startup');

// Import custom modules
const { GcpBucket } = require('./main/gcp/bucket');  // Ensure correct path
const { LocalFilesystem } = require('./main/local/filesystem');  // Ensure correct path
const { LocalStore } = require('./main/local/store');  // Ensure correct path

// Set environment variables directly in the main.js file
process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL = 'http://localhost:3000'; 
process.env.MAIN_WINDOW_VITE_NAME = 'dist';  

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

  // Use the environment variables in your code
  const viteDevServerUrl = process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL;
  const viteName = process.env.MAIN_WINDOW_VITE_NAME;

  if (viteDevServerUrl) {
    mainWindow.loadURL(viteDevServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${viteName}/index.html`));
  }

  // Open DevTools (optional)
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  // On macOS it's common to re-create a window in the app when the
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

// Call your custom modules (ensure these are correctly imported and used)
try {
  GcpBucket();       // Initialize GCP Bucket-related operations
  LocalFilesystem(); // Initialize local filesystem operations
  LocalStore();      // Initialize local store operations
} catch (err) {
  console.error('Error initializing custom modules:', err);
}
