const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')

var Positioner = require('electron-positioner')

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
            label: '&About',
            click: function () {
                createAboutWindow()
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
let aboutWindow
let dbContextWindow

function createOverlayWindow() {
    overlayWindow = new BrowserWindow({ width: 100, height: 50, frame: false })

    var positioner = new Positioner(overlayWindow)
    positioner.move('bottomRight')

    overlayWindow.setMenu(null)
    overlayWindow.setIcon(path.join('images', 'tomato.ico'))
    overlayWindow.setAlwaysOnTop(true, "floating")
    overlayWindow.setResizable(false)

    overlayWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'overlay', 'overlay.html'),
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

function createAboutWindow() {
    aboutWindow = new BrowserWindow({ width: 470, height: 210 })

    aboutWindow.setMenu(null)
    aboutWindow.setIcon(path.join('images', 'tomato.ico'))

    aboutWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'about', 'about.html'),
        protocol: 'file:',
        slashes: true,
    }))

    // Force hyperlinks to open in external browser
    // (https://stackoverflow.com/questions/32402327/how-can-i-force-external-links-from-browser-window-to-open-in-a-default-browser)
    aboutWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    });

    // aboutWindow.webContents.openDevTools()

    aboutWindow.on('closed', function () {
        aboutWindow = null
    })
}

// This creates a dummy window, so we can use IndexedDB in the render process (unfortunately doesn't work in the main process)
function createDatabaseContextWindow() {
    dbContextWindow = new BrowserWindow({ width: 0, height: 0, frame: false })

    // For dev
    //dbContextWindow.maximize()
    //dbContextWindow.webContents.openDevTools()

    dbContextWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'database', 'dbcontext.html'),
        protocol: 'file:',
        slashes: true,
    }))

    dbContextWindow.on('closed', function () {
        dbContextWindow = null
    })
}

app.on('ready', function() {
    createDatabaseContextWindow();
    createSystemTrayIcon();
    createOverlayWindow();

    countdown.init(count => {
        overlayWindow && overlayWindow.webContents.send('countdown', count)
    });
})
