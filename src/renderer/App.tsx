import './App.css';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
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

enum Direction {
  'up',
  'back',
  'forward',
}

function Border() {
  return (
    <div className="Border">
      <div className="draggable" />
      <div className="Buttons">
        <button
          type="button"
          onClick={() => {
            window.ipcRenderer.send('minimize');
          }}
        >
          <FontAwesomeIcon icon={faWindowMinimize} />
        </button>
        <button
          type="button"
          onClick={() => {
            window.ipcRenderer.send('maximize');
          }}
        >
          <FontAwesomeIcon icon={faExpand} />
        </button>
        <button
          type="button"
          onClick={() => {
            window.ipcRenderer.send('close');
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [currentEntries, setCurrentEntries] = useState<DirectoryEntry[]>([]);
  const [showBack, setShowBack] = useState<boolean>(false);
  const [showForward, setShowForward] = useState<boolean>(false);

  const setValues = (currentDirectory: CurrentDirectory) => {
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

  useEffect(() => {
    if (!currentEntries.length) {
      const currentDirectory = window.ipcRenderer.sendSync('direction', '');
      setValues(currentDirectory);
    }
  });

  const changeDirection = (direction: Direction | string) => {
    const currentDirectory = window.ipcRenderer.sendSync(
      'direction',
      direction
    );
    setValues(currentDirectory);
  };

  return (
    <React.StrictMode>
      <Border />
      <Container column>
        <TopBar
          currentPath={currentPath}
          onClick={changeDirection}
          showBack={showBack}
          showForward={showForward}
          onSubmit={(event: BaseSyntheticEvent) => {
            changeDirection(event.target.value);
          }}
        />
        <Container row>
          {showLeftMenu && <LeftMenu />}
          {showRightMenu && (
            <RightMenu entries={currentEntries} onClick={changeDirection} />
          )}
        </Container>
      </Container>
    </React.StrictMode>
  );
}
