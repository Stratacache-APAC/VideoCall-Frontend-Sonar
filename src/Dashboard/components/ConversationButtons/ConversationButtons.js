// import React, { useEffect }  from 'react';
// import { MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdVideoLabel, MdCamera } from 'react-icons/md';
// import ConversationButton from './ConversationButton';
// import { switchForScreenSharingStream, hangUp } from '../../../utils/webRTC/webRTCHandler';
// import store from '../../../store/store';
// import Conversation from './Conversation.css';


// const styles = {
//   buttonContainer: {
//     // display: 'flex',
//     position: 'absolute',
//     // bottom: '10%',
//     // left: '45%'
//     bottom: '43%',
//     left: '92%'
//   },
//   icon: {
//     width: '25px',
//     height: '25px',
//     fill: '#e6e5e8'
//   }
// };

// const ConversationButtons = (props) => {
//   const {
//     localStream,
//     localCameraEnabled,
//     localMicrophoneEnabled,
//     setCameraEnabled,
//     setMicrophoneEnabled,
//     screenSharingActive,
//     groupCall
//   } = props;

//   useEffect(() => {
//     console.log("Conversation btns $$$$$");
//     console.log(store.getState().call.localMicrophoneEnabled);
//     setMicrophoneEnabled(store.getState().call.localMicrophoneEnabled);
//     setCameraEnabled(store.getState().call.localCameraEnabled);
//   }, []);

//   const handleMicButtonPressed = () => {
//     console.log("$$$$$$$$$$ micro phone $$$$$$$$$$$");
//     const micEnabled = localMicrophoneEnabled;
//     localStream.getAudioTracks()[0].enabled = !micEnabled;
//     console.log(localStream);
//     console.log(localStream.getAudioTracks()[0]);

//     console.log(micEnabled);
//     setMicrophoneEnabled(!micEnabled);
//   };

//   const handleCameraButtonPressed = () => {
//     const cameraEnabled = localCameraEnabled;
//     localStream.getVideoTracks()[0].enabled = !cameraEnabled;
//     setCameraEnabled(!cameraEnabled);
//   };

//   const handleScreenSharingButtonPressed = () => {
//     switchForScreenSharingStream();
//   };

//   const handleHangUpButtonPressed = () => {
//     hangUp();
//   };

//   return (
//     <div style={styles.buttonContainer} className="disconnect-btn-align">
//       <ConversationButton onClickHandler={handleMicButtonPressed}>
//         {localMicrophoneEnabled ? <MdMic style={styles.icon} /> : <MdMicOff style={styles.icon} />}
//       </ConversationButton>
//       {!groupCall && <ConversationButton onClickHandler={handleHangUpButtonPressed}>
//         <MdCallEnd style={styles.icon} />
//       </ConversationButton>}
//       <ConversationButton onClickHandler={handleCameraButtonPressed}>
//         {localCameraEnabled ? <MdVideocam style={styles.icon} /> : <MdVideocamOff style={styles.icon} />}
//       </ConversationButton>
//       {!groupCall && <ConversationButton onClickHandler={handleScreenSharingButtonPressed}>
//         {screenSharingActive ? <MdCamera style={styles.icon} /> : <MdVideoLabel style={styles.icon} />}
//       </ConversationButton>}
//     </div>
//   );
// };

// export default ConversationButtons;
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { switchForScreenSharingStream, hangUp } from '../../../utils/webRTC/webRTCHandler';
import micOnIcon from '../../../resources/micIcon.png';
import micOffIcon from '../../../resources/micOffIcon.png';
import videoOnIcon from '../../../resources/vedioIcon.png';
import videoOffIcon from '../../../resources/videoOffIcon.png';
import { MdCallEnd, MdCamera, MdVideoLabel } from 'react-icons/md';

const ConversationButtons = (props ,{ username }) => {
  const {
    localStream,
    localCameraEnabled,
    localMicrophoneEnabled,
    setCameraEnabled,
    setMicrophoneEnabled,
    screenSharingActive,
    groupCallActive,
    groupCall,
  } = props;

  // State for viewport width
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  // Update viewport width on window resize
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Conditional styles based on viewport width
  const styles = {
    buttonContainer: {
      position: 'absolute',
      bottom: viewportWidth < 700 ? '3%' : (viewportWidth < 800 ? '4%' : '50%'),
      display: viewportWidth < 200 ? 'none' : 'flex',
      left: viewportWidth < 700 ? '52%' : (viewportWidth < 800 ? '52%' : '91%'),
      zIndex: '999',
      // display:'flex',
      flexDirection: viewportWidth < 700 ? 'row' : (viewportWidth < 800 ? 'row' : 'column'),
      alignItems: 'center',
      gap: viewportWidth > 1400 ? '136px' : (viewportWidth < 700 ? '65px' : (viewportWidth < 800 ? '100px' : '65px'))

    },
    icon: {
      width: viewportWidth < 700 ? '23px' : (viewportWidth < 800 ? '23px' : '23px'),
      height: viewportWidth < 700 ? '24px' : (viewportWidth < 800 ? '24px' : '24px'),
      marginBottom:'6px',
      cursor: 'pointer',
    },
    iconv: {
      width: viewportWidth < 700 ? '31px' : (viewportWidth < 800 ? '31px' : '31px'),
      marginBottom:'6px',
      height: viewportWidth < 700 ? '21px' : (viewportWidth < 800 ? '21px' : '21px'),
      cursor: 'pointer',
    },
    iconContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
    },
    text: {
      marginTop: '5px',
      color: 'black',
      fontSize: viewportWidth < 700 ? '13px' : (viewportWidth < 800 ? '13px' : '13px'),
      textAlign: 'center',
       whiteSpace: 'nowrap'
    },
    textv: {
      marginTop: '5px',
      color: 'black',
      fontSize: viewportWidth < 700 ? '13px' : (viewportWidth < 800 ? '13px' : '13px'),
      textAlign: 'center',
       whiteSpace: 'nowrap'
    },
  };

  const handleMicButtonPressed = () => {
    const micEnabled = localMicrophoneEnabled;
    localStream.getAudioTracks()[0].enabled = !micEnabled;
    setMicrophoneEnabled(!micEnabled);
  };

  const handleCameraButtonPressed = () => {
    const cameraEnabled = localCameraEnabled;
    localStream.getVideoTracks()[0].enabled = !cameraEnabled;
    setCameraEnabled(!cameraEnabled);
  };

  const handleScreenSharingButtonPressed = () => {
    switchForScreenSharingStream();
  };

  const handleHangUpButtonPressed = () => {
    hangUp();
  };

  return (
    <div style={styles.buttonContainer}>
      {props.username.usertype === "OPERATOR" && groupCallActive && (
        <div onClick={handleCameraButtonPressed} style={styles.iconContainer}>
          <img
            // src={localCameraEnabled ? videoOffIcon : videoOnIcon} // Conditionally change image
            src={localCameraEnabled ? videoOnIcon : videoOffIcon} // Conditionally change image
            alt={localCameraEnabled ? "Video Off Icon" : "Video On Icon"}
            style={styles.iconv}
          />
          <div style={styles.textv}>
            {/* {localCameraEnabled ? 'Video Off' : 'Video On'} */}
            {localCameraEnabled ? 'Video On' : 'Video Off'}
          </div>
        </div>
      )}
  
      {!groupCall && (
        <div onClick={handleScreenSharingButtonPressed} style={styles.iconContainer}>
          {screenSharingActive ? <MdCamera style={styles.icon} /> : <MdVideoLabel style={styles.icon} />}
        </div>
      )}
  
      {props.username.usertype === "OPERATOR" && groupCallActive && (
        <div onClick={handleMicButtonPressed} style={styles.iconContainer}>
          <img
            // src={localMicrophoneEnabled ? micOffIcon : micOnIcon} // Conditionally change image
            src={localMicrophoneEnabled ? micOnIcon : micOffIcon} // Conditionally change image
            alt={localMicrophoneEnabled ? "Mic Off Icon" : "Mic On Icon"}
            style={styles.icon}
          />
          <div style={styles.text}>
            {/* {localMicrophoneEnabled ? 'Mute' : 'Unmute'} */}
            {localMicrophoneEnabled ? 'Unmute' : 'Mute'}
          </div>
        </div>
      )}
  
      {!groupCall && (
        <div onClick={handleHangUpButtonPressed} style={styles.iconContainer}>
          <MdCallEnd style={styles.icon} />
        </div>
      )}
    </div>
  );
  
};

export default ConversationButtons;
