const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("node:path");
const { mouse, Point } = require("@nut-tree-fork/nut-js");
const WebSocket = require("ws");
const { networkInterfaces } = require("os");

if (require("electron-squirrel-startup")) {
    app.quit();
}

let win = null;
let server = null;
let ip = "0";
let id = "0";
let screenWidth = null;
let maxWidth = 0;
let screenHeight = null;
let screenRatio = "";

function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return Math.abs(a);
}

const setMousePos = async ({ x, y }) => {
    const target = new Point(y, screenHeight - x);
    await mouse.setPosition(target);
};

const calculateRealPos = ({ x, y }) => {
    const factor = screenWidth / maxWidth;
    return { x: x * factor, y: y * factor };
};

const getIp = () => {
    const nets = networkInterfaces();
    const results = {};

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    return results[Object.keys(results)[0]][0];
};

const createServer = () => {
    try {
        ip = getIp();
        id = ip.split(".")[3];
        try {
            server = new WebSocket.Server({ port: 8080 });
            server.on("connection", (socket) => {
                win.webContents.send(
                    "send-data-to-renderer",
                    "Client connected"
                );
                socket.send(screenRatio);
                socket.on("message", (message) => {
                    console.log(message);
                    const text = message.toString("utf8");
                    if (text.slice(0, 3) == "pos") {
                        const values = JSON.parse(text.slice(3));
                        setMousePos(calculateRealPos(values));
                    }
                    if (text.slice(0, 4) == "init") {
                        maxWidth = parseInt(text.slice(4));
                    }
                });
                socket.on("close", () =>
                    win.webContents.send(
                        "send-data-to-renderer",
                        "Client disconnected"
                    )
                );
            });
            return `server running on ws://${ip}:8080`;
        } catch (e) {
            return `can not initialise server: ${e}`;
        }
    } catch (e) {
        return "can not initialise server, are you connected to internet?";
    }
};

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });
    const { width, height } = screen.getPrimaryDisplay().bounds;
    const scale = screen.getPrimaryDisplay().scaleFactor;
    screenHeight = Math.round(height * scale);
    screenWidth = Math.round(width * scale);
    const screenGCD = gcd(screenHeight, screenWidth);
    screenRatio += screenWidth / screenGCD + "-" + screenHeight / screenGCD;
    mainWindow.loadFile(path.join(__dirname, "index.html"));
    win = mainWindow;
    win.webContents.openDevTools();
};

app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.handle("create-server", async () => {
    return { msg: createServer(), id: id, ip: ip };
});
