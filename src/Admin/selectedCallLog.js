import React, { useEffect, useState,useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FaEdit, FaSave ,FaTimes} from 'react-icons/fa';
// import LogoImage from '../resources/GMR_delhi_combine_logo.png';
import BackButtonImage from '../resources/back_button_image.png';
import 'rc-tree/assets/index.css';
import './Operator.css';
import NavbarLocal from '../Navbar/Navbar';
import Select from 'react-select'; // For the multi-select dropdown
import Swal from 'sweetalert2'; // Import SweetAlert2

const fontStyle = {
  fontFamily: 'Poppins, sans-serif',
  fontSize: '21px',
  fontWeight: '900',
};

const fieldLabelStyle = {
  color: '#29417D',
  marginRight: '15px',
  fontWeight: 'bold',
  fontSize: '14px',
  whiteSpace: 'nowrap',
  minWidth: '150px',
};

const inputStyle = {
  width: '100%',
  padding: '4px',
  fontFamily: 'Poppins, sans-serif',
  border: 'none',
  fontSize: '14px',
  backgroundColor: '#F7F7F7',
};

const inputStyleQery = {
  width: '100%',
  padding: '4px',
  fontFamily: 'Poppins, sans-serif',
  border: 'none',
  overflowY: 'scroll',
  height: '76px',
  fontSize: '14px',
  backgroundColor: '#F7F7F7',
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'left',
  padding: '4px 25px 10px',
};

const titleStyle = {
  fontWeight: '800',
  textTransform: 'uppercase',
  color: '#29417D',
  margin: '0px 0px 0px 0px',
  textDecoration: 'underline',
  textDecorationColor: '#29417D',
  textDecorationThickness: '2px',
};

const idStyle = {
  fontWeight: '800',
  color: 'orange',
  textDecoration: 'underline',
  textDecorationColor: '#FAA519',
  textDecorationThickness: '2px',
};

const pillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: '#e0e0e0',
  padding: '5px 10px',
  borderRadius: '20px',
  margin: '5px',
  fontSize: '14px',
  fontWeight: '500',
};

function Field({ fieldName, fieldValue, onFieldChange, isEditing, toggleEdit, saveChanges }) {
  const isEditable = ['First Name', 'Last Name', 'Query', 'Notes', 'Flight No.'].includes(fieldName);

  
  const handleEditClick = () => {
    if (isEditable) {
        toggleEdit(fieldName);
    }
};

const handleSaveClick = () => {
  if (isEditing === fieldName) {
      let errorMessage = null;

      switch (fieldName) {
          case 'First Name':
            break;
          case 'Last Name':
            break;
          case 'Query':
              if (!fieldValue || fieldValue.trim() === '') {
                  errorMessage = 'Query is mandatory!';
              }
              break;
          case 'Flight No.':
              break;
          case 'Notes': // Notes can be empty, so no validation needed here.
              break;
          default:
              break;
      }

      if (errorMessage) {
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errorMessage,
          });
          return; // Stop saving if validation fails
      }

      saveChanges(fieldName);
  }
};

const handleQueryChange = (selectedOptions) => {
  onFieldChange(fieldName, selectedOptions.map(option => option.value).join(','));
};

const handleQueryRemove = (itemToRemove) => {
  if (isEditing === 'Query') { // Only allow removal in edit mode
      const updatedQuery = fieldValue.split(',').filter(item => item.trim() !== itemToRemove).join(',');
      onFieldChange('Query', updatedQuery);
  }
};

const queryOptions = [
  { value: 'Accesibility-services', label: 'Accesibility services' },
  { value: 'Customber-Compliants', label: 'Customer Complaints' },
  { value: 'location', label: 'Location' },
  { value: 'location-amenities-amenities', label: 'amenities' },
  { value: 'location-amenities-Dining', label: 'Dining' },
  { value: 'location-amenities-Services', label: 'Services' },
  { value: 'location-amenities-shops', label: 'shops' },
  { value: 'flight-information', label: 'Flight Information' },
  { value: 'flight-information-delays', label: 'Delays' },
  { value: 'flight-information-cancellations', label: 'Cancellations' },
  { value: 'flight-information-schedule-changes', label: 'Schedule changes' },
  { value: 'baggage-services', label: 'Baggage Services' },
  { value: 'baggage-services-lost', label: 'Lost' },
  { value: 'baggage-services-delayed', label: 'Delayed' },
  { value: 'baggage-services-damaged', label: 'Damaged' },
  { value: 'security-screening', label: 'Security Screening' },
  { value: 'check-in-assistance', label: 'Check-In Assistance' },
  { value: 'baggage-services-lost', label: 'Lost' },
  { value: 'baggage-services-delayed', label: 'Delayed' },
  { value: 'baggage-services-damaged', label: 'Damaged' },
  { value: 'lost-and-found', label: 'Lost and Found' },
  { value: 'lost-and-found-reporting', label: 'Reporting/Surrender Found Item' },
  { value: 'lost-and-found-inquiring', label: 'Looking For Lost item' },
  { value: 'transport-services', label: 'Transport Services' },
  { value: 'transport-services-shuttles', label: 'Information on airport shuttles' },
  { value: 'transport-services-taxis', label: 'Information on taxis' },
  { value: 'transport-services-car-rentals', label: 'Information on car rentals' },
  { value: 'travel-documentation', label: 'Travel Documentation' },
  { value: 'travel-documentation-visas', label: 'Help with visas' },
  { value: 'travel-documentation-passports', label: 'Help with passports' },
  { value: 'travel-documentation-other', label: 'Help with other travel requirements' }
]
;

  return (
    <div style={{ flex: '1 0 35%', padding: '5px', display: 'flex', alignItems: 'center' }}>
        <label style={fieldLabelStyle}>{fieldName}</label>
        {fieldName === 'Notes' ? (
            // ... (Notes field rendering - unchanged)
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <textarea
                value={isEditing === fieldName ? fieldValue : fieldValue}
                onChange={(e) => onFieldChange(fieldName, e.target.value)}
                style={{ ...inputStyle, height: '100px', resize: 'none', overflowY: 'scroll' }}
                readOnly={isEditing !== fieldName}
              />
              {isEditing === fieldName ? (
                <FaSave style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={handleSaveClick} />
              ) : (
                <FaEdit style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={handleEditClick} />
              )}
            </div>
        ) : fieldName === 'Query' ? (
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {isEditing === fieldName ? (
                  <Select
                      isMulti
                      options={queryOptions}
                      value={fieldValue ? fieldValue.split(',').map(item => ({ value: item.trim(), label: item.trim() })) : []}
                      onChange={handleQueryChange}
                      closeMenuOnSelect={false} // Key change: Prevent menu close
                      blurInputOnSelect={false} // Prevent blur on select
                      styles={{
                          // ... your styles
                          control: (styles, { isFocused }) => ({
                              ...styles,
                              // ... other styles
                              // Add these to keep the menu open
                              // minHeight: '38px', // Or whatever your preferred height is
                              // border: isFocused ? '1px solid #29417D' : '1px solid #ced4da', // Example
                              boxShadow: isFocused ? '0 0 0 0.2rem rgba(41, 65, 125, 0.25)' : 'none', // Example
                          }),
                          menu: (styles) => ({
                            ...styles,
                            minWidth: '300px', // Set the minimum width for the dropdown menu
                        }),
                        option: (styles) => ({
                          ...styles,
                          minWidth:'300px',
                        }),
                      }}
                  />
              )  : (
                  <div style={inputStyleQery}>
                      {fieldValue && fieldValue.split(',').map((item, index) => (
                          <span key={index} style={pillStyle}>
                              {item.trim()}
                              {/* Conditionally render FaTimes */}
                              {isEditing === fieldName && (
                                  <FaTimes
                                      style={{ marginLeft: '5px', cursor: 'pointer' }}
                                      onClick={() => handleQueryRemove(item.trim())}
                                  />
                              )}
                          </span>
                      ))}
                  </div>
              )}
                {isEditing === fieldName ? (
                    <FaSave style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={handleSaveClick} />
                ) : (
                    <FaEdit style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={handleEditClick} />
                )}
            </div>
        ) : (
            // ... (other fields rendering - unchanged)
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <input
                type="text"
                value={isEditing === fieldName ? fieldValue : fieldValue}
                onChange={(e) => onFieldChange(fieldName, e.target.value)}
                style={inputStyle}
                readOnly={isEditing !== fieldName}
              />
              {isEditable &&
                (isEditing === fieldName ? (
                  <FaSave style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={handleSaveClick} />
                ) : (
                  <FaEdit style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={handleEditClick} />
                ))}
            </div>
        )}
    </div>
);
}

const CallLog = () => {
  const { sessionId } = useParams();
  const history = useHistory();
  const [fieldsData, setFieldsData] = useState({
    Session: '',
    'First Name': '',
    Duration: '',
    'Last Name': '',
    Date: '',
    'Flight No.': '',
    Time: '',
    Query: '',
    Ended: '',
    Notes: '',
    Kiosk: '',
    'Customer Rating': '',
    Agent: '',
  });

  const [callId, setCallId] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [editedFields, setEditedFields] = useState({});
  const hasChanges = useRef(false);
  const [initialFieldsData, setInitialFieldsData] = useState({}); // Store initial data

  useEffect(() => {
    const fetchCallData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER}/getSelectedCallData?roomId=${sessionId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        const formatDateTime = (dateTime) => {
          return dateTime.replace('T', ' | ').split('.')[0];
        };

        setFieldsData(prevState => ({
          ...prevState,
          'Session': data.sessionId || '',
          'Duration': data.callDuration || '',
          'Date': data.callEndTime ? formatDateTime(data.callEndTime).split(' | ')[0] : '',
          'Time': data.callStartTime ? formatDateTime(data.callStartTime).split(' | ')[1] : '',
          'Ended': data.callEndTime ? formatDateTime(data.callEndTime).split(' | ')[1] : '',
          'Agent': data.operatorName || '',
          'Kiosk': data.callOrigin || '',
        }));

        setCallId(data.sessionId || '');
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    };

    fetchCallData();
  }, [sessionId]);


  useEffect(() => {
    const fetchCallDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER}/getCallDetailsByRoomId?roomId=${sessionId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched details data:', data);

        setFieldsData(prevState => ({
          ...prevState,
          'First Name': data.firstName || '',
          'Last Name': data.lastName || '',
          'Flight No.': data.flightNo || '',
          'Query': data.query || '',
          'Notes': data.notes || '',
          'Customer Rating': data.customerRating || '',
      }));

      // Set initial data *after* fetching:
      setInitialFieldsData({
          'First Name': data.firstName || '',
          'Last Name': data.lastName || '',
          'Flight No.': data.flightNo || '',
          'Query': data.query || '',
          'Notes': data.notes || '',
          'Customer Rating': data.customerRating || '',
      });
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    };

    fetchCallDetails();
  }, [sessionId]);


  const handleFieldChange = (fieldName, newValue) => {
    setFieldsData(prevFields => ({ ...prevFields, [fieldName]: newValue }));
    setEditedFields(prevEdited => ({ ...prevEdited, [fieldName]: newValue }));

    // Check for actual changes relative to initial data.  Use a *copy* of editedFields
    // to avoid issues if the user is in the middle of editing a field.
    const currentEditedFields = {...editedFields, [fieldName]: newValue};  // Include the current change
    hasChanges.current = Object.keys(currentEditedFields).some(key => {
        const initialValue = initialFieldsData[key];
        const currentValue = currentEditedFields[key];

        if (key === 'Query') {
            const initialArray = initialValue ? initialValue.split(',').map(item => item.trim()).sort() : [];
            const currentArray = currentValue ? currentValue.split(',').map(item => item.trim()).sort() : [];
            return JSON.stringify(initialArray) !== JSON.stringify(currentArray);
        } else if (Array.isArray(initialValue) && Array.isArray(currentValue)) {
            return JSON.stringify(initialValue.sort()) !== JSON.stringify(currentValue.sort());
        } else {
            return initialValue !== currentValue;
        }
    });
};

  const toggleEdit = (fieldName) => {
    setIsEditing(isEditing === fieldName ? null : fieldName);
  };

  const saveChanges = async (fieldName) => {
    setIsEditing(null);
    if (!hasChanges.current) { // Access the ref's value correctly
      Swal.fire({
          icon: 'info',
          title: 'No Changes',
          text: 'Nothing to submit!',
      });
      return;
  }
    try {
      const updatedData = {
          roomId: sessionId,
          firstName: editedFields['First Name'] !== undefined ? editedFields['First Name'] : fieldsData['First Name'],
          lastName: editedFields['Last Name'] !== undefined ? editedFields['Last Name'] : fieldsData['Last Name'],
          flightNo: editedFields['Flight No.'] !== undefined ? editedFields['Flight No.'] : fieldsData['Flight No.'],
          query: editedFields.Query !== undefined ? editedFields.Query : fieldsData.Query,
          notes: editedFields.Notes !== undefined ? editedFields.Notes : fieldsData.Notes,
          customerRating: editedFields['Customer Rating'] !== undefined ? editedFields['Customer Rating'] : fieldsData['Customer Rating'],
      };

        // Query Validation before sending to server (if not already validated in Field)
        if (fieldName === 'Query' && (!updatedData.query || updatedData.query.trim() === '')) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Query is mandatory!',
            });
            return;
        }


        const response = await fetch(`${process.env.REACT_APP_SERVER}/updateCallDetails`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            // Handle server-side validation errors if any
            const errorData = await response.json(); // Try to parse error response
            const errorMessage = errorData.message || 'Network response was not ok'; // Use message or default
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
            throw new Error('Network response was not ok');
        }

        console.log('Call details updated successfully');
        setEditedFields({});
        hasChanges.current = false;
        setInitialFieldsData(fieldsData);
        Swal.fire({  // Success message
            icon: 'success',
            title: 'Success',
            text: 'Call details updated successfully!',
        });

    } catch (error) {
        console.error('Error updating call details:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while updating.', // Or a more specific message
        });
    }
};



  return (
    <div className="row">
      <div className="col-md-2">
        <NavbarLocal />
      </div>
      <div className="col-md-10">
        <div style={{ ...containerStyle, display: 'flex', flexWrap: 'wrap' }}>
          <div className="top-image-container" style={{ top: '-28px', left: '-50px', height: '130px' }}></div>
          <div style={{ position: 'relative', top: '-20px' }}>
            <div className="calllog-container" style={{ flex: '1 0 100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative', top: '-20px' }}>
                <img
                  src={BackButtonImage}
                  alt="Back"
                  style={{ cursor: 'pointer', marginRight: '10px', height: '33px' }}
                  onClick={() => history.push('/Auditlist')}
                />
                <h2 style={{ ...fontStyle, textAlign: 'center', ...titleStyle }}>
                  CALL LOG &gt;
                </h2>
                {callId && (
                  <span style={{ ...fontStyle, ...idStyle, marginLeft: '10px' }}>
                    {callId}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {Object.keys(fieldsData).map((key) => (
                  <Field
                    key={key}
                    fieldName={key}
                    fieldValue={fieldsData[key]}
                    onFieldChange={handleFieldChange}
                    isEditing={isEditing}
                    toggleEdit={toggleEdit}
                    saveChanges={saveChanges}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallLog;