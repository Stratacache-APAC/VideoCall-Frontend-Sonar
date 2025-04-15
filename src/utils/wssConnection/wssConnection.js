import socketClient from 'socket.io-client';
import store from '../../store/store';
import * as dashboardActions from '../../store/actions/dashboardActions';
import * as webRTCHandler from '../webRTC/webRTCHandler';
import * as webRTCGroupCallHandler from '../webRTC/webRTCGroupCallHandler';
import * as common from '../../utils/Service/Common';
import * as Service from '../../utils/Service/Service';
import { userreasonmc } from '../../store/actions/dashboardActions';
import { handleEndCallGlobal } from '../../Dashboard/components/GroupCallButton/GroupCallButton';
import { setShowCanva, setCanvaBg } from '../../store/actions/btnActions';
import { routeToDashboard } from '../videoRecording/recordingUtils';

// import { setPrefix } from "react-id-generator";
// import nextId from "react-id-generator";
// const SERVER = 'https://web-rtc-backend-test.herokuapp.com';
const SERVER = process.env.REACT_APP_SERVER;
// const Client_SERVER = 'https://web-rtc-frontend-test.herokuapp.com';
const Client_SERVER = process.env.REACT_APP_CLIENT;
let counter = 1;
const broadcastEventTypes = {
    ACTIVE_USERS: 'ACTIVE_USERS',
    GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS',
    Remove_CALL_ANS: 'Remove_CALL_ANS',
    Re_Route_Machine: 'Re_Route_Machine'
};

let socket;



export const connectWithWebSocket = () => {
    socket = socketClient(SERVER);

    socket.on('connection', () => {
        // common.removeUserSession();
        console.log('succesfully connected with wss server');
        console.log(socket.id);
    });

    socket.on('broadcast', (data) => {
        handleBroadcastEvents(data);
    });

    // listeners related with direct call
    socket.on('pre-offer', (data) => {
        webRTCHandler.handlePreOffer(data);
    });

    socket.on('pre-offer-answer', (data) => {
        webRTCHandler.handlePreOfferAnswer(data);
    });

    socket.on('webRTC-offer', (data) => {
        webRTCHandler.handleOffer(data);
    });

    socket.on('webRTC-answer', (data) => {
        webRTCHandler.handleAnswer(data);
    });

    socket.on('webRTC-candidate', (data) => {
        webRTCHandler.handleCandidate(data);
    });

    socket.on('user-hanged-up', () => {
        webRTCHandler.handleUserHangedUp();
    });

    socket.on('user-clean-up', (data) => {
        const id = socket.id;
        console.log('current socket id', id);
        console.log('usercleanup', data);

        if (data.id == undefined || data.id == id || data.type == "OPERATOR") {
            // alert('main')
            // stopRecording1();         
        }
        else if (data.id != id) {
            // stopRecording1();         


        }
    });

    // listeners related with group calls

    socket.on('group-call-join-request', (data) => {
        webRTCGroupCallHandler.connectToNewUser(data);
    });

    socket.on('start-video', (data) => {
        console.log('start video', data);
        console.log('user side socked id', socket.id);
        const id = socket.id;
        let type = localStorage.getItem('usertype');
        if (type === 'MACHINE') {
            store.dispatch(setCanvaBg(data.data.videoBG.canvaBg));
            store.dispatch(setShowCanva(data.data.videoBG.showCanva));
        }
        console.log('iiiddd', id);
        // let kioskid = localStorage.getItem('KioskID');
        // console.log('kioskID',kioskid);
        const userData = {
            // kiosk: kioskid,
            socketid: id,
            // status: 'true',
            usertype: type
        }
        console.log('saveuser', userData);
        Service.fetchPostData('saveuserdata', userData).then(res => {
            console.log('res', res);
        });
        let a = counter += 1;
        let start_date = new Date();
        let kioskSessionId = localStorage.getItem('kioskSessionId');
        // let videoName = username + '_' + (start_date).getDate() + '_' + (start_date).getHours() + '_' + (start_date).getMinutes() + '_' + (start_date).getSeconds();
        let videoName = 'user_' + kioskSessionId
        console.log('videoname', videoName);
        // localStorage.setItem('name',videoName);
        localStorage.setItem('videoname', videoName);

    });

    socket.on('group-call-user-left', (data) => {
        console.log('back from server user left');
        console.log(data);
        webRTCGroupCallHandler.removeInactiveStream(data);

        // the below function is clear the user on leave group

        var client = data.peer.find(peer => peer.roomId === data.roomId && peer.usertype === "MACHINE");
        if (client != undefined && socket.id === client.socketId) {
            let path = '/thankyou';
            window.location.href = path;
        }
        setTimeout(() => {
            if (client != undefined && socket.id === client.socketId) {
                webRTCGroupCallHandler.clearGroupData();
            }
        }, 1000);
    });

    socket.on('machine-call-user-left', (data) => {
        let activeUser = store.getState().call.groupCallStreams;
        for (let key in activeUser) {
            if (activeUser[key].id == data.streamId) {
                webRTCGroupCallHandler.leaveGroupCall();
            }
        }
    });


    socket.on('machine-call-user-end', async (data) => {
        console.log('data', data);
        let startTime = store.getState().call.callStateStartTime === undefined ? false : true;
        console.log('ssss', startTime);
        var operatorId;
        var peers = data.peerId;
        console.log('peers', peers);

        for (var key in peers) {
            if (peers[key].roomId === data.roomId && peers[key].usertype === "OPERATOR" && startTime) {
                operatorId = peers[key].socketId;
                console.log('key', peers[key].roomId);
                console.log('room', data.roomId);
            }
        }
        console.log('op', operatorId);
        console.log('soc', socket);
        console.log('soc', socket.id);
        const userName = common.getUser();

        //Browser Refresh releated - start
        const operator = peers.find(peer => peer.socketId === data.machineSocket && peer.usertype === "OPERATOR");
        var client = operator != undefined ? peers.find(peer => peer.roomId === operator.roomId && peer.usertype === "MACHINE") : {};
        if (client != undefined && socket.id === client.socketId) {
            let path = '/thankyou';
            window.location.href = path;
        }
        //Browser Refresh releated - end

        // if (userName === "") {
        //     let path = '/thankyou';
        //     window.location.href = path;
        // }
        // if(data.roomId === undefined){
        //     let path = '/thankyou';
        //         window.location.href = path;
        // }

        if (operatorId === socket.id) {
            console.log('Calling GroupCallButton handleEndCall function');
            if (handleEndCallGlobal) {
                handleEndCallGlobal(); // Call the handleEndCall before leaveGroupCallEnd
            }
            //   console.log('Checking group call button', GroupCallButton);
            //   webRTCGroupCallHandler.leaveGroupCallEnd(); // Now call the leaveGroupCallEnd
        }
    });

    socket.on('error', (error) => {
        console.error('WebSocket Error:', error.message);  // Adjust this as needed
    });

    socket.on('connect_error', () => {
        console.warn('Connection Error');
    });

};

export const registerNewUser = (username, usertype, kioskSessionId) => {
    return new Promise((resolve, reject) => {
        if (socket && socket.connected) {
            // Emit the event immediately if the socket is connected
            socket.emit('register-new-user', {
                username: username,
                usertype: usertype,
                kioskSessionId: kioskSessionId,
                socketId: socket.id
            });
            console.log("Emitted register-new-user with socket ID:", socket.id);
            resolve(socket.id);
        } else {
            // Listen for connect and then emit once connected
            socket.on('connect', () => {
                socket.emit('register-new-user', {
                    username: username,
                    usertype: usertype,
                    kioskSessionId: kioskSessionId,
                    socketId: socket.id
                });
                console.log("Emitted register-new-user after reconnect with socket ID:", socket.id);
                resolve(socket.id);
            });
        }
    });
};



// emitting events to server related with direct call

export const sendPreOffer = (data) => {
    socket.emit('pre-offer', data);
};

export const sendPreOfferAnswer = (data) => {
    socket.emit('pre-offer-answer', data);
};

export const sendWebRTCOffer = (data) => {
    socket.emit('webRTC-offer', data);
};

export const sendWebRTCAnswer = (data) => {
    socket.emit('webRTC-answer', data);
};

export const sendWebRTCCandidate = (data) => {
    socket.emit('webRTC-candidate', data);
};

export const sendUserHangedUp = (data) => {
    socket.emit('user-hanged-up', data);
};

// emitting events related with group calls

export const registerGroupCall = (data) => {
    console.log('register', data);
    socket.emit('group-call-register', data);
};

export const userWantsToJoinGroupCall = (data) => {
    console.log('want to join');
    socket.emit('group-call-join-request', data);

};

export const startVideoCall = (data) => {
    console.log('user calls', data);
    socket.emit('start-video', data);

};

export const userLeftGroupCall = (data) => {
    console.log("user to server emit");
    console.log(data);
    socket.emit('group-call-user-left', data);
};

export const machineLeftGroupCall = (data) => {
    console.log(" ^^^^^ machine to server emit &&&&&&");
    console.log(data);
    socket.emit('machine-call-user-left', data);
};

export const machineReRoute = (data) => {
    console.log("wss re-route");
    console.log(data);
    socket.emit('machine-re-route', data);
};

export const groupCallClosedByHost = (data) => {
    console.log("host to server emit");
    console.log(data);
    socket.emit('group-call-closed-by-host', data);
};

export const groupCallRemoveNotification = (data) => {
    console.log("wss function to remove notification host to server emit");
    console.log(data);
    socket.emit('group-call-remove-notification', data);
};

const handleBroadcastEvents = (data) => {
    switch (data.event) {
        case broadcastEventTypes.ACTIVE_USERS:
            const activeUsers = data.activeUsers.filter(activeUser => activeUser.socketId !== socket.id);
            store.dispatch(dashboardActions.setActiveUsers(activeUsers));
            break;
        case broadcastEventTypes.GROUP_CALL_ROOMS:
            const groupCallRooms = data.groupCallRooms.filter(room => room.socketId !== socket.id);
            const activeGroupCallRoomId = webRTCGroupCallHandler.checkActiveGroupCall();
            if (activeGroupCallRoomId) {
                const room = groupCallRooms.find(room => room.roomId === activeGroupCallRoomId);
                if (!room) {
                    setTimeout(() => {
                        webRTCGroupCallHandler.clearGroupData();
                    }, 3000);
                }
            }
            store.dispatch(dashboardActions.setGroupCalls(groupCallRooms));
            break;
        case broadcastEventTypes.Remove_CALL_ANS:
            store.dispatch(dashboardActions.setGroupCalls(data.groupCallRooms));
            break;
        case broadcastEventTypes.Re_Route_Machine:
            if (socket.id === data.data.machineId) {
                console.log("main logic to re-route equals ===========>");
                common.removeUserSession();
                let userReason;
                for (const key in userreasonmc) {
                    if (data.data.reason == userreasonmc[key]) {
                        userReason = key;
                    }
                }
                // let path = Client_SERVER + '/main/' + data.data.machineName + '/' + userReason;
                // window.location.href = path;
                // stopRecording1();
                let path = '/thankyou';
                window.location.href = path;
            }
            break;
        default:
            break;
    }
};

