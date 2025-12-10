console.log('Versions:', process.versions);
if (process.versions.electron) {
    console.log('Running IN ELECTRON');
    console.log('ExecPath:', process.execPath);
    console.log('ELECTRON_RUN_AS_NODE:', process.env.ELECTRON_RUN_AS_NODE);
} else {
    console.log('Running IN NODE');
}

const electron = require('electron');
console.log('Electron require result:', electron);
console.log('Resolved electron path:', require.resolve('electron'));

const { app, BrowserWindow } = electron;

// If we are in node (which seems to be the case based on error), we can't do anything.
// But we want to fail loudly.

if (!app) {
    console.error('FATAL: app is undefined. We are likely not running inside the Electron binary.');
    // Attempt to manually spawn electron if we are in node?
    // No, that's the job of the CLI.
    process.exit(1);
}

const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
    });

    const devUrl = 'http://localhost:3000';
    const prodUrl = `file://${path.join(__dirname, '../dist/index.html')}`;

    const isDev = !app.isPackaged;

    if (isDev) {
        mainWindow.loadURL(devUrl).catch(e => {
            console.log("Error loading URL, retrying", e);
            setTimeout(() => mainWindow.loadURL(devUrl), 3000);
        });
    } else {
        mainWindow.loadURL(prodUrl);
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
