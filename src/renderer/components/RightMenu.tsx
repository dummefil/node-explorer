import FileComponent from './FileComponent';

type ComponentProps = {
  entries: DirectoryEntry[];
  onClick(fileName: string): void;
};

export default function RightMenu({ entries, onClick }: ComponentProps) {
  if (!entries || !entries.length) {
    /* TODO: localize me */
    return <div className="RightMenu">This folder is empty 😔</div>;
  }
  const filesComponents = entries.map(({ icon, name }) => (
    <FileComponent
      key={name}
      fileName={name}
      fileIcon={icon}
      onClick={onClick}
    />
  ));
  return <div className="RightMenu">{filesComponents}</div>;
}
