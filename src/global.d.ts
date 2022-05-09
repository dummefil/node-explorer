type DirectoryEntry = {
  icon: string;
  name: string;
};

interface IDictionary<T> {
  [key: string]: T;
}

type CurrentDirectory = {
  entries: DirectoryEntry[];
  current: string;
  back: boolean;
  forward: boolean;
};

interface Window {
  ipcRenderer: {
    sendSync(string: string, data?: any): any;
    send(string: string, data?: any): any;
  };
}
