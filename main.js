const { app, BrowserWindow, Menu } = require('electron')
const log = require('electron-log')
const Store = require('./Store')

// Set env
process.env.NODE_ENV = 'development'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow

// Init store & defaults
const store = new Store({
  configName: 'user-settings',
  defaults: {
    settings: {
      cpuOverload: 80,
      alertFrequency: 5,
    },
  },
})

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'SysOps',
    width: isDev ? 800 : 355,
    height: 500,
    icon: './assets/icons/icon.png',
    resizable: isDev ? true : false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadFile('./app/index.html')
}

app.on('ready', () => {
  createMainWindow()

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
})

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  ...(isDev
    ? [
      {
        label: 'Developer',
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { type: 'separator' },
          { role: 'toggledevtools' },
        ],
      },
    ]
    : []),
]

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

app.allowRendererProcessReuse = true
