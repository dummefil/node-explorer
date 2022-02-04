import './App.css';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExpand,
  faWindowMinimize,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import LeftMenu from './components/LeftMenu';
import RightMenu from './components/RightMenu';
import Container from './components/Container';
import TopBar from './components/TopBar';

const showLeftMenu = false;
const showRightMenu = true;

function Border() {
  return (
    <div className="Border">
      <div className="draggable" />
      <div className="Buttons">
        <button type="button">
          <FontAwesomeIcon icon={faWindowMinimize} />
        </button>
        <button type="button">
          <FontAwesomeIcon icon={faExpand} />
        </button>
        <button type="button">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  // nanotechnology
  const {
    entries: e,
    current: c,
    back: b,
    forward: f,
  } = window.directory.getCurrent();
  const [currentPath, setCurrentPath] = useState(c);
  const [currentEntries, setCurrentEntries] = useState(e);
  const [showBack, setShowBack] = useState(b);
  const [showForward, setShowForward] = useState(f);

  const onClick = (direction: string) => {
    const currentDirectory = window.directory.changeDir(direction);
    if (currentDirectory) {
      const { current, entries, back, forward } = currentDirectory;
      setShowForward(forward);
      setShowBack(back);
      if (current) {
        setCurrentPath(current);
      }
      if (entries) {
        setCurrentEntries(entries);
      }
    }
  };

  return (
    <React.StrictMode>
      <Border />
      <Container column>
        <TopBar
          currentPath={currentPath}
          onClick={onClick}
          showBack={showBack}
          showForward={showForward}
        />
        <Container row>
          {showLeftMenu && <LeftMenu />}
          {showRightMenu && (
            <RightMenu entries={currentEntries} onClick={onClick} />
          )}
        </Container>
      </Container>
    </React.StrictMode>
  );
}
