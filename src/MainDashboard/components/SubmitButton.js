import React from 'react';

const SubmitButton = ({ handleSubmitButtonPressed }) => {
  return (
    <div className='login-page_button_container'>
      <button
        className='login-page_button bg_color_theme text_main_color'
        onClick={handleSubmitButtonPressed}
      >
        Click Here to Talk to Operator
      </button>
    </div>

  );
};

export default SubmitButton;
