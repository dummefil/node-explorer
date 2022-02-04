import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons';
import { faJs } from '@fortawesome/free-brands-svg-icons';

const IconsPresets: IDictionary<IconDefinition> = {
  default: faFile,
  js: faJs,
  folder: faFolder,
};

type ComponentProps = {
  fileName: string;
  fileIcon: string;
  onClick(fileName: string): void;
};
export default function FileComponent({
  fileName,
  fileIcon,
  onClick,
}: ComponentProps) {
  const icon = IconsPresets[fileIcon] || IconsPresets.default;
  return (
    <div
      className="File"
      onDoubleClick={() => {
        onClick(fileName);
      }}
    >
      <div className="FileIcon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="FileName">{fileName}</div>
    </div>
  );
}
