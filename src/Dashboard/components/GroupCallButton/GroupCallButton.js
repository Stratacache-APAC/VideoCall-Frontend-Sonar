import React, { useState } from 'react';
import callEndImage from '../../../resources/CallEnd.png'; // Adjust the path if needed
import './GroupCallButton.css';
import CallEndedPopup from './CallEndedPopup';
import { stopRecording } from '../../../utils/videoRecording/recordingUtils'; // Import stopRecording function
import * as webRTCGroupCallHandler from '../../../utils/webRTC/webRTCGroupCallHandler';

import * as Services from '../../../utils/Service/Service'


const userDetails = JSON.parse(localStorage.getItem('userDetails'));

let handleEndCallGlobal; // Declare global variable to store function reference

const GroupCallButton = ({ onClickHandler, label }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [callDetails, setCallDetails] = useState(null);

  const isActiveGroupCall = webRTCGroupCallHandler.checkActiveGroupCall();
  console.log('inside component', isActiveGroupCall);

  const formatDuration = (duration) => {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (duration.includes('Hour')) {
      hours = parseInt(duration.split(' Hour')[0]) || 0;
      duration = duration.split(' Hour')[1].trim();
    }

    if (duration.includes('Minute')) {
      minutes = parseInt(duration.split(' Minute')[0]) || 0;
      duration = duration.split(' Minute')[1].trim();
    }

    if (duration.includes('Second')) {
      seconds = parseInt(duration.split(' Second')[0]) || 0;
    }

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const handleEndCall = async () => {
    console.log('handleEndCall is called');
    await onClickHandler(); // Execute onClickHandler first
    setShowPopup(true); // Show the popup after handler execution
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/getCallDetails?roomId=${isActiveGroupCall}`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error('Response status:', response.status);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Call details:', data);
      const formattedDuration = formatDuration(data.callDuration); // Format the duration
      setCallDetails({ ...data, callDuration: formattedDuration }); // Store the formatted call details
      setTimeout(() => {
        Services.updateAgentCallStatus(userDetails.userId, 'available', true);
      }, 500);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
    stopRecording(); // Stop the recording
    console.log("Popup raised!");
  };


  handleEndCallGlobal = handleEndCall; // Expose handleEndCall globally

  return (
    <div>
      <div onClick={handleEndCall} className='group_call_button'>
        <img src={callEndImage} alt='End Call' className='call_image' />
        <div className='call_text'>{label}</div>
      </div>
      {showPopup && callDetails && (
        <CallEndedPopup sessionId={callDetails.id} duration={callDetails.callDuration} />
      )}
    </div>
  );
};

export { handleEndCallGlobal };
export default GroupCallButton;