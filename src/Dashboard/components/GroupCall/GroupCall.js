import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import GroupCallButton from '../GroupCallButton/GroupCallButton';
import { callStates, setLocalCameraEnabled, setLocalMicrophoneEnabled } from '../../../store/actions/callActions';
import * as webRTCGroupCallHandler from '../../../utils/webRTC/webRTCGroupCallHandler';
import GroupCallRoom from '../GroupCallRoom/GroupCallRoom';
import { useHistory } from 'react-router-dom';
// import { userreasonmc } from '../../../store/actions/dashboardActions';
// import * as Service from '../../../utils/Service/Service';


const GroupCall = (props, { username }) => {
    const { callState, localStream, groupCallActive, groupCallStreams } = props;
    const history = useHistory();

    // const Client_SERVER = 'https://web-rtc-frontend-test.herokuapp.com';
    const Client_SERVER = process.env.REACT_APP_CLIENT;
    
    useEffect(() => {
        console.log("group call initia ####3 $$$$$");
        console.log(props);
    }, []);


    const createRoom = () => {
        webRTCGroupCallHandler.createNewGroupCall();
    };

    const leaveRoom = () => {
        webRTCGroupCallHandler.leaveGroupCall(history);
    };

    // const leaveRoomMachine = () => {
    //     // call a event machine disconnecting
    //     console.log('clicked disconnect');
    //     webRTCGroupCallHandler.MachineleaveGroupCall();
    //     //    common.removeUserSession();
    //     // let userReason ;
    //     //     for(const key in userreasonmc){
    //     //       if(props.username.userreason == userreasonmc[key]){
    //     //         userReason = key;
    //     //       }
    //     //     }
    //     //     let path = Client_SERVER+'/main/'+props.username.username+'/'+userReason;
    //     //     console.log(path);
    //     //     window.location.href = path;
    //   }

    return ( <>
        {
            /* {!groupCallActive && localStream && callState !== callStates.CALL_IN_PROGRESS &&
                    <GroupCallButton onClickHandler={createRoom} label='Create room' />} */
        } {
            groupCallActive && < GroupCallRoom {...props }
            />} { props.username.usertype === "OPERATOR" && groupCallActive && < GroupCallButton onClickHandler = { leaveRoom }
            label = 'End Call' / >
        }
        </>
    );
};

const mapStoreStateToProps = ({ call }) => ({
    ...call
});

const mapActionsToProps = (dispatch) => {
    return {
        setCameraEnabled: enabled => dispatch(setLocalCameraEnabled(enabled)),
        setMicrophoneEnabled: enabled => dispatch(setLocalMicrophoneEnabled(enabled))
    };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(GroupCall);