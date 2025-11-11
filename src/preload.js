// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    createServer: async () => {
        const result = await ipcRenderer.invoke("create-server");
        return result;
    },
    onSendDataToRenderer: (callback) =>
        ipcRenderer.on("send-data-to-renderer", (_event, data) =>
            callback(data)
        ),
});
