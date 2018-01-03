const {app, Tray, Menu} = require('electron')

const path = require('path')
const url = require('url')

function createSystemTrayIcon () {
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

app.on('ready', createSystemTrayIcon)
