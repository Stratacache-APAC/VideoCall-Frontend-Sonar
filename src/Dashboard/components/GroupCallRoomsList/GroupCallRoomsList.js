import React, { useEffect, useState } from 'react';
import GroupCallRoomsListItem from './GroupCallRoomsListItem';
import { connect } from 'react-redux';
import './GroupCallRoomsList.css';
import VideoContainer from './VideoContainer';

const GroupCallRoomsList = (props) => {
  const { groupCallRooms } = props;

  const [filteredRooms, setFilteredRooms] = useState([]);
  const [showBackground, setShowBackground] = useState(false);
  const [stream, setStream] = useState(null);
  const [videoStatus, setVideoStatus] = useState({
    muteStatus: false,
    cameraStatus: false,
  });

  const handleStatusChange = (status) => {
    setVideoStatus(status);
  };

  useEffect(() => {
    console.log('Mute status:', videoStatus.muteStatus);
    console.log('CameraOFF status:', videoStatus.cameraStatus);
  }, [videoStatus]);

  const checkRoomStatus = () => {
    const hasUnansweredRoom = filteredRooms.some((room) => !room.isAns);
    setShowBackground(hasUnansweredRoom);
  };

  useEffect(() => {
    checkRoomStatus();
    const interval = setInterval(() => {
      checkRoomStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [filteredRooms]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        setStream(mediaStream);
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
  }, []);

  useEffect(() => {
    const storedUserTerminalData = JSON.parse(localStorage.getItem('userTerminalData'));

    if (groupCallRooms && storedUserTerminalData && storedUserTerminalData.terminal) {
        const terminalList = storedUserTerminalData.terminal.split(',').map(terminal => terminal.trim());

        const filtered = groupCallRooms.filter((room) => {
            const username = room.hostName?.username;
            let terminal = 'Unknown Terminal';

            if (username && username.startsWith('T')) {
                const terminalNumber = parseInt(username.substring(1), 10);
                if (!isNaN(terminalNumber)) {
                    terminal = `Terminal ${terminalNumber}`;
                }
            }
            console.log('username', username);
            console.log('raw terminal', room.terminal);
            console.log('derived terminal', terminal);
            console.log('storedUserTerminalData', terminalList);
            console.log('Comparison result: ', terminalList.includes(terminal));

            return terminalList.includes(terminal);
        });

        console.log('Filtered Rooms:', filtered);
        setFilteredRooms(filtered);
    } else {
        console.log('No filtering applied. Showing all rooms.');
        setFilteredRooms(groupCallRooms);
    }
}, [groupCallRooms]);

  const backgroundClass = showBackground ? 'with-background' : '';

  return (
    <div className={`scroll_group_list ${backgroundClass}`} style={{ display: 'flex', flexDirection: 'row' }}>
      {stream && filteredRooms.length > 0 && showBackground ? (
        <div style={{ width: '600px', height: '400px', backgroundColor: 'grey' }}>
          <VideoContainer stream={stream} onStatusChange={handleStatusChange} />
        </div>
      ) : (
        <div></div>
      )}
      <div style={{ width: '50%' }}>
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <GroupCallRoomsListItem key={room.roomId} room={room} videoStatus={videoStatus} />
          ))
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

const mapStoreStateToProps = ({ dashboard }) => ({
  ...dashboard,
});

export default connect(mapStoreStateToProps)(GroupCallRoomsList);