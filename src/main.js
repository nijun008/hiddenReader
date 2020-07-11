const { app, BrowserWindow } = require('electron')

function createWindow () {
  let win = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 200,
    minHeight: 20,
    frame: false,
    show: false,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('./views/index/index.html')

  win.once('ready-to-show', () => {
    win.show()
  })

  win.webContents.openDevTools()
}


app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)