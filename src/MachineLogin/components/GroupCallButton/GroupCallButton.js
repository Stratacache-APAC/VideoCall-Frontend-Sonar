import React from 'react';
import callEndImage from '../../../resources/CallEnd.png'; // Adjust the path if needed
import './GroupCallButton.css';

const GroupCallButton = ({ onClickHandler, label }) => {
  return (
    <div onClick={onClickHandler} className='group_call_button'   style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img src={callEndImage} alt='End Call' className='call_image' />
      <div className='call_text'>{label}</div>
    </div>
  );
};

export default GroupCallButton;
