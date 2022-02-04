import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons';

type ComponentProps = {
  currentPath: string;
  showBack: boolean;
  showForward: boolean;
  onClick(direction: string): void;
};

export default function TopBar(props: ComponentProps) {
  const { currentPath, onClick, showBack, showForward } = props;
  useEffect(() => {}, [currentPath]);
  const upClick = () => {
    onClick('up');
  };

  const backClick = () => {
    onClick('back');
  };

  const forwardClick = () => {
    onClick('forward');
  };
  return (
    <div className="TopBar">
      <button type="button" disabled={!showBack} onClick={backClick}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <button type="button" disabled={!showForward} onClick={forwardClick}>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
      <button type="button" onClick={upClick}>
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
      <p className="TopBarPathInput">{currentPath}</p>
    </div>
  );
}
