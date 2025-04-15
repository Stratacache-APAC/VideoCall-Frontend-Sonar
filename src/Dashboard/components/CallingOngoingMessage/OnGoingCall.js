import React, { useEffect } from 'react';
import LogoImage from '../../../resources/connecting.png';
import twoMinsAudio from '../../../resources/2mins_hold_audio.mp3'; // Import your audio file
import ringingCall from '../../../resources/connecting.mp3'; // Import your audio file
import threeMinsAudio from '../../../resources/3mins_hold_audio.mp3'; // Import your audio file
import fourMinsAudio from '../../../resources/4mins_hold_audio.mp3'; // Import your audio file
import endAudio from '../../../resources/end.mp3'; // Import your audio file
import './OnGoingCall.css';
import axios from 'axios';
let waitTime = process.env.REACT_APP_CALL_WAITING_TIME * 60;

const OnGoingCall = () => {
  useEffect(() => {
    let audio;
    let audioWaitTimeInterval;
    let defaultTime = process.env.REACT_APP_CALL_WAITING_TIME;

    const getAllUserCallStatus = () => {
      startTimere();
      axios
        .get(`${process.env.REACT_APP_SERVER}/getAllUserCallStatus`)
        .then((response) => {
          console.log('user all status of user call', response.data);
          if (response.data.includes('available')) {
            // setTimeout(() => {
            checkForRingAudio();
            // }, 2000);
          } else {
            checkForAudio();
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };


    const checkForAudio = () => {
      console.log('its away');
      if (defaultTime == 4) {
        audio = new Audio(fourMinsAudio);
        audioSettings(audio);
      } else if (defaultTime == 3) {
        audio = new Audio(threeMinsAudio);
        audioSettings(audio);
      } else if (defaultTime == 2) {
        audio = new Audio(twoMinsAudio);
        audioSettings(audio);
      }
    };

    const checkForRingAudio = () => {
      console.log('its available');

      audio = new Audio(ringingCall);
      audioSettings(audio);

    };

    const audioSettings = (audio) => {
      audio.play();
      audio.loop = true;
      audio.volume = 0.3;
      console.log('AUDIO IS PLAYING, ', audio);

    };

    const startTimere = () => {
      audioWaitTimeInterval = setInterval(() => {
        if (waitTime <= 0) {
          audio.pause();
          clearInterval(audioWaitTimeInterval);
          return;
        } else {
          waitTime = waitTime - 10;
          if (waitTime < 11) {
            audio.pause();
            audio = new Audio(endAudio);
            setTimeout(() => {
              if (audio) {
                audio.play();
                audio.volume = 0.3;
                // Add event listener to reload the window when the audio ends
                audio.onended = () => {
                  audio.src = ''
                  let path = '/thankyou';
                  window.location.href = path;
                };
              }
            }, 2000);
          }

        }
      }, 10000);
    };

    // Call the function to fetch the user call status
    getAllUserCallStatus();

    // Cleanup function to stop the audio when the component unmounts
    return () => {
      if (audio) {
        audio.src = ''
        clearInterval(audioWaitTimeInterval);
      }
    };
  }, []);


  return (
    <div className='connecting-message' style={{ color: 'black' }}>
      {
        waitTime > 11 ? (
          <>
            <p style={{ position: 'absolute', top: '26%', left: '50%', transform: 'translate(-50%, -50%)', color: '#29417D', fontWeight: '900', fontSize: '100px' }}>
              Connecting....
            </p>
            <div style={{ width: '3000px', height: '2400px', borderRadius: '50%', position: 'relative', top: '460px', left: '-350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={LogoImage} className="logo-image" style={{ width: '2400px' }} />
            </div>
            <div style={{ fontSize: '88px', fontWeight: '400', position: 'relative', top: '-200px' }}>This call is recorded for quality monitoring purpose. Please hold for the next agent, estimated wait time <b style={{ fontWeight: '900' }}><u>{Math.ceil(waitTime / 60)} minutes</u></b>.</div>
          </>
        ) : (
          <>
            <div className='connecting-message' style={{ color: 'black' }}>
              <p style={{ position: 'absolute', top: '26%', left: '50%', transform: 'translate(-50%, -50%)', color: '#29417D', fontWeight: '900', fontSize: '100px' }}>
                Sorry We are unable to connect
              </p>
              <div style={{ width: '3000px', height: '2400px', borderRadius: '50%', position: 'relative', top: '460px', left: '-350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={LogoImage} className="logo-image" style={{ width: '2400px' }} />
              </div>
              <div style={{ fontSize: '88px', fontWeight: '400', position: 'relative', top: '-200px' }}>
                Please try again...
              </div>
            </div>
          </>
        )
      }

    </div>
  );
};

export default OnGoingCall;