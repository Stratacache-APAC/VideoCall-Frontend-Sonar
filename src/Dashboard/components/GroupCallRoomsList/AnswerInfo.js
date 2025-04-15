import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import store from '../../../store/store';
import './GroupCallRoomsList.css';
import * as common from '../../../utils/Service/Common';
import * as webRTCGroupCallHandler from '../../../utils/webRTC/webRTCGroupCallHandler';
import CopyClipBoardImg from '../../../resources/copy-clipboard.png'
import ScalaAuto from '../../../resources/ScalaAuto.png'
import loadinggif from '../../../resources/XOsX.gif'
import { positions } from 'react-alert';
import { Button } from 'react-bootstrap';
import { io } from 'socket.io-client';
const videoSocket = io("http://127.0.0.1:5001");

const AnswerInfo = (props) => {
  const { groupCallRooms } = props;
  const [kioskSessionId, setKioskSessionId] = useState(0); // Initial value from localStorage
  const isActiveGroupCall = webRTCGroupCallHandler.checkActiveGroupCall();
  const roomId = isActiveGroupCall; // Assuming isActiveGroupCall contains the room ID
  const [copiedMessage, setCopiedMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const variables = [
    {
      kisokName: 'T1-ARR-L2-VID-10',
      ID: '10.68.100.203',
      Password: '#test123',
    },
    {
      kisokName: 'T1-ARR-L2-VID-11',
      ID: '10.68.100.204',
      Password: '#test123',
    },
    {
      kisokName: 'T1-ARR-L1-VID-12',
      ID: '10.68.100.205',
      Password: '#test123',
    },
    {
      kisokName: 'T1-ARR-L1-VID-13',
      ID: '10.68.100.208',
      Password: '#test123',
    },
    {
      kisokName: 'T1-ARR-L2-VID-09',
      ID: '10.68.100.202',
      Password: '#test123',
    },
    {
      kisokName: 'T1-DEP-L4-VID-01',
      ID: '192.168.0.7',
      Password: '#test123',
    },
    {
      kisokName: 'T1-DEP-L4-VID-02',
      ID: '10.68.100.195',
      Password: '#test123',
    },
    {
      kisokName: 'T1-DEP-L4-VID-03',
      ID: '10.68.100.196',
      Password: '#test123',
    },
    {
      kisokName: 'T1-DEP-L4-VID-04',
      ID: '10.68.100.197',
      Password: '#test123',
    },
    {
      kisokName: 'T1-DEP-L5-VID-06',
      ID: '10.68.100.199',
      Password: '#test123',
    },
    {
      kisokName: 'T1-DEP-L5-VID-05',
      ID: '10.68.100.198',
      Password: '#test123',
    },
    {
      kisokName: 'T1-DEP-L4-VID-07',
      ID: '10.68.100.200',
      Password: '#test123',
    },
    {
      kisokName: 'T1-DEP-L4-VID-08',
      ID: '10.68.100.201',
      Password: '#test123',
    },
    {
      kisokName: 'T1-4K-Banglore',
      ID: '192.168.0.81',
      Password: '#test123',
    },
{
      kisokName: 'T3-4K-Banglore',
      ID: '192.168.0.65',
      Password: '#test123',
    }
  ]

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedMessage(`Copied: ${value}`);
      setTimeout(() => setCopiedMessage(''), 2000); // Clear message after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopiedMessage('Failed to copy');
      setTimeout(() => setCopiedMessage(''), 2000);
    }
  };

  const connectToVNC = async (id) => {
    setLoading(true);
  
    // Store timeout ID
    const timeoutId = setTimeout(() => {
      setLoading(false); // Hide loader after 5 seconds
    }, 5000);
      // Send the ID to the backend via WebSocket
    console.log('Connecting to', id);
    videoSocket.emit('run_python', { action: 'connect_vnc', id });
    // Clear timeout if the component unmounts or if the function runs again
    return () => clearTimeout(timeoutId);
  

  };
  

  useEffect(() => {
    const fetchKioskSessionId = async () => {
      if (roomId) {
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER}/getKioskSessionId?roomId=${roomId}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log('my kiosk Data = ', data);

          setKioskSessionId(data.kioskSessionId); // Set state
          localStorage.setItem('kioskSessionId', data.kioskSessionId); // Store in localStorage
          if (typeof window !== 'undefined') {
            window.parent.postMessage({ socketId: data.kioskSessionId }, '*');
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      }
    };

    fetchKioskSessionId();
  }, [roomId]);

  useEffect(() => {
    console.log("Answered Info $$$$$$$");
    console.log(groupCallRooms);
    console.log(store.getState());
  }, []);

  return (
    <>
      {/* {store.getState() && store.getState().call.callStateStartTime &&
        <div className='mx-4 my-2' style={{ textWrap: 'nowrap' }}>
          <div className='p-2 m-1 rounded kiosk-password' style={{ display: 'flex', width: '100%', justifyContent: 'end', position: 'fixed', }}>
            <div className='d-block font_weight_800 color_theme' style={{ fontSize: '20px', flex: "0 0 13%" }}>Session ID: {kioskSessionId || 'Loading...'} </div>
            <div className='d-block font_weight_800 color_theme' style={{ textAlign: 'right', flex: '0 0 30%' }}>
              <div style={{ fontSize: '20px' }}>
                Kiosk: {store.getState().call.callStateStartTime.name}
              </div>
              {variables.map((variable) => {
                // Check if kisokName matches callStateStartTimeName
                if (`${store.getState().call.callStateStartTime.name}` === variable.kisokName) {
                  return (
                    <div className="clip-board" key={variable.kisokName} style={styles.variableContainer}>
                      <div>
                        <span style={styles.label}>ID:</span>
                        <span style={styles.value}>{variable.ID}</span>
                        <button
                          style={styles.copyButton}
                          onClick={() => copyToClipboard(variable.ID)}
                        >
                          <img src={CopyClipBoardImg} width={15} alt="Copy Clipboard" />
                        </button>
                      </div>

                      <div>
                        <span style={styles.label}>Password:</span>
                        <span style={styles.value}>{variable.Password}</span>
                        <button
                          style={styles.copyButton}
                          onClick={() => copyToClipboard(variable.Password)}
                        >
                          <img src={CopyClipBoardImg} width={15} alt="Copy Clipboard" />
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
              {copiedMessage && <p style={styles.copiedMessage}>{copiedMessage}</p>}
            </div>
          </div>
        </div>
      } */}
       {/* Loader screen */}
       {loading && (
        <div className="loader-popup">
        <div className="popup-content" style={{display:'flex', flexDirection:'column'}}>
          <div style={{marginBottom:'50px'}}>
          <img src={loadinggif} style={{width:'100px', height:'100px'}} alt="Loading..." className="loading-gif" />
          <p style={{color:'#fff'}} className="loading-text">Please wait, Connecting...</p>
          </div>
          <div>
            <p style={{color:'#fff'}}>Note: Once you are in the VNC screen, if the display is not adjusted properly, please click on "Scale: Auto" to fit it to your screen.</p>
          <img src={ScalaAuto} style={{width:'530px' , height:'108px'}} alt="Copy Clipboard" />
          </div>
        </div>
      </div>
      
      )}
      {store.getState() && store.getState().call.callStateStartTime &&
        <div className='p-2 m-1 rounded kiosk-password' style={{ display: 'flex', width: '100%', justifyContent: 'end', position: 'fixed', overflow: 'hidden' }}>
          <div className='d-block font_weight_800 color_theme' style={{ fontSize: '20px', flex: "0 0 22%" }}>Session ID: {kioskSessionId || 'Loading...'} </div>
          <div className='d-block font_weight_800 color_theme' style={{ textAlign: 'right', flex: '0 0 30%' }}>
            <div style={{ fontSize: '20px' }}>
              Kiosk: {store.getState().call.callStateStartTime.name}
            </div>
            {variables.map((variable) => {
              // Check if kisokName matches callStateStartTimeName
              if (`${store.getState().call.callStateStartTime.name}` === variable.kisokName) {
                return (
                  <div className="clip-board" key={variable.kisokName} style={styles.variableContainer}>
                    <div>
                      <span style={styles.label}>ID:</span>
                      <span style={styles.value}>{variable.ID}</span>
                    </div>
                    <div>
                      <button onClick={() => connectToVNC(variable.ID)}>Connect Vnc</button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      }
    </>

  );
};

const mapStoreStateToProps = ({ dashboard }) => (
  {
    ...dashboard
  }
);

const styles = {
  variableContainer: {
    display: "flex",
    alignItems: "center",
    color: "#231F20",
  },
  label: {
    fontWeight: "bold",
    color: "#231F20",
    font: '20px',
    marginRight: '10px'
  },
  value: {
    color: "#231F20",
    font: '20px'
  },
  copyButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2em",
    color: "#231F20",
  },
  copiedMessage: {
    color: "green",
    marginTop: "10px",
    color: "#231F20",
    position: "absolute",
    bottom: "0rem",
    transform: "translateX(-50%)",
    left: "64%",
    fontSize: "12px",
    background: "green",
    padding: '1px 15px',
    borderRadius: '10px',
    color: '#ffffff'
  },
};

export default connect(mapStoreStateToProps)(AnswerInfo);
