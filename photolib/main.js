const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const express = require('express');
const { startExpressServer } = require('./server');

let mainWindow;
let expressServer = null;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
            contextIsolation: false,
            nodeIntegration: true,
        },

        // hide top menu
        titleBarStyle: 'hidden',
    });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();

    mainWindow.webContents.once("did-finish-load", () => {
        // Start the Express server on the specified port
        const defaultPort = 3000;
        startExpressServer(defaultPort);

        // Initialize the main window
        mainWindow.webContents.send("initialize-main-window");
    });

});

app.disableHardwareAcceleration();

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Save image path to a file
ipcMain.on('save-image-path', (event, imagePath) => {
    const settingsPath = path.join(os.homedir(), '.image-viewer-settings.json');
    fs.writeFileSync(settingsPath, JSON.stringify({ imagePath }), 'utf-8');
});

// Get saved image path
ipcMain.handle('get-image-path', () => {
    const settingsPath = path.join(os.homedir(), '.image-viewer-settings.json');
    if (fs.existsSync(settingsPath)) {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
        return settings.imagePath;
    }
    return null;
});

// MARK: Express server
// Handle the settings changes from the renderer process
ipcMain.on('start-server', (event, port) => {
    expressServer = startExpressServer(port);
});
