const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')

const path = require('path')
const url = require('url')

const countdown = require('./countdown')

function createSystemTrayIcon() {
    let trayIcon = new Tray(path.join('images', 'tomato.ico'))

    const trayMenuTemplate = [
        {
            label: 'Tomatoad',
            enabled: false
        }, {
            label: 'Settings',
            click: function () {
                console.log("Clicked on settings")
            }
        }, {
            label: '&Exit',
            click: function () {
                app.exit();
            }
        }
    ]

    let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
    trayIcon.setContextMenu(trayMenu)
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let overlayWindow

function createOverlayWindow() {
    overlayWindow = new BrowserWindow({ width: 300, height: 200 })

    overlayWindow.setMenu(null)

    overlayWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'overlay.html'),
        protocol: 'file:',
        slashes: true,
    }))

    // overlayWindow.webContents.openDevTools()

    overlayWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        overlayWindow = null
    })
}

app.on('ready', function() {
    createSystemTrayIcon();
    createOverlayWindow();

    countdown.init(count => overlayWindow.webContents.send('countdown', count));
})
