import * as wss from '../wssConnection/wssConnection';
import store from '../../store/store';
import { setGroupCallActive, setCallState, callStates, setGroupCallIncomingStreams, clearGroupCallData, setCallStateStartTime } from '../../store/actions/callActions';
import { pushAuditsData } from '../../utils/Service/Service'
import * as Service from '../../utils/Service/Service';
import { useHistory } from 'react-router-dom'; // Import this to use the history object

let myPeer;
let myPeerId;
let groupCallRoomId;
let groupCallHost = false;

export const connectWithMyPeer = () => {
  console.log("connect with my peer");
  // myPeer = new window.Peer(undefined, {
  //   path: '/peerjs',
  //   host: '/',
  //   port: '5000'
  // });

  // Enable below for production environment - Start

  // var a_random_id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

  // myPeer = new window.Peer(""+a_random_id, {
  //   debug: 3,
  //   path: '/myapp',
  //   host: 'dial-vid.scala.com',
  //   port: '9000'
  // });

  // Enable below for production environment - End

  // Enable below for local environment - Start

  myPeer = new window.Peer(undefined, {

  });

  // Enable below for local environment - Start

  myPeer.on('open', (id) => {
    console.log('succesfully connected with peer server');
    myPeerId = id;
  });

  myPeer.on('call', call => {
    call.answer(store.getState().call.localStream);
    call.on('stream', incomingStream => {
      const streams = store.getState().call.groupCallStreams;
      const stream = streams.find(stream => stream.id === incomingStream.id);

      if (!stream) {
        addVideoStream(incomingStream);
      }
    });
  });

};

export const createNewGroupCall = (operatorName, operatorReason) => {
  console.log('user connected call');
  console.log("new group created from direct login");
  console.log("issue with peer $$$$$$$$");

  console.log(myPeerId);
  groupCallHost = true;

  wss.registerGroupCall({
    username: store.getState().dashboard.username,
    peerId: myPeerId,
  });

  console.log('uuser', myPeerId);
  store.dispatch(setGroupCallActive(true));
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const joinGroupCall = (hostSocketId, roomId, operatorName, operatorReason) => {
  const localStream = store.getState().call.localStream;
  const showCanva = store.getState().btn.showCanva;
  const canvaBg = store.getState().btn.canvaBg;
  console.log('localstream', localStream);
  groupCallRoomId = roomId;

  wss.userWantsToJoinGroupCall({
    peerId: myPeerId,
    hostSocketId,
    roomId,
    localStreamId: localStream.id
  });

  //logic to start the call time
  console.log("joins the calls");
  console.log(store.getState());

  store.dispatch(setGroupCallActive(true));
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
  // object to save perator details in state
  let operatorDetal = {
    start_date: new Date(),
    name: operatorName,
    reason: operatorReason
  }
  console.log('data1', store.dispatch(setCallStateStartTime(operatorDetal)));

  store.dispatch(setCallStateStartTime(operatorDetal));

  console.log('test', store.getState());

  // logic to record the video once accepted
  let videoName = operatorName + '_' + (operatorDetal.start_date).getDate() + '_' + (operatorDetal.start_date).getHours() + '_' + (operatorDetal.start_date).getMinutes() + '_' + (operatorDetal.start_date).getSeconds();
  console.log("video path name $$$$$$$$$$");
  console.log(videoName);

  // logic to remove the notification from all others
  wss.groupCallRemoveNotification({
    roomId: roomId
  });

  wss.startVideoCall({
    peerId: myPeerId,
    hostSocketId,
    roomId,
    localStreamId: localStream.id,
    videoBG: {
      showCanva: showCanva,
      canvaBg: canvaBg
    }
  });

};

export const connectToNewUser = (data) => {
  const localStream = store.getState().call.localStream;

  const call = myPeer.call(data.peerId, localStream);

  call.on('stream', (incomingStream) => {
    const streams = store.getState().call.groupCallStreams;
    const stream = streams.find(stream => stream.id === incomingStream.id);

    if (!stream) {
      addVideoStream(incomingStream);

    }



  });
};

export const auditfunction = (groupCallRoomId) => {
  // add auditing as all the details are present here
  console.log("Audits are called $$$$$$$$$");
  console.log(store.getState().call.callStateStartTime.start_date);
  let startDetails = new Date(store.getState().call.callStateStartTime.start_date);
  let videoName = store.getState().call.callStateStartTime.name + '_' + (startDetails).getDate() + '_' + (startDetails).getHours() + '_' + (startDetails).getMinutes() + '_' + (startDetails).getSeconds();
  //  let videoName1 = 'user';
  let start_date = new Date();

  let name = localStorage.getItem('videoname');
  console.log('name', name)
  // let username = 'user';
  // let videoName1 = username + '_' + (start_date).getDate() + '_' + (start_date).getHours() + '_' + (start_date).getMinutes() + '_' + (start_date).getSeconds();
  // let videoName1 = username + '_' + (start_date).getDate() + '_' + (start_date).getHours() + '_' + (start_date).getMinutes();
  let videoName1 = name;
  console.log('videoname1', videoName);
  ;
  console.log(new Date(store.getState().call.callStateStartTime.start_date));
  console.log(store.getState());
  const auditObj = {
    callStartTime: store.getState().call.callStateStartTime.start_date,
    operatorName: store.getState().dashboard.username.username,
    callEndTime: new Date(),
    reason: store.getState().call.callStateStartTime.reason,
    callOrigin: store.getState().call.callStateStartTime.name,
    recording: videoName,
    recording1: videoName1,
    roomId: groupCallRoomId
  };
  console.log(auditObj);
  Service.pushAuditsData(auditObj);
  // remove the call details
  store.dispatch(setCallStateStartTime(null));
}

export const MachineleaveGroupCall = () => {
  // emit event
  alert('group1')
  console.log("call event web rtc");
  wss.machineLeftGroupCall({
    streamId: store.getState().call.localStream.id,
    peerId: myPeerId,
    machineSocket: store.getState().dashboard.activeUsers[0].socketId,
  });
}

// export const leaveGroupCallEnd = () => {
//   console.log("webRTCCALL HAndler $$$$$$$$$$$$$$$$$$");
//   auditfunction(groupCallRoomId);
//   clearGroupData();
// }

//changing this logic to all time host
export const leaveGroupCall = (history) => {
  // who ever leave the call audit shoud be triggered
  auditfunction(groupCallRoomId);
  // logic to stop recording
  setTimeout(() => {
    if (groupCallHost) {
      console.log("groupCallHost");
      wss.groupCallClosedByHost({
        peerId: myPeerId
      });
    } else {
      console.log("groupCallHost USER");
      console.log(myPeerId);
      console.log(store.getState().call.localStream.id);
      console.log(groupCallRoomId);
      wss.userLeftGroupCall({
        streamId: store.getState().call.localStream.id,
        roomId: groupCallRoomId,
        peerId: myPeerId
      });
    }
    // write logic to re-route
    console.log("logic wrtc $$$$$$$$$$ send details");
    console.log(groupCallRoomId);
    console.log(store.getState().call.localStream.id);
    console.log(store.getState().dashboard);
    // console.log(store.getState().dashboard.groupCallRooms[0].socketId);
    // wss.machineReRoute({
    //   roomId: groupCallRoomId,
    //   operatorId: store.getState().call.localStream.id,
    //   machineId: store.getState().dashboard.groupCallRooms[0].socketId,
    //   machineName: store.getState().dashboard.groupCallRooms[0].hostName.username,
    //   reason: store.getState().dashboard.groupCallRooms[0].hostName.userreason,
    // });
    const sessionId = groupCallRoomId; // or any other ID you want to use
    history.push(`/calllog/${sessionId}`);
    clearGroupData();
  }, 3000);

};

export const clearGroupData = () => {
  console.log("clearGroupData");
  groupCallRoomId = null;
  groupCallHost = null;
  store.dispatch(clearGroupCallData());
  myPeer.destroy();
  connectWithMyPeer();

  const localStream = store.getState().call.localStream;
  localStream.getVideoTracks()[0].enabled = true;
  localStream.getAudioTracks()[0].enabled = true;
};



export const removeInactiveStream = (data) => {
  console.log('removeInactiveStream user left');
  console.log(data);
  const groupCallStreams = store.getState().call.groupCallStreams.filter(
    stream => stream.id !== data.streamId
  );
  store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
};

const addVideoStream = (incomingStream) => {
  const groupCallStreams = [
    ...store.getState().call.groupCallStreams,
    incomingStream
  ];

  store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
};

// if group call is active return roomId if not return false
export const checkActiveGroupCall = () => {
  console.log("check active group call");
  // if(store.getState().call.groupCallStreams.length == 0 || store.getState().call.groupCallStreams.length == 1){
  //   store.dispatch(setCallState(callStates.CALL_DISCONNECT));

  // }
  console.log(store.getState().call);
  if (store.getState().call.groupCallActive) {
    // store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
    console.log('fffffffffffffffffff', groupCallRoomId);
    return groupCallRoomId;
  } else {
    return false;
  }
};