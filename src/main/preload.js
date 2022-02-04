const fs = require('fs');
const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');
const crypto = require('crypto');

const ipcRendererWrapper = {
  myPing() {
    ipcRenderer.send('ipc-example', 'ping');
  },
  on(channel, func) {
    const validChannels = ['ipc-example'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  once(channel, func) {
    const validChannels = ['ipc-example'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.once(channel, (event, ...args) => func(...args));
    }
  },
};

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRendererWrapper,
});

const EmptyHistoryEntry = {
  back: undefined,
  forward: undefined,
};

class DirectoryHistory {
  constructor() {
    this.history = {};
  }

  static hashFromString(string) {
    return crypto.createHash('md5').update(string).digest('hex');
  }

  ensureExistence(currentPath) {
    const hash = DirectoryHistory.hashFromString(currentPath);
    if (!this.history[hash]) {
      this.history[hash] = { ...EmptyHistoryEntry };
    }
    return hash;
  }

  setBack(currentPath, backPath) {
    const hash = this.ensureExistence(currentPath);
    this.history[hash].back = backPath;
  }

  setForward(currentPath, forwardPath) {
    const hash = this.ensureExistence(currentPath);
    this.history[hash].forward = forwardPath;
  }

  getEntry(currentPath) {
    const hash = this.ensureExistence(currentPath);
    return this.history[hash];
  }
}
const history = new DirectoryHistory();

let current = __dirname;
const getCurrent = () => {
  const entries = fs.readdirSync(current, { withFileTypes: true });
  const historyEntry = history.getEntry(current);
  const back = Boolean(historyEntry.back);
  const forward = Boolean(historyEntry.forward);
  return {
    back,
    forward,
    current,
    entries: entries.map((entry) => {
      let icon = 'default';
      if (entry.isDirectory()) {
        icon = 'folder';
      } else {
        const ext = path.extname(entry.name);
        if (ext === 'js' || ext === 'jsx') {
          icon = 'js';
        }
      }

      return { icon, name: entry.name };
    }),
  };
};
const changeDir = (direction) => {
  const prevPath = current;

  const { back, forward } = history.getEntry(current);
  if (direction === 'up') {
    current = path.resolve(current, '..');
    history.setBack(current, prevPath);
  } else if (direction === 'back' && back) {
    current = back;
    history.setForward(current, prevPath);
  } else if (direction === 'forward' && forward) {
    current = forward;
    history.setBack(current, prevPath);
  } else {
    const folderPath = path.join(current, direction);
    if (folderPath && fs.statSync(folderPath).isDirectory()) {
      current = folderPath;
    }
  }

  return getCurrent();
};

contextBridge.exposeInMainWorld('directory', { changeDir, getCurrent });
