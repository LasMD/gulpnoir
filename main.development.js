import { app, BrowserWindow, Menu, shell, dialog } from 'electron';

let menu;
let template;
let mainWindow = null;


if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require
    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) {
      try {
        await installer.default(installer[name], forceDownload);
      } catch (e) {} // eslint-disable-line
    }
  }
};

app.on('ready', async () => {
  await installExtensions();

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
    mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          mainWindow.inspectElement(x, y);
        }
      }]).popup(mainWindow);
    });
  }
  template = [{
    label: '&File',
    submenu: [{
      label: '&New Project',
      accelerator: 'Ctrl+N'
    }, {
      'type': 'separator'
    }, {
      label: '&Save Project',
      accelerator: 'Ctrl+S',
      click() {
        mainWindow.close();
      }
    }, {
      label: '&Open Project',
      accelerator: 'Ctrl+O',
      click() {
        console.log(dialog.showOpenDialog(
          {
            properties: ['openFile'],
            filters: [
              { name: 'GulpNoir Project', extensions: ['noir'] }
            ]
          }
        ));
      }
    }, {
      label: '&Export',
      accelerator: 'Ctrl+E',
      click() {
        mainWindow.close();
      }
    }, {
      'type': 'separator'
    }, {
      label: '&Quit',
      accelerator: 'Ctrl+W',
      click() {
        mainWindow.close();
      }
    }]
  }, {
    label: '&View',
    submenu: (process.env.NODE_ENV === 'development') ? [{
      label: '&Reload',
      accelerator: 'Ctrl+R',
      click() {
        mainWindow.webContents.reload();
      }
    }, {
      label: 'Toggle &Full Screen',
      accelerator: 'F11',
      click() {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      }
    }, {
      label: 'Toggle &Developer Tools',
      accelerator: 'Alt+Ctrl+I',
      click() {
        mainWindow.toggleDevTools();
      }
    }] : [{
      label: 'Toggle &Full Screen',
      accelerator: 'F11',
      click() {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      }
    }]
  }, {
    label: 'Help',
    submenu: [{
      label: 'Learn More',
      click() {
        shell.openExternal('https://github.com/VYNYL/gulpnoir');
      }
    }]
  }];
  menu = Menu.buildFromTemplate(template);
  mainWindow.setMenu(menu);
});
