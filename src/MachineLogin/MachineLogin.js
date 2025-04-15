import React, { useEffect } from 'react';
// import logo from '../resources/logo.png';
import * as webRTCHandler from '../utils/webRTC/webRTCHandler';
import * as webRTCGroupHandler from '../utils/webRTC/webRTCGroupCallHandler';
import DirectCall from './components/DirectCall/DirectCall';
import { connect } from 'react-redux';
import DashboardInformation from './components/DashboardInformation/DashboardInformation';
import { callStates } from '../store/actions/callActions';
import GroupCallRoomsList from './components/GroupCallRoomsList/GroupCallRoomsList';
import GroupCall from './components/GroupCall/GroupCall';

import './MachineLogin.css';

const MachineLogin = ({ username, callState }) => {
  useEffect(() => {
    webRTCHandler.getLocalStream();
    webRTCGroupHandler.connectWithMyPeer();
  }, []);

  return (
    <div className='dashboard_container background_main_color'>
      <div className='dashboard_left_section'>
        <div className='dashboard_content_container'>
          <DirectCall />
          <GroupCall />
          {callState !== callStates.CALL_IN_PROGRESS && <DashboardInformation username={username} />}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ call, machineLogin }) => ({
  ...call,
  ...machineLogin
});

export default connect(mapStateToProps)(MachineLogin);

