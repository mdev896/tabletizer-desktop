# Tabletizer Desktop

This is the **desktop companion app** for the **Tabletizer** project — a system designed to repurpose old tablets or phones as **wireless drawing tablets** for PCs or laptops via socket connections.

---

## Overview

**Tabletizer Desktop** handles the **receiver side** of the communication.
It listens for input events (touch, stylus, gestures) sent from the **Tabletizer Mobile** app and maps them to system-level pointer movements, making your old device act as a pen tablet.

---

## Features

* Real-time socket communication between mobile & desktop
* Converts touch input to precise pointer data
* Lightweight, Electron-based desktop client
* Modular architecture (mobile + desktop separation)
* Built for cross-platform use (Windows, Linux, macOS)

---

## Tech Stack

* **Electron Forge**
* **Node.js**
* **Socket.io**
* **HTML / CSS / JavaScript**

---

## Installation

```bash
# clone the repo
git clone https://github.com/mdev896/tabletizer-desktop.git

cd tabletizer-desktop

# install dependencies
npm install

# run the app
npm start
```

---

## Usage

1. Start the **Tabletizer Desktop** app — it will open a local socket server.
2. Launch the **Tabletizer Mobile** app on your phone or tablet.
3. Ensure both devices are connected to the same network.
4. The desktop app will start receiving pointer data automatically.

You can adjust resolution scaling or pointer sensitivity from the UI (coming soon).

---

## Folder Structure

```
tabletizer-desktop/
│
├── src/                 # Main Electron app code
├── forge.config.js      # Electron Forge config
├── package.json         # dependencies and scripts
└── LICENSE              # MIT License
```

---

## Related Repositories

* [Tabletizer Mobile](https://github.com/mdev896/tabletizer-mobile)

---

## 📄 License

MIT © 2025 mdev896
