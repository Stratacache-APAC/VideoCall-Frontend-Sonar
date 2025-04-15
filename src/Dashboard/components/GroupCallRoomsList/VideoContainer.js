import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import VideoIcon from '../../../resources/white-Camera.png';
import MicIcon from '../../../resources/white-mute.png';
import MicOffIcon from '../../../resources/white-disabledmute.png';
import VideoOffIcon from '../../../resources/white-disabledcamera.png';
import VirtualBg from '../../../resources/vi-bg-open-icon.png';
import VirtualBgClose from '../../../resources/vi-bg-close-icon.png';
import bg from '../../../resources/DSC_0412.jpg';
import { setShowCanva,setCanvaBg  } from '../../../store/actions/btnActions';

import bg1 from '../../../resources/DSC_0412.jpg';
import bg2 from '../../../resources/DSC_0379.jpg';
import bg3 from '../../../resources/AUM_3747.jpg';
import bg4 from '../../../resources/light-glare-bg.jpg';
import bg5 from '../../../resources/white-gradient-bg.jpg';
import bg6 from '../../../resources/TEST.png';

const VideoContainer = ({ stream, onStatusChange }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showCanvas, setShowCanvas] = useState(true);
  const segmentation = useRef(null);
  const dispatch = useDispatch();
  const showCanva = useSelector((state) => state.btn.showCanva);
  dispatch(setShowCanva(showCanva));


  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedBg, setSelectedBg] = useState(bg6);
  dispatch(setCanvaBg(selectedBg));
  const backgrounds = [
    { name: 'No Background', bgname: null },
    { name: 'Background 1', bgname: bg1 },
    { name: 'Background 2', bgname: bg2 },
    { name: 'Background 3', bgname: bg3 },
    { name: 'Background 4', bgname: bg4 },
    { name: 'Background 5', bgname: bg5 },
    { name: 'Background 6', bgname: bg6 },
  ];

  useEffect(() => {
    if (stream && videoRef.current) {
      const remoteGroupCallVideo = videoRef.current;
      remoteGroupCallVideo.srcObject = stream;

      // Apply mute and camera settings
      remoteGroupCallVideo.muted = isMuted;
      stream.getVideoTracks().forEach(track => (track.enabled = !isCameraOff));

      remoteGroupCallVideo.onloadedmetadata = () => {
        remoteGroupCallVideo.play();
        if (showCanvas) initializeSegmentation(remoteGroupCallVideo);
      };

      return () => {
        // Cleanup the segmentation instance if it exists
        if (segmentation.current) {
          segmentation.current.close();
          segmentation.current = null;
        }
      };
    }
  }, [stream, isMuted, isCameraOff, showCanvas]);

  const initializeSegmentation = (videoElement) => {
    if (!segmentation.current) {
      segmentation.current = new SelfieSegmentation({
        locateFile: (file) => `/mediapipe/selfie_segmentation/${file}`,
      });

      segmentation.current.setOptions({ modelSelection: 1 });
      segmentation.current.onResults(onSegmentationResults);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const processFrame = async () => {
        if (segmentation.current) {
          await segmentation.current.send({ image: videoElement });
          requestAnimationFrame(processFrame);
        }
      };
      processFrame();

    }
  };

  const onSegmentationResults = (results) => {
    const canvas = canvasRef.current;
    if (canvas && showCanvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.segmentationMask) {
        ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'destination-over';

        const background = new Image();
        background.src = bg;
        background.onload = () => ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    onStatusChange({ muteStatus: !isMuted, cameraStatus: isCameraOff });
  };

  // Toggle camera off
  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
    onStatusChange({ muteStatus: isMuted, cameraStatus: !isCameraOff });
  };

  // Toggle virtual background
  const toggleBackground = () => {
    console.log("calling toggleBackground set to :", !showCanvas);

    setShowCanvas(!showCanvas);
    dispatch(setShowCanva(!showCanva));

    setSelectedBg(null);
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleSelectBackground = (bg) => {
    setSelectedBg(bg);
    setDropdownVisible(false);
    dispatch(setCanvaBg(bg));
    // if(bg === null) toggleBackground();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <video ref={videoRef} autoPlay style={{ display: showCanvas ? 'none' : 'block', width: '100%', height: '100%' }} />

      {showCanvas && (
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            top: '40px',
            left: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: selectedBg ? `url(${selectedBg})` : '',
          }}
          className="Group_call_video_fit"
        />
      )}

      {/* Preview text in the top-left corner */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: '#29417D',
        fontSize: '18px',
        fontStyle: 'italic',
      }}>
        Preview
      </div>

      {isMuted && isCameraOff && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '15px',
          fontWeight: 'bold',
          textAlign: 'center',
          maxWidth: '90%',
          wordWrap: 'break-word',
        }}>
          Please turn your mic and camera on before answering a call
        </div>
      )}

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '80px',
        backgroundColor: '#29417D',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        color: 'white',
        fontSize: '14px',
        zIndex: '1'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button onClick={toggleMute} style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            <img src={isMuted ? MicOffIcon : MicIcon} alt="Mute/Unmute" style={{ width: '40px', height: '40px' }} />
          </button>
          <span>{isMuted ? 'Unmute' : 'Mute'}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button onClick={toggleCamera} style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            <img src={isCameraOff ? VideoOffIcon : VideoIcon} alt="Camera On/Off" style={{ width: '40px', height: '40px' }} />
          </button>
          <span>{isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            onClick={toggleBackground}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            <img
              src={showCanvas ? VirtualBg : VirtualBgClose}
              alt="Change Background"
              style={{ width: '40px', height: '40px' }}
            />
          </button>
          <span>
            {showCanvas ? (
              <>
                Background
                <button
                  onClick={toggleDropdown}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    paddingLeft: '5px',
                  }}
                >
                  ▼ {/* Triangle mark (can be styled or replaced with an icon) */}
                </button>
                {dropdownVisible && (
                  <ul
                    style={{
                      listStyleType: 'none',
                      margin: 0,
                      padding: '0px',
                      backgroundColor: 'white',
                      color: 'black',
                      overflowY:'scroll',
                      height:'90px',
                      position: 'absolute',
                      borderRadius: '5px',
                      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {backgrounds.map((bg, index) => (
                      <li key={index} style={{
                        backgroundColor: index % 2 === 0 ? '#D5E0F7' : 'white', // Odd items have color #D5E0F7, even items have white
                      }}>
                        <button
                          onClick={() => handleSelectBackground(bg.bgname)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#29417D',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            padding: '5px 10px',
                            display: 'flex',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {bg.name}
                          {/* Display the check mark if this background is selected */}
                          {selectedBg === bg.bgname && (
                            <span
                              style={{
                                color: '#29417D', // Check mark color
                                fontSize: '18px',
                                marginLeft: '30px', // Add left margin to space out the check mark from text
                                verticalAlign: 'middle', // Align check mark with text
                              }}
                            >
                              ✔
                            </span>
                          )}

                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              'No Background'
            )}
          </span>
        </div>
      </div>

    </div>
  );
};

export default VideoContainer;
