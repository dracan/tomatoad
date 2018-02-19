const { app, BrowserWindow, Tray, Menu, ipcMain, shell } = require('electron')

var Positioner = require('electron-positioner')

const path = require('path')
const url = require('url')

const countdown = require('./countdown')
const slack = require('./slack/slack.main')

let pomodoroLengthSeconds = 1500 // 25 minutes
let breakLengthSeconds = 300 // 5 minutes

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let trayIcon
let overlayWindow
let aboutWindow

function createSystemTrayIcon() {
    trayIcon = new Tray(path.join(__static, 'tomato.ico'))

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
            label: '&Slack Integration',
            click: function () {
                createSlackWindow()
            }
        }, {
            label: 'Report bug or suggest a feature',
            click: function () {
                shell.openExternal('https://github.com/dracan/tomatoad/issues')
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

function createOverlayWindow() {
    overlayWindow = new BrowserWindow({ width: 125, height: 45, frame: false, webPreferences: { webSecurity: false } })

    var positioner = new Positioner(overlayWindow)
    positioner.move('bottomRight')

    overlayWindow.setMenu(null)
    overlayWindow.setIcon(path.join(__static, 'tomato.ico'))
    overlayWindow.setAlwaysOnTop(true, "floating")
    overlayWindow.setResizable(false)
    overlayWindow.setSkipTaskbar(true);

    if(isDevelopment) {
        overlayWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}#overlay`);
    } else {
        overlayWindow.loadURL(`file:///${__dirname}/index.html#overlay`)
    }

    // For dev
    // overlayWindow.maximize()
    // overlayWindow.webContents.openDevTools()

    overlayWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        overlayWindow = null
    })
}

function createAboutWindow() {
    aboutWindow = new BrowserWindow({ width: 470, height: 280, webPreferences: { webSecurity: false } })

    aboutWindow.setMenu(null)
    aboutWindow.setIcon(path.join(__static, 'tomato.ico'))

    if(isDevelopment) {
        aboutWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}#about`);
    } else {
        aboutWindow.loadURL(`file:///${__dirname}/index.html#about`)
    }

    // Force hyperlinks to open in external browser
    // (https://stackoverflow.com/questions/32402327/how-can-i-force-external-links-from-browser-window-to-open-in-a-default-browser)
    aboutWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    });

    // For dev
    // aboutWindow.maximize()
    // aboutWindow.webContents.openDevTools()

    aboutWindow.on('closed', function () {
        aboutWindow = null
    })
}

function createSlackWindow() {
    slackWindow = new BrowserWindow({ width: 500, height: 400, webPreferences: { webSecurity: false } })

    slackWindow.setMenu(null)
    slackWindow.setIcon(path.join(__static, 'tomato.ico'))

    if(isDevelopment) {
        slackWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}#slack`);
    } else {
        slackWindow.loadURL(`file:///${__dirname}/index.html#slack`)
    }

    slackWindow.webContents.on('did-get-response-details', function (event, status, newURL, originalURL, httpResponseCode, requestMethod, referrer, headers, resourceType) {
        if(newURL.indexOf("https://tomatoadauth.azurewebsites.net/api/slackauth") !== -1) {
            slack.setAuthCode(headers['x-team-name'][0], headers['x-auth-code'][0]);
        }
    });

    // For dev
    // slackWindow.maximize()
    // slackWindow.webContents.openDevTools()

    slackWindow.on('closed', function () {
        slackWindow = null
    })
}

app.on('ready', function() {
    slack.loadAuthTokens()
    createSystemTrayIcon();
    createOverlayWindow();
})

broadcastEvent = function(eventName, arg) {
    overlayWindow && overlayWindow.webContents.send(eventName, arg)
}

ipcMain.on('pomodoro-start', (evt) => {
    countdown.init(pomodoroLengthSeconds, count => {
        broadcastEvent("countdown", count)
    }, () => {
        broadcastEvent('pomodoro-complete')
        slack.setStatus("", "")
        slack.setDoNotDisturb(0)

        setTimeout(_ => {
            ipcMain.emit('break-start')
        }, 1000);
    });

    broadcastEvent('pomodoro-start')
    slack.setStatus("25 minutes", ":tomato:")
    slack.setDoNotDisturb(25)
})

ipcMain.on('break-start', (evt) => {
    countdown.init(breakLengthSeconds, count => {
        broadcastEvent("countdown", count)
    }, () => {
        broadcastEvent('break-complete')
    });

    broadcastEvent('break-start')
})

ipcMain.on('pomodoro-stop', (evt) => {
    countdown.stop()
    slack.setStatus("", "")
    slack.setDoNotDisturb(0)
})
