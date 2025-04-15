import React from 'react';
import './CallEndedPopup.css';
import callEndedIcon from '../../../resources/CallEndPopupIcon.png'; // Adjust the path if needed

const CallEndedPopup = ({ sessionId, duration }) => {
  console.log("Rendering CallEndedPopup"); // This should appear in the console if the component renders

  return (
    <div className="call-ended-popup">
      <div className='call-ended-popup-inner '>
      <div className="popup-content">
        <div>
        <img src={callEndedIcon} alt="Call Ended" className="call-ended-icon" />
        </div>
        <div className="call-ended-text-container">
        <div className="call-ended-text">Call Ended</div>
        <div className="session-id">Session ID: {sessionId}</div>
        <div className="call-duration">{duration}</div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default CallEndedPopup;
