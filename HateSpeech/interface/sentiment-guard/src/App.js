// src/App.js
import React, { useState } from 'react';
import './App.css';  // Update to link to the correct CSS file
import HateSpeechDetection from './HateSpeechDetection';
import BotDetection from './BotDetection'; // We will create this file next
import { FaRobot, FaBullhorn } from 'react-icons/fa'; // Import icons for buttons

function App() {
  const [selectedPage, setSelectedPage] = useState(null);

  const handleSelection = (page) => {
    setSelectedPage(page);
  };

  const returnHome = () => {
    setSelectedPage(null);
  };

  return (
    <div className="app-container">
      {selectedPage === null ? (
        <div className="selection-container">
          <h1 className="app-title">Welcome to the Detection App</h1>
          <p className="abstract">
            Our app helps detect harmful online content. Choose one of the detection options below to get started and contribute to safer social media environments.
          </p>
          <div className="instructions">
            <p>Click on any of the buttons below to start:</p>
          </div>
          <div className="buttons-container">
            <button className="select-btn" onClick={() => handleSelection('HateSpeechDetection')}>
              <FaBullhorn size={24} /> Detect Hate Speech
            </button>
            <button className="select-btn" onClick={() => handleSelection('BotDetection')}>
              <FaRobot size={24} /> Detect Bots
            </button>
          </div>
        </div>
      ) : selectedPage === 'HateSpeechDetection' ? (
        <div className="detection-page">
          <HateSpeechDetection />
          <button className="return-home-btn" onClick={returnHome}>Return Home</button>
        </div>
      ) : selectedPage === 'BotDetection' ? (
        <div className="detection-page">
          <BotDetection />
          <button className="return-home-btn" onClick={returnHome}>Return Home</button>
        </div>
      ) : null}
    </div>
  );
}

export default App;
