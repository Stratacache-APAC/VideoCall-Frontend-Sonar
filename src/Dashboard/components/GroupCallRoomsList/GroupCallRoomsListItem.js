
import React, { useEffect, useState } from 'react';
import * as webRTCGroupCallHandler from '../../../utils/webRTC/webRTCGroupCallHandler';
import beep from '../../../resources/beep-05.mp3';
import store from '../../../store/store';
import { setLocalCameraEnabled, setLocalMicrophoneEnabled } from '../../../store/actions/callActions';
import LocationIcon from '../../../resources/Location_on.png';
import VideoIcon from '../../../resources/Camera.png';
import MicIcon from '../../../resources/mute.png';
import MicOffIcon from '../../../resources/disabledmute.png'; // Add an icon for mic off
import VideoOffIcon from '../../../resources/disabledcamera.png'; // Add an icon for video off
import AnswerIcon from '../../../resources/answercall.png';
import './GroupCallRoomsList.css';
import * as Services from '../../../utils/Service/Service'
import { startRecording } from '../../../utils/videoRecording/recordingUtils';

const userDetails = JSON.parse(localStorage.getItem('userDetails'));

const GroupCallRoomsListItem = ({ room, videoStatus }) => {
  let audio = new Audio(beep);
  // const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  // const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isVideoCallConnected, setIsVideoCallConnected] = useState(false);

  //  const [isAudioEnabled, setIsAudioEnabled] = useState(!videoStatus.muteStatus);
  //  const [isVideoEnabled, setIsVideoEnabled] = useState(!videoStatus.cameraStatus);

  useEffect(() => {
    // Check if videoStatus is available and update only if valid
    if (videoStatus && videoStatus.muteStatus !== undefined && videoStatus.cameraStatus !== undefined) {
      setIsAudioEnabled(!videoStatus.muteStatus); // Negate muteStatus
      setIsVideoEnabled(!videoStatus.cameraStatus); // Negate cameraStatus
    }
  }, [videoStatus]); // This will run again once videoStatus changes

  useEffect(() => {
    if (store.getState().call.callState === "CALL_AVAILABLE") {
      audio.play();
    }
  }, []);

  const handleListItemPressed = () => {
    handleMicroPhone();
    handleVideoBtn();
    webRTCGroupCallHandler.joinGroupCall(room.socketId, room.roomId, room.hostName.username, room.hostName.userreason);
    localStorage.setItem('isVideoCallOn', true);


    // startRecording(store.getState().call.callStateStartTime.name);
    setTimeout(() => {
      Services.updateAgentCallStatus(userDetails.userId, 'busy', true);
    }, 2000);
    startRecording(room.hostName, room.roomId);
  };

  const handleMicroPhone = () => {
    const localStream = store.getState().call.localStream;
    //console.log('checking local stream', localStream);
    localStream.getAudioTracks()[0].enabled = isAudioEnabled;
    store.dispatch(setLocalMicrophoneEnabled(isAudioEnabled));
  };

  const handleVideoBtn = () => {
    const localStream = store.getState().call.localStream;
    localStream.getVideoTracks()[0].enabled = isVideoEnabled;
    store.dispatch(setLocalCameraEnabled(isVideoEnabled));
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    handleMicroPhone();
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    handleVideoBtn();
  };

  return (
    <>
      {!room.isAns && (
        <div className="call-details-row">
          {/* Left container with Answer icon */}
          <div className="left-container">
            <img src={AnswerIcon} alt="Answer Icon" className="answer-icon" />
          </div>

          {/* Host name and location */}
          <div className="icon-with-text">
            <div className="location-icon-wrapper">
              <img src={LocationIcon} alt="Location Icon" className="location-icon" />
            </div>
            <span className="call-info-item">{room.hostName.username}</span>
          </div>

          {/* Action buttons for audio, video, and answer */}
          <div className="call-actions">
            {/* <div onClick={toggleAudio} style={{background:'none'}}>
              <img
                src={isAudioEnabled ? MicIcon : MicOffIcon}
                alt={isAudioEnabled ? "Mic Icon" : "Mic Off Icon"}
                className="button-icon"
                style={{width:'40px', height:'40px'}}
              />
            </div>
            <div  onClick={toggleVideo} style={{background:'none'}}>
              <img
                src={isVideoEnabled ? VideoIcon : VideoOffIcon}
                alt={isVideoEnabled ? "Video Icon" : "Video Off Icon"}
                className="button-icon"
                style={{width:'40px', height:'40px'}}
              />
            </div> */}
            <button
              className="action-button answer-button"
              style={{backgroundColor:'green'}}
              onClick={handleListItemPressed}
              disabled={store.getState().call.callState === "CALL_IN_PROGRESS"}
            >
              Answer
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupCallRoomsListItem;
