import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

enum Direction {
  'up',
  'back',
  'forward',
}

type HistoryEntry = {
  back: string | undefined;
  forward: string | undefined;
};

type History = {
  [key: string]: HistoryEntry;
};

const EmptyHistoryEntry = {
  back: undefined,
  forward: undefined,
};

class DirectoryHistory {
  history: History;

  constructor() {
    this.history = {};
  }

  static hashFromString(string: string): string {
    return crypto.createHash('md5').update(string).digest('hex');
  }

  ensureExistence(currentPath: string) {
    const hash = DirectoryHistory.hashFromString(currentPath);
    if (!this.history[hash]) {
      this.history[hash] = {
        ...EmptyHistoryEntry,
      };
    }
    return hash;
  }

  setBack(currentPath: string, backPath: string) {
    const hash = this.ensureExistence(currentPath);
    this.history[hash].back = backPath;
  }

  setForward(currentPath: string, forwardPath: string) {
    const hash = this.ensureExistence(currentPath);
    this.history[hash].forward = forwardPath;
  }

  getEntry(currentPath: string) {
    const hash = this.ensureExistence(currentPath);
    return this.history[hash];
  }
}

function getIcon(entry: fs.Dirent) {
  if (entry.isDirectory()) {
    return 'folder';
  }

  const ext = path.extname(entry.name);
  if (ext === 'js' || ext === 'jsx') {
    return 'js';
  }

  return 'default';
}

const history = new DirectoryHistory();

const showHidden = false;

type TreeFolder = string | IDictionary<string | TreeFolders>;
type TreeFolders = Array<TreeFolder>;

export const buildFolderTree = () => {
  const folders: TreeFolders = [];
  const walk = (current: string, treeFolders: TreeFolders) => {
    fs.readdirSync(current).forEach((name: string) => {
      const folderPath = path.join(current, name);
      try {
        if (fs.statSync(folderPath).isDirectory()) {
          const withFolders =
            fs
              .readdirSync(folderPath)
              .filter(() => fs.statSync(folderPath).isDirectory()).length > 0;
          if (withFolders) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const folders: TreeFolders = [];
            const obj: TreeFolder = { name, folders };
            treeFolders.push(obj);
            walk(folderPath, obj.folders as TreeFolders);
          } else {
            treeFolders.push(name);
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  };
  const disk = 'D://';
  walk(disk, folders);
};

// buildFolderTree();
let current = __dirname;
export const getCurrent = () => {
  const filterHidden = (dirent: fs.Dirent) => {
    try {
      const folderPath = path.join(current, dirent.name);
      fs.statSync(folderPath).isDirectory();
      return true;
    } catch (e) {
      return showHidden;
    }
  };

  const sortAlphabetically = (prev: fs.Dirent, next: fs.Dirent) => {
    const char = (val: fs.Dirent) => val.name.charCodeAt(0);
    if (char(prev) > char(next)) {
      return 1;
    }
    if (char(prev) < char(next)) {
      return -1;
    }
    return 0;
  };

  let folders: fs.Dirent[] = [];
  const splitArrays = (dirent: fs.Dirent) => {
    const folderPath = path.join(current, dirent.name);
    const isFolder = fs.statSync(folderPath).isDirectory();
    if (isFolder) {
      folders.push(dirent);
    }
    return !isFolder;
  };
  const files = fs
    .readdirSync(current, { withFileTypes: true })
    .filter(filterHidden)
    .filter(splitArrays)
    .sort(sortAlphabetically);
  folders = folders.sort(sortAlphabetically);

  const entries = folders.concat(files).map((entry) => {
    const icon = getIcon(entry);
    return {
      icon,
      name: entry.name,
    };
  });
  const historyEntry = history.getEntry(current);
  const back = Boolean(historyEntry.back);
  const forward = Boolean(historyEntry.forward);
  return {
    back,
    forward,
    current,
    entries,
  };
};

export const changeDir = (direction: Direction | string) => {
  try {
    const prevPath = current;
    const { back, forward } = history.getEntry(current);
    if (direction === Direction.up) {
      current = path.resolve(current, '..');
      history.setBack(current, prevPath);
    } else if (direction === Direction.back && back) {
      current = back;
      history.setForward(current, prevPath);
    } else if (direction === Direction.forward && forward) {
      current = forward;
      history.setBack(current, prevPath);
    } else {
      const folderPath = path.join(current, direction as string);
      if (folderPath && fs.statSync(folderPath).isDirectory()) {
        current = folderPath;
        history.setBack(current, prevPath);
      }
    }
  } catch (e) {
    console.log(e);
  }

  return getCurrent();
};
