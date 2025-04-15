import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import LogoImage from '../resources/GMR_delhi_combine_logo.png';
import CallLogIcon from '../resources/call-log-icon.png';
import warning from '../resources/warning.png';
import 'rc-tree/assets/index.css';  // Import the tree component's styles
import './Operator.css';
import QueryTreeModal from './QueryTreeModal';
import flightinformation from '../resources/flight-information.png';
import customercomplaints from '../resources/Customber-Compliants.png';
import checkinassistance from '../resources/check-in-assistance.png';
import baggageservices from '../resources/baggage-services.png';
import location1 from '../resources/location1.png';
import lostandfound from '../resources/lost-and-found.png';
import securityscreening from '../resources/security-screening.png';
import transportservices from '../resources/transport-services.png';
import traveldocumentation from '../resources/travel-documentation.png';
import Accesibilityservices from '../resources/Accesibility-services.png';

const fontStyle = {
  fontFamily: 'Poppins, sans-serif',
};

const fieldLabelStyle = {
  color: '#29417D',
  marginRight: '15px',
  marginLeft:'15px',
  fontWeight: 'bold',
  fontSize: '15px',
  whiteSpace: 'nowrap',
  minWidth: '120px',
};

const inputStyle = {
  width: '100%',
  padding: '11px',
  fontFamily: 'Poppins, sans-serif',
  border: 'none',
  backgroundColor:'#fff',
  fontSize: '13px',
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'left',
  padding: '5px 12px 7px',
};

const buttonStyle = {
  padding: '6px 50px',
  backgroundColor: '#F29E3A',
  color: '#29417D',
  border: 'none',
  borderRadius: '30px',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: '900',
};

const queryTreeData = [
  {
    title: 'Accesibility services',
    key: 'Accesibility-services',
    iconUrl: Accesibilityservices,
    children: [],
  },
  {
    title: 'Customer Complaints',
    key: 'Customber-Compliants',
    iconUrl: customercomplaints,
    children: [],
  },
  {
    title: 'Location',
    key: 'location',
    iconUrl: location1,
    children: [
      { title: 'amenities', key: 'location-amenities-amenities' },
      { title: 'Dining', key: 'location-amenities-Dining' },
      { title: 'Services', key: 'location-amenities-Services' },
      { title: 'shops', key: 'location-amenities-shops' },
    ],
  },
  {
    title: 'Flight Information',
    key: 'flight-information',
    iconUrl: flightinformation,
    children: [
      { title: 'Delays', key: 'flight-information-delays' },
      { title: 'Cancellations', key: 'flight-information-cancellations' },
      { title: 'Schedule changes', key: 'flight-information-schedule-changes' },
    ],
  },
  {
    title: 'Baggage Services',
    key: 'baggage-services',
    iconUrl: baggageservices,
    children: [
      { title: 'Lost', key: 'baggage-services-lost' },
      { title: 'Delayed', key: 'baggage-services-delayed' },
      { title: 'Damaged', key: 'baggage-services-damaged' },
    ],
  },
  {
    title: 'Security Screening',
    key: 'security-screening',
    iconUrl: securityscreening,
    children: [],
  },
  {
    title: 'Check-In Assistance',
    key: 'check-in-assistance',
    iconUrl: checkinassistance,
    children: [
      { title: 'Lost', key: 'baggage-services-lost' },
      { title: 'Delayed', key: 'baggage-services-delayed' },
      { title: 'Damaged', key: 'baggage-services-damaged' },
    ],
  },
  
  // {
  //   title: 'Customer Complaints',
  //   key: 'customer-complaints',
  //   iconUrl: customercomplaints,
  //   children: [],
  // },
  {
    title: 'Lost and Found',
    key: 'lost-and-found',
    iconUrl: lostandfound,
    children: [
      { title: 'Reporting/Surrender Found Item', key: 'lost-and-found-reporting' },
      { title: 'Looking For Lost item', key: 'lost-and-found-inquiring' },
    ],
  },
  {
    title: 'Transport Services',
    key: 'transport-services',
    iconUrl: transportservices,
    children: [
      { title: 'Information on airport shuttles', key: 'transport-services-shuttles' },
      { title: 'Information on taxis', key: 'transport-services-taxis' },
      { title: 'Information on car rentals', key: 'transport-services-car-rentals' },
    ],
  },
  // {
  //   title: 'Accessibility Services',
  //   key: 'accessibility-services',
  //   children: [
  //     { title: 'Assistance for passengers with special needs', key: 'accessibility-services-special-needs' },
  //     { title: 'Assistance for passengers with disabilities', key: 'accessibility-services-disabilities' },
  //   ],
  // },
  {
    title: 'Travel Documentation',
    key: 'travel-documentation',
    iconUrl: traveldocumentation,
    children: [
      { title: 'Help with visas', key: 'travel-documentation-visas' },
      { title: 'Help with passports', key: 'travel-documentation-passports' },
      { title: 'Help with other travel requirements', key: 'travel-documentation-other' },
    ],
  },
];


function Field({ fieldName, fieldValue, onChange, isEditable }) {
  return (
    <div style={{ flex: '1 0 50%', padding: '4px', display: 'flex', alignItems: 'center' }}>
      <label style={fieldLabelStyle}>{fieldName}</label>
      {fieldName === 'Notes' ? (
        <textarea
          value={fieldValue}
          onChange={(e) => onChange(fieldName, e.target.value)}
          style={{ ...inputStyle, height: '150px', resize: 'none' , overflowY:'scroll' }}
          disabled={!isEditable}
        />
      ) : fieldName === 'Customer Rating' ? (
        <select
          value={fieldValue}
          onChange={(e) => onChange(fieldName, e.target.value)}
          style={inputStyle}
          disabled={!isEditable}
        >
          <option value="">Select Rating</option>
          <option value="Satisfied">Satisfied</option>
          <option value="Not Satisfied">Not Satisfied</option>
        </select>
      ) : (
        <input
          type="text"
          value={fieldValue}
          onChange={(e) => onChange(fieldName, e.target.value)}
          style={inputStyle}
          disabled={!isEditable}
        />
      )}
    </div>
  );
}


const CallLog = () => {
  const { sessionId } = useParams();
  const history = useHistory();
  
  const [fieldsData, setFieldsData] = useState({
    'Session': '',
    'First Name': '',
    'Duration': '',
    'Last Name': '',
    'Date': '',
    'Flight No.': '',
    'Time': '',
    'Query': '',
    'Ended': '',
    'Notes': '',
    'Kiosk': '',
    'Customer Rating': '',
    'Agent': '',
  });
  const [selectedQueries, setSelectedQueries] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleInputChange = (fieldName, value) => {
    setFieldsData(prevState => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const onCheckQuery = (key) => {
    setSelectedQueries(prev => {
      const newQueries = prev.includes(key) ? prev.filter(q => q !== key) : [...prev, key];
      setFieldsData(prevState => ({
        ...prevState,
        'Query': newQueries.join(', '),
      }));
      return newQueries;
    });
  };

  const showQueryTreeModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleRemoveQuery = (queryToRemove) => {
    console.log("Before removal:", selectedQueries);
    setSelectedQueries(prevSelectedQueries => {
      const updatedQueries = prevSelectedQueries.filter(query => query !== queryToRemove);
      console.log("After removal:", updatedQueries);
      return updatedQueries;
    });
  };
  


  useEffect(() => {
    const fetchCallData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER}/getCallData?roomId=${sessionId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data

        const formatDateTime = (dateTime) => {
          return dateTime.replace('T', ' | ').split('.')[0];
        };

        setFieldsData(prevState => ({
          ...prevState,
          'Session': data.id || '',
          'Duration': data.callDuration || '',
          'Date': data.callEndTime ? formatDateTime(data.callEndTime).split(' | ')[0] : '',
          'Time': data.callStartTime ? formatDateTime(data.callStartTime).split(' | ')[1] : '',
          'Ended': data.callEndTime ? formatDateTime(data.callEndTime).split(' | ')[1] : '',
          'Agent': data.operatorName || '',
          'Kiosk': data.callOrigin || '',
          
        }));
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    };

    fetchCallData();
  }, [sessionId]);

  const validateFields = () => {
    const mandatoryFields = ['Query'];
    for (const field of mandatoryFields) {
      if (!fieldsData[field]) {
        return `${field} is required`;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    // Update fieldsData['Query'] to reflect the latest selected queries
    fieldsData['Query'] = selectedQueries.length > 0 ? selectedQueries.join(', ') : '';
  
    const validationError = validateFields();
    if (validationError) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: validationError,
      });
      return;
    }
  
    const style = document.createElement('style');
    style.innerHTML = `
      .swal2-actions {
        margin-top: 46px; /* Space between text and buttons */
      }
      .swal2-styled {
        display: inline-block;
        width: 100px;
        border-radius: 17px;
        height: 40px;
        margin-left: 10px; /* Add space between buttons */
      }
    `;
    document.head.appendChild(style);
  
    Swal.fire({
      title: '<div style="display: flex; align-items: flex-start; color: #29417D; margin-bottom: 20px; margin-top: 24px; font-size: 20px;">' +
               '<img src="' + warning + '" alt="Warning" style="width: 68px; height: 51px; margin-right: 10px; margin-top: 18px;" />' +
               '<div style="margin-left: 83px; margin-top: 16px;">' + // Apply margin-left to the text container
                  'Are you sure you want <br> to submit this form?' + // Force the text to break into a new line using <br>
               '</div>' +
             '</div>',
      showCancelButton: true,
      confirmButtonColor: '#07A44B',
      cancelButtonColor: '#939598',
      confirmButtonText: 'Submit',
      reverseButtons: true, // Reverse order of buttons (Cancel on left, Submit on right)
      customClass: {
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER}/updateCallDetails`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomId: sessionId,
              customerRating: fieldsData['Customer Rating'] || null, // Can be null or empty
              firstName: fieldsData['First Name'] || null,           // Can be null or empty
              lastName: fieldsData['Last Name'] || null,             // Can be null or empty
              flightNo: fieldsData['Flight No.'] || null,           // Can be null or empty
              query: fieldsData['Query'],                            // Must be present
              notes: fieldsData['Notes'] || null,                    // Can be null or empty
            }),
          });
  
          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Submitted!',
              text: 'Your call details have been updated.',
            }).then(() => {
              history.push('/dashboard'); // Redirect to dashboard
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Submission Failed',
              text: 'Failed to update call details.',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error with your submission.',
          });
        }
      }
    });
  };
  

  const leftColumnFields = ['Session', 'Duration', 'Date', 'Time', 'Ended', 'Agent', 'Kiosk', 'Customer Rating'];
  const rightColumnFields = ['First Name', 'Last Name', 'Flight No.', 'Query', 'Notes'];
  
  return (
    <div style={{ ...fontStyle, height: '100vh', padding: '10px 10px 0px 10px', overflow: 'auto' }}>
      <div className="top-image-container-dashboard-calllog" >
        {/* <img src={LogoImage} alt="GMR Delhi Logo" className="logo-image" style={{ maxWidth: '100%', maxHeight: '51px', top: '54%' }} /> */}
      </div>
  
      <div style={{
        ...fontStyle,
        width: 'auto',
        height: 'auto',
        backgroundColor: '#E6E7E8',
        margin: '-85px 20px 0px 20px',
        padding: '10px',
        borderRadius: '10px',
      }}>
        <div style={containerStyle}>
          <img src={CallLogIcon} alt="Call Log Icon" style={{ maxWidth: '30px', marginRight: '10px' }} />
          <h2 style={{ color: '#FAA519', fontWeight: 'bold', fontSize: '24px' }}>CALL LOG</h2>
        </div>
  
        <div style={{ display: 'flex', flexWrap: 'wrap',alignItems:'center' , justifyContent:'center'}}>
          <div style={{ flex: '1 0 50%' }}>
            {leftColumnFields.map(field => (
              <Field
                key={field}
                fieldName={field}
                fieldValue={fieldsData[field]}
                onChange={handleInputChange}
                isEditable={field === 'Customer Rating'}  // Keep these fields editable
              />
            ))}
          </div>
  
          <div style={{ flex: '1 0 50%' }}>
              {rightColumnFields.map(field => (
                field === 'Query' ? (
                  <div style={{ flex: '1 0 50%', padding: '4px', display: 'flex', flexDirection: 'row' }}>
                    <label style={fieldLabelStyle}>Query</label>

                    {/* Input-like container to display pills inside */}
                    <div
                      style={{
                        ...inputStyle,
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        padding: '5px',
                        backgroundColor:'#fff',
                        overflowY:'scroll',
                        height:'70px',
                        overflowX: 'auto',
                        cursor: 'pointer',
                      }}
                      onClick={showQueryTreeModal} // Show modal on click
                    >
                      {selectedQueries.map((query, index) => (
                        <div
                          key={index}
                          style={{
                            background: '#E6E7E8',
                            color: '#000',
                            padding: '5px 10px',
                            borderRadius: '20px',
                            display: 'flex',
                            margin:'2px',
                            boxShadow:'0px 0px 3px 0px',
                            alignItems: 'center',
                            marginRight: '5px',
                          }}
                        >
                          {query}
                          <button
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#000',
                              marginLeft: '8px',
                              cursor: 'pointer',
                            }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent modal from opening when removing a query
                              handleRemoveQuery(query);
                            }}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      {/* Invisible input to ensure the text cursor is still visible */}
                      <input
                        style={{ border: 'none', outline: 'none', flex: 1, background: 'transparent' }}
                        type="text"
                        readOnly
                        placeholder={selectedQueries.length === 0 ? 'Select Query' : ''}
                        onClick={showQueryTreeModal} // Trigger modal on click
                      />
                    </div>
                  </div>
                ) : (
                  <Field
                    key={field}
                    fieldName={field}
                    fieldValue={fieldsData[field]}
                    onChange={handleInputChange}
                    isEditable={field !== 'Query'}
                  />
                )
              ))}
            </div>
        <div style={{ textAlign: 'center', paddingBottom: '0px' , marginTop:'5px', marginLeft:'809px' }}>
                  <button onClick={handleSubmit} style={buttonStyle}>
                    SUBMIT
                  </button>
            </div>
        </div>
        <QueryTreeModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        queryTreeData={queryTreeData}
        onCheckQuery={onCheckQuery}
        selectedQueries={selectedQueries}
      />
      </div>
    </div>
  );
  
};

export default CallLog;
