import React from 'react';
import ActiveUsersListItem from './ActiveUsersListItem';
import { connect } from 'react-redux';
import { callStates } from '../../../store/actions/callActions';
import { notifyOperators } from '../../../utils/webRTC/webRTCHandler';



import './ActiveUsersList.css';

const ActiveUsersList = ({ activeUsers, callState }) => {

  const handleListPressed = () => {
    if (callState === callStates.CALL_AVAILABLE) {
      console.log("handleListItemPressed active users");
      console.log(activeUsers);
      notifyOperators(activeUsers);
    }
  };

  return (
    <div className='active_user_list_container' onClick={handleListPressed}>
      {activeUsers.map((activeUser) =>
        <ActiveUsersListItem
          key={activeUser.socketId}
          activeUser={activeUser}
          callState={callState}
        />)}
    </div>
  );
};

const mapStateToProps = ({ dashboard, call }) => ({
  ...dashboard,
  ...call
});

export default connect(mapStateToProps)(ActiveUsersList);
