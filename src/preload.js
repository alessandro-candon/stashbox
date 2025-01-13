import {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld('api', {
    sendMessage: (channel, data) => ipcRenderer.send(channel, data),
    receiveMessage: (channel, callback) => ipcRenderer.on(channel, (_, ...args) => callback(...args)),
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
});
