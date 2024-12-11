// FullScreenMode.jsx

import React, { createContext, useState, useRef, useEffect } from 'react';
import './FullScreenMode.css';

export const FullscreenContext = createContext(false);

function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const elementRef = useRef(null);

  const enterFullscreen = () => {
    if (elementRef.current) {
      elementRef.current.requestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return { isFullscreen, enterFullscreen, exitFullscreen, elementRef };
}

function FullApp({ children }) {
  const { isFullscreen, enterFullscreen, exitFullscreen, elementRef } = useFullscreen();

  return (
    <FullscreenContext.Provider value={isFullscreen} className='fullscreen'>
      <div>
        <button onClick={enterFullscreen}>Enter Fullscreen</button>
        {isFullscreen && (
          <button onClick={exitFullscreen}>Exit Fullscreen</button>
        )}
        <div
          ref={elementRef}
          className={isFullscreen ? 'fullscreen-content' : 'normal-content'}
        >
          {children}
        </div>
      </div>
    </FullscreenContext.Provider>
  );
}

export default FullApp;