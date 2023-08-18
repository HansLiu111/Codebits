// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
    addSnippet: snippet => {
        ipcRenderer.send('addSnippet', snippet);
    },
    receiveSnippets: callback => {
        ipcRenderer.on('receiveSnippets', (_, updatedSnippets) => {
            callback(updatedSnippets);
        });
    }
});
