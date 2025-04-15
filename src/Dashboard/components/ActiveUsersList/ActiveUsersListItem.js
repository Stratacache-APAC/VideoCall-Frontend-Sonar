import React from 'react';
import userAvatar from '../../../resources/userAvatar.png';
import { callToOtherUser } from '../../../utils/webRTC/webRTCHandler';
import { callStates } from '../../../store/actions/callActions';

const ActiveUsersListItem = (props) => {
  const { activeUser, callState } = props;

  const handleListItemPressed = () => {
    if (callState === callStates.CALL_AVAILABLE) {
      console.log("handleListItemPressed");
      console.log(activeUser);
      callToOtherUser(activeUser);
    }
  };

  return (
    <div className='active_user_list_item' onClick={handleListItemPressed}>
      <div className='active_user_list_image_container'>
        <img className='active_user_list_image' src={userAvatar} />
      </div>
      <span className='active_user_list_text'>{activeUser.username}</span>
      <span className='active_user_list_text'>{activeUser.usertype}</span>
    </div>
  );
};

export default ActiveUsersListItem;
