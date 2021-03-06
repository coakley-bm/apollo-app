const {app, BrowserWindow, ipcMain} = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const url = require('url')
const ElectronTitlebarWindows = require('electron-titlebar-windows')
const isDev = require('electron-is-dev')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let index = isDev ? "index.dev.html" : "index.html";

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  console.log('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available.');
})
autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded');
});

function createWindow () {
  
    autoUpdater.checkForUpdates();
  

  // Create the browser window.
  win = new BrowserWindow({ width: 450, height: 500, alwaysOnTop: false, frame: false, transparent: true, 
    webPreferences: {
      devTools: isDev
    }
  });
  win.setMenu(null)
  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, index),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
    
  })  
}

// Listen for async message from renderer process
ipcMain.on('overlay', (event, arg) => {  
  // Print 1  
  win.setAlwaysOnTop(arg)  
});

ipcMain.on('reize', (event, arg) => {
  win.setSize(arg.width, arg.height);
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
