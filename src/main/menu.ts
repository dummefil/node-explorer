import { Menu, shell, BrowserWindow } from 'electron';
import buildMacOSTemplateMenu from './macOSTemplateMenu';
import buildDefaultTemplateMenu from './defaultTemplateMenu';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? buildMacOSTemplateMenu(this.mainWindow, shell)
        : buildDefaultTemplateMenu(this.mainWindow, shell);

    const menu = Menu.buildFromTemplate(template);
    const hideMenu = true;
    if (hideMenu) {
      Menu.setApplicationMenu(null);
    } else {
      Menu.setApplicationMenu(menu);
    }

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        { label: 'buba' },
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }
}
