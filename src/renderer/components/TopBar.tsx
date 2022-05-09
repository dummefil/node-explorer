import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons';

enum Direction {
  'up',
  'back',
  'forward',
}

type ComponentProps = {
  currentPath: string;
  showBack: boolean;
  showForward: boolean;
  onClick(direction: Direction): void;
  onChange(...args: any): void;
};

export default function TopBar(props: ComponentProps) {
  const { currentPath, onClick, showBack, showForward, onChange } = props;
  useEffect(() => {}, [currentPath]);
  // todo fix this
  const upClick = () => {
    onClick(0); // Direction.up
  };

  const backClick = () => {
    onClick(1); // Direction.back
  };

  const forwardClick = () => {
    onClick(2); // Direction.forward
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
      <input
        className="TopBarPathInput"
        value={currentPath}
        onChange={onChange}
      />
    </div>
  );
}
