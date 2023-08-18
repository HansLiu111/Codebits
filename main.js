const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

const snippets = [];

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadFile('index.html');
});

ipcMain.on('addSnippet', (_, snippetText) => {
    snippets.push(snippetText);
    mainWindow.webContents.send('receiveSnippets', snippets);
});