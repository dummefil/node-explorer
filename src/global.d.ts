type DirectoryEntry = {
  icon: string;
  name: string;
};

interface IDictionary<TValue> {
  [id: string]: TValue;
}

type CurrentDirectory = {
  entries: DirectoryEntry[];
  current: string;
  back: boolean;
  forward: boolean;
};

interface Window {
  directory: {
    getCurrent(): CurrentDirectory;
    changeDir(direction: string): CurrentDirectory;
  };
}
