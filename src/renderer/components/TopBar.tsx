import { BaseSyntheticEvent, useEffect } from 'react';
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
  onSubmit(event: BaseSyntheticEvent): void | never;
  onClick(direction: Direction): void;
};

export default function TopBar(props: ComponentProps) {
  const { currentPath, onClick, showBack, showForward, onSubmit } = props;
  useEffect(() => {}, [currentPath]);
  const upClick = () => {
    onClick(Direction.up);
  };

  const backClick = () => {
    onClick(Direction.back);
  };

  const forwardClick = () => {
    onClick(Direction.forward);
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
        defaultValue={currentPath}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onSubmit(event);
            window.focus();
          }
          return false;
        }}
      />
    </div>
  );
}
