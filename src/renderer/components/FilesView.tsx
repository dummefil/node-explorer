import FileComponent from './FileComponent';

type ComponentProps = {
  entries: DirectoryEntry[];
  onClick(fileName: string): void;
};

export default function FilesView({ entries, onClick }: ComponentProps) {
  if (!entries || !entries.length) {
    /* TODO: localize me */
    return <div className="FilesView">This folder is empty 😔</div>;
  }
  const filesComponents = entries.map(({ icon, name }) => (
    <FileComponent
      key={name}
      fileName={name}
      fileIcon={icon}
      onClick={onClick}
    />
  ));
  return <div className="FilesView">{filesComponents}</div>;
}
