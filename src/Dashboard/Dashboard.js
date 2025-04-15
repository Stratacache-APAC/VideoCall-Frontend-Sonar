// import React, { useEffect } from 'react';
// import logo from '../resources/logo.png';
// import ActiveUsersList from './components/ActiveUsersList/ActiveUsersList';
// import * as webRTCHandler from '../utils/webRTC/webRTCHandler';
// import * as webRTCGroupHandler from '../utils/webRTC/webRTCGroupCallHandler';
// import DirectCall from './components/DirectCall/DirectCall';
// import { connect } from 'react-redux';
// import DashboardInformation from './components/DashboardInformation/DashboardInformation';
// import { callStates } from '../store/actions/callActions';
// import GroupCallRoomsList from './components/GroupCallRoomsList/GroupCallRoomsList';
// import GroupCall from './components/GroupCall/GroupCall';
// import NavbarLocal from '../Navbar/Navbar';
// import NavbarMachine from '../Navbar/NavbarMachine';
// import AnswerInfo from './components/GroupCallRoomsList/AnswerInfo';
// import OnGoingCall from './components/CallingOngoingMessage/OnGoingCall';
// import store from '../store/store';
// import {  setCallState } from '../store/actions/callActions';
// import * as webRTCGroupCallHandler from '../utils/webRTC/webRTCGroupCallHandler';
// // import * as wssConnection from '../utils/wssConnection/wssConnection';
// import Thankyou from './components/ThankyouScreen/Thankyou';
// import { useHistory } from 'react-router-dom';
// import $ from 'jquery'

// import './Dashboard.css';

// const Dashboard = ({ username, callState, groupCallStreams }) => {


//   const history = useHistory();

//   useEffect(() => {
//     console.log("Dashboard $$$$$");
//     console.log(username);
//     console.log('usertype',username.usertype);
//     localStorage.setItem('usertype',username.usertype )
//     webRTCHandler.getLocalStream();
//     webRTCGroupHandler.connectWithMyPeer();
//   }, []);

//   const renderConnectionMessage = () => {
//     if(username.usertype == "OPERATOR"){
//       return
//     }
//     else if (groupCallStreams.length === 0) {
//       return <OnGoingCall />;
//     }
//   }

//   window.onunload = function () {
//     sessionStorage.removeItem('token');
//     sessionStorage.removeItem('user');
// }

// // const groupCall = () => {
// //   // console.log('dashboard--------', val);
// //   if(store.getState().call.callState == 'CALL_IN_PROGRESS' || store.getState().call.callState == 'CALL_AVAILABLE'){

// //     return<GroupCall username={username} /> 

// //   }
// //   else if(store.getState().call.callState == 'CALL_DISCONNECT'){
// //     console.log('checked');
// //     return 

// //   }

// // }




//   return (
//     // old start
//     // <div className='dashboard_container background_main_color'>
//     //   <div className='dashboard_left_section'>
//     //     <div className='dashboard_content_container'>
//     //       <DirectCall />
//     //       <GroupCall />
//     //       {callState !== callStates.CALL_IN_PROGRESS && username.usertype === "OPERATOR" && <DashboardInformation username={username.username} />}
//     //     </div>
//     //     <div className='dashboard_rooms_container background_secondary_color'>
//     //       <GroupCallRoomsList />
//     //     </div>
//     //   </div>
//     //   <div className='dashboard_right_section background_secondary_color'>
//     //     <div className='dashboard_active_users_list'>
//     //       {/* {username.usertype === "OPERATOR" && <ActiveUsersList />} */}
//     //     </div>
//     //     <div className='dashboard_logo_container'>
//     //       <img className='dashboard_logo_image' src={logo} />
//     //     </div>
//     //   </div>
//     // </div>
//     // old end
//   // <div>
//   // {username.usertype == 'OPERATOR' && <NavbarLocal /> }
//   //   <div className='bg_color_theme'>
//   //     <div className='col-12 row height_90'>
//   //       {/* // Call Pending */}
//   //       <div className='col-4 pt-1 px-0 scroll_group_list'>
//   //         {/* <span>Active</span> */}
//   //         {/* <GroupCallRoomsList /> */}
//   //         {username.usertype === "OPERATOR" && <GroupCallRoomsList />}
//   //       </div>
//   //       {/* // video section */}
//   //       <div className='col-6'>
//   //         {/* <span>Video</span> */}
//   //         {renderConnectionMessage()}
//   //         <DirectCall />
//   //         <GroupCall username={username} />
//   //       </div>
//   //       <div className='col-2 pt-1 px-0'>
//   //         {username.usertype === "OPERATOR" && <AnswerInfo />}

//   //       </div>
//   //     </div>
//   //   </div>
//   //   </div>


//   <div>
//       {username.usertype == 'OPERATOR' && <NavbarLocal />}
//     <div className='bg_color_theme'>
//       <div className='row'>
//         <div className='col-12' >
//       {/* <div><button className='btn btn-primary test' onClick={leaveRoom}>close</button></div> */}

//           {renderConnectionMessage()}
//           <DirectCall/>
//           <GroupCall username={username} />
//           {/* {groupCall() } */}

//         </div>
//       </div>
//       <div className='scroll_group_list'>
//         {/* <span>Active</span> */}
//         {/* <GroupCallRoomsList /> */}
//         {username.usertype === "OPERATOR" && <GroupCallRoomsList />}
//       </div>
//       <div className='operator'>
//         {username.usertype === "OPERATOR" && <AnswerInfo />}
//       </div>
//     </div>
//     </div>


//   );
// };

// const mapStateToProps = ({ call, dashboard }) => ({
//   ...call,
//   ...dashboard
// });

// export default connect(mapStateToProps)(Dashboard);


/////////////////////////////// new dashbord design //////////////////////////////////////
import React, { useEffect, useState } from 'react';
import * as webRTCHandler from '../utils/webRTC/webRTCHandler';
import * as webRTCGroupHandler from '../utils/webRTC/webRTCGroupCallHandler';
import DirectCall from './components/DirectCall/DirectCall';
import { connect } from 'react-redux';
import DashboardInformation from './components/DashboardInformation/DashboardInformation';
import { callStates } from '../store/actions/callActions';
import GroupCallRoomsList from './components/GroupCallRoomsList/GroupCallRoomsList';
import GroupCall from './components/GroupCall/GroupCall';
import NavbarLocal from '../Navbar/Navbar';
import NavbarMachine from '../Navbar/NavbarMachine';
import AnswerInfo from './components/GroupCallRoomsList/AnswerInfo';
import OnGoingCall from './components/CallingOngoingMessage/OnGoingCall';
import store from '../store/store';
import { setCallState } from '../store/actions/callActions';
import * as webRTCGroupCallHandler from '../utils/webRTC/webRTCGroupCallHandler';
import { useHistory } from 'react-router-dom';
import LogoImage from '../resources/GMR_delhi_combine_logo.png'; // Update the path
import afterCall from '../resources/afterCall.png'; // Update the path
import busyInCall from '../resources/busyInCall.png'; // Update the path
import Thumbup from '../resources/busyInCall.png'; // Update the path
import onBreak from '../resources/onBreak.png'; // Update the path
import availableAgent from '../resources/availableAgent.png'; // Update the path
import dropdownImg from '../resources/dropdown.png'; // Update the path
import { Link } from 'react-router-dom';
import './Dashboard.css';
import * as common from '../utils/Service/Common';
import axios from 'axios';
import * as Services from '../utils/Service/Service'

const Dashboard = ({ username, callState, groupCallStreams }) => {
  const history = useHistory();
  const [topKiosks, setTopKiosks] = useState([]);
  const [longestDurations, setLongestDurations] = useState([]);
  const [topQueries, setTopQueries] = useState([]);
  const [inboundCalls, setInboundCalls] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0); // In minutes
  const [resolutionRate, setResolutionRate] = useState(0);
  const [avgAfterCallWork, setavgAfterCallWork] = useState(0);
  const [sessions, setSessions] = useState({ data: [] });
  const [filteredDateData, setFilteredDateData] = useState({});
  const [showCustomDatePopup, setShowCustomDatePopup] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [filterDateErrorMsg, setFilterDateErrorMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [missedCallCount, setMissedCallCount] = useState(0);
  const [QueryCount, setQueryCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Maintain itemsPerPage in state
  const [totalPages, setTotalPages] = useState(1); // State to track total pages returned from the server
  const [kioskSessionId, setKioskSessionId] = useState(localStorage.getItem('kioskSessionId'));
  const isActiveGroupCall = webRTCGroupCallHandler.checkActiveGroupCall();
  const userName = common.getUser();
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const [apiDataReady, setApiDataReady] = useState(false); // Add state
  const [agentStatus, setAgentStatus] = useState({
    available: 0,
    on_break: 0,
    busy_in_call: 0
  });

  const [isMenuOpen, setMenuOpen] = useState(false);

  // Function to toggle the menu
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };


  const closePopup = () => {
    setCustomEndDate('');
    setCustomStartDate('');
    setShowCustomDatePopup(false);
    setFilterDateErrorMsg(false);
  }

  const showFilterData = () => {
    console.log('checking the click');

    if (customStartDate && customEndDate) {
      console.log('checking the start and end dates ===', customStartDate, customEndDate);
      if (customStartDate <= customEndDate) {
        setFilteredDateData({
          startDate: `${customStartDate} 00:00:00`,
          endDate: `${customEndDate} 23:59:59`
        })
        setFilterDateErrorMsg(false);
        closePopup();
      } else {
        setErrorMsg('Invalid date selection! Make sure the start date comes before the end date');
        setFilterDateErrorMsg(true);
      }
    } else {
      setErrorMsg('Please select valid start and end dates');
      setFilterDateErrorMsg(true);
    }
  }

  useEffect(() => {
    console.log('Dom Mounted');
    const dateData = getFormattedDateRange('today');
    setFilteredDateData(dateData);
  }, []);


  useEffect(() => {
    const intervalId = setInterval(() => {
      if ([false, null].includes(isActiveGroupCall)) {
        Services.updateAgentCallStatus(userDetails.userId, 'available', true);
        console.log('hi');
      }
    }, 10000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [isActiveGroupCall]);  // Now the effect runs whenever isActiveGroupCall changes


  useEffect(() => {
    const fetchCallDetailsByUser = async () => {
      try {
        let filterData = {};
        console.log('filteredDateData === ', filteredDateData);

        if (filteredDateData) {
          filterData = {
            username: common.getUser(),
            startDate: new Date(`${filteredDateData.startDate}`).toISOString(),
            endDate: new Date(`${filteredDateData.endDate}`).toISOString()
          };
        } else {
          filterData = {
            username: common.getUser(),
            startDate: new Date('2024-10-01T00:00:00').toISOString(),
            endDate: new Date('2024-10-31T00:00:00').toISOString()
          };
        }


        const response = await fetch(
          `${process.env.REACT_APP_SERVER}/getUserActivityDetailsByUserName?filterDataString=${encodeURIComponent(JSON.stringify(filterData))}`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        setInboundCalls(data.totalInboundCalls || 0);
        setTotalDuration(data.totalDuration || 0); // Assuming API returns duration in minutes
        setResolutionRate(data.resolutionRate || 0);
        setavgAfterCallWork(data.avgAfterCallWork || 0);

      } catch (error) {
        setInboundCalls(0);
        setTotalDuration(0); // Assuming API returns duration in minutes
        setResolutionRate(0);
        setavgAfterCallWork(0);

        console.error('Fetch error:', error);
      }
    };

    if (username) {
      fetchCallDetailsByUser();
    }
  }, [username, filteredDateData]);


  useEffect(() => {
    const dashboardContainer = document.querySelector('.dashboard-container');
    const dropdown = document.querySelector('.custom-dropdown');

    // Event listener for clicks inside the dashboard container
    const handleClick = (event) => {
      const clickedElement = event.target;

      // Check if the clicked element is the dropdown button
      if (clickedElement.classList.contains('dropdown-button') || clickedElement.classList.contains('dropdown-img')) {
        // Toggle the active class to show or hide the dropdown list
        dropdown.classList.toggle('active');
      } else {
        // If clicked outside the dropdown button or list, close the dropdown
        dropdown.classList.remove('active');
      }
    };

    // Event listener for dropdown list items (added only once)
    const handleDropdownItemClick = (e) => {
      const dropdownButton = document.querySelector('.dropdown-button');
      if (e.target.textContent !== 'Custom') {
        dropdownButton.textContent = e.target.textContent;
        const dateData = getFormattedDateRange(e.target.textContent);
        setFilteredDateData(dateData);

        // Close the dropdown
        dropdown.classList.remove('active');
      } else if (e.target.textContent === 'Custom') {
        dropdownButton.textContent = e.target.textContent;
        setShowCustomDatePopup(true);
      }
    };

    // Add event listener for clicks inside the dashboard container
    dashboardContainer.addEventListener('click', handleClick);

    // Add event listener for each dropdown item (only once)
    const dropdownItems = document.querySelectorAll('.dropdown-list');
    dropdownItems.forEach(item => {
      item.addEventListener('click', handleDropdownItemClick);
    });

    // Cleanup function to remove event listeners on component unmount
    return () => {
      dashboardContainer.removeEventListener('click', handleClick);
      dropdownItems.forEach(item => {
        item.removeEventListener('click', handleDropdownItemClick);
      });
    };
  }, []);


  const getFormattedDateRange = (selection) => {
    const today = new Date();

    // Helper function to format date as 'YYYY-MM-DD HH:mm:ss.SSS'
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    let startDate, endDate;

    switch (selection.toLowerCase()) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'this week':
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
        const lastDayOfWeek = new Date(today.setDate(today.getDate() + 6)); // Saturday
        startDate = new Date(firstDayOfWeek.setHours(0, 0, 0, 0));
        endDate = new Date(lastDayOfWeek.setHours(23, 59, 59, 999));
        break;
      case 'this month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0); // First day of month
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999); // Last day of month
        break;
      case 'this year':
        startDate = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0); // January 1st
        endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999); // December 31st
        break;
      // case 'custom':
      //   // Handle custom date logic here
      //   // You can set startDate and endDate for custom range
      //   break;
      default:
        console.log('no data found');
        ;
    }

    // Keep the previous items in the array
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    }
  }

  useEffect(() => {
    const fetchCallDetailsByUsers = async () => {
      try {
        console.log('checking my started dates in callsss1111111111111 ===');
        let filterData = {};
        if (filteredDateData) {
          filterData = {
            username: common.getUser(),
            startDate: new Date(`${filteredDateData.startDate}`).toISOString(), // Correct format
            endDate: new Date(`${filteredDateData.endDate}`).toISOString(),  // Correct format
            pageno: currentPage,
            dataPerPage: itemsPerPage,
          };
        } else {
          filterData = {
            username: common.getUser(),
            startDate: new Date('2024-10-01T00:00:00').toISOString(), // Correct format
            endDate: new Date('2024-10-31T00:00:00').toISOString(),  // Correct format
            pageno: currentPage,
            dataPerPage: itemsPerPage,
          };
        }
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get user's timezone

        console.log('checking my started dates in callsss ===', filterData);

        // Fetch call details and pass both username and timezone to the backend
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/getCallDetailsByUser`, {
          params: {
            filterDataString: JSON.stringify(filterData),
            timezone: timeZone,
          }
        });

        console.log('checking the response = ', response);

        if (response.status === 200) {
          const { data } = response;  // axios already parses the response as JSON
          console.log('hiiiii', data);
          setSessions(data);
          setTotalPages(data.totalPages)
        }

      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    if (username) { // Ensure username is defined before calling the function
      fetchCallDetailsByUsers();
    }
  }, [username, filteredDateData, currentPage]); // Dependency array - fetch new details if username changes


  useEffect(() => {
    console.log("Dashboard loaded with user:", username);
    localStorage.setItem('usertype', username.usertype);
    webRTCHandler.getLocalStream();
    webRTCGroupHandler.connectWithMyPeer();
  }, [username]);

  const renderConnectionMessage = () => {
    if (username.usertype !== "OPERATOR" && groupCallStreams.length === 0) {
      return <OnGoingCall />;
    }
  };




  window.onunload = function () {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  console.log('webRTCGroupCallHandler.checkActiveGroupCall() is active:', isActiveGroupCall);
  const roomId = isActiveGroupCall;
  useEffect(() => {
    const fetchKioskSessionId = async () => {
      if (roomId) {
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER}/getKioskSessionId?roomId=${roomId}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setKioskSessionId(data.kioskSessionId); // Set state
          localStorage.setItem('kioskSessionId', data.kioskSessionId); // Store in localStorage
          if (typeof window !== 'undefined') {
            window.parent.postMessage({ socketId: data.kioskSessionId }, '*');
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      }
    };

    fetchKioskSessionId();
  }, [roomId]);

  useEffect(() => {
    const username = common.getUser();
    const fetchTopQueries = async () => {
        try {
            // Include filterData in the request
            let filterData = {
                username: username, // Include username
            };
            if (filteredDateData) {
                filterData = {
                    ...filterData, // Keep the username
                    startDate: new Date(`${filteredDateData.startDate}`).toISOString(),
                    endDate: new Date(`${filteredDateData.endDate}`).toISOString(),
                };
            }

            const response = await fetch(`${process.env.REACT_APP_SERVER}/getTopQueries?filterDataString=${encodeURIComponent(JSON.stringify(filterData))}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched data:', data);

            setTopQueries(data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    fetchTopQueries();
}, [filteredDateData]);




  useEffect(() => {
    const username = common.getUser();
    const fetchKiosksAndDurations = async () => {
        try {
            let filterData = {
                username: username, // Include username
            };
            if (filteredDateData) {
                filterData = {
                    ...filterData, // Keep the username
                    startDate: new Date(`${filteredDateData.startDate}`).toISOString(),
                    endDate: new Date(`${filteredDateData.endDate}`).toISOString(),
                };
            }

            const response = await fetch(`${process.env.REACT_APP_SERVER}/getTopKiosksAndDurations?filterDataString=${encodeURIComponent(JSON.stringify(filterData))}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched data:', data);

            setTopKiosks(data.topKiosks);
            setLongestDurations(data.longestDurations);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    fetchKiosksAndDurations();
}, [filteredDateData]);  


  useEffect(() => {
      const fetchAgentStatusCounts = async () => {
        const username = common.getUser();
        try {
            if (!username) {
                console.error("Username is not available.");
                return; // Exit if username is missing
            }
  
            const response = await fetch(`${process.env.REACT_APP_SERVER}/getAgentStatusCounts?username=${encodeURIComponent(username)}`);
  
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Agent status data:', data);
  
            // Update the agent status in the state
            setAgentStatus(data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }; 

    const fetchMissedCallCount = async () => {
      const username = common.getUser();
      try {
          // Constructing filter data for missed calls
          let filterData = {
              username: username, // Include username in filter data
          };
  
          if (filteredDateData) {
              filterData.startDate = new Date(`${filteredDateData.startDate}`).toISOString();
              filterData.endDate = new Date(`${filteredDateData.endDate}`).toISOString();
          } else {
              filterData.startDate = new Date('2024-10-01T00:00:00').toISOString();
              filterData.endDate = new Date('2024-10-31T00:00:00').toISOString();
          }
  
          console.log('Sending filterData for missed call count:', JSON.stringify(filterData)); // Log the filter data
  
          const response = await fetch(
              `${process.env.REACT_APP_SERVER}/getMissedCallReportCount?filterDataString=${encodeURIComponent(JSON.stringify(filterData))}`
          );
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('Missed call count:', data.missedCallCount);
  
          // Update the missed call count in the state
          setMissedCallCount(data.missedCallCount);
      } catch (error) {
          console.error('Fetch error:', error);
      }
  };
    const fetchQueryCount = async () => {
      try {
          let filterData = {};
  
          if (filteredDateData) {
              const startDateLocal = new Date(filteredDateData.startDate);
              const endDateLocal = new Date(filteredDateData.endDate);
  
              // Convert to UTC string with time
              filterData.startDate = startDateLocal.toISOString(); 
              filterData.endDate = endDateLocal.toISOString();
          } else {
              filterData.startDate = new Date("2024-10-01").toISOString();
              filterData.endDate = new Date("2024-10-31").toISOString();
          }
  
          // Add the username from common.getUser()
          filterData.username = common.getUser();
  
          let queryString = `?startDate=${encodeURIComponent(filterData.startDate)}&endDate=${encodeURIComponent(filterData.endDate)}`;
  
          if (filterData.username) {
              queryString += `&username=${encodeURIComponent(filterData.username)}`;
          }
  
          const response = await fetch(`${process.env.REACT_APP_SERVER}/getQueryCount${queryString}`);
  
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
  
          const data = await response.json();
          console.log("Query count:", data.queryCount);
  
          setQueryCount(data.queryCount);
      } catch (error) {
          console.error("Fetch error:", error);
      }
  };
  
    
    

    // Fetch both agent status counts and missed call count when the component mounts
    fetchAgentStatusCounts();
    fetchMissedCallCount();
    fetchQueryCount();

    // Set intervals to refetch data every 5 seconds
    const intervalId = setInterval(() => {
      fetchAgentStatusCounts();
      fetchMissedCallCount();
      fetchQueryCount();
    }, 5000);

    // Cleanup function to clear the interval
    return () => {
      clearInterval(intervalId);
    };
  }, [filteredDateData])


  useEffect(() => {
    const userName = common.getUser();
  
    const fetchUserAdminDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER}/getUserAdminDetails?userName=${userName}`); // Pass username as query parameter
        if (!response.ok) {
          throw new Error('Failed to fetch user admin details');
        }
        const data = await response.json();
        console.log("User Admin Details:", data);
        
        // Store the terminal value in a state or context if needed
        // Example: setTerminal(data.terminal);
        // or
        // localStorage.setItem('userTerminal', data.terminal)
        localStorage.setItem('userTerminalData', JSON.stringify(data));
  
      } catch (error) {
        console.error("Error fetching user admin details:", error);
      }
    };
  
    fetchUserAdminDetails();
  }, []);


  const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);
  return (
    <div className="dashboard-container row">

      <div className="bg_color_theme">
        <div className="row">
          <div className="col-12">
            {renderConnectionMessage()}
            <DirectCall />
            <GroupCall username={username} />
          </div>
        </div>
        {/* {isActiveGroupCall && ( */}
        {console.log('iuytfrdcvbnm', isActiveGroupCall)
        }
  <div className="scroll_group_list">
          {username.usertype === "OPERATOR" && common.getToken().split('?')[1] !== 'isAdmin=1' && (
            <>
              {console.log("GroupCallRoomsList component rendered")}
              <GroupCallRoomsList />
            </>
          )}
        </div>

        {/* )} */}
        <div className="operator">
          {username.usertype === "OPERATOR" && <AnswerInfo />}
        </div>
      </div>

      {/*                                               dash board starts from here   above code is for vedio call                                   */}
      <div className="row">
        {/* Navbar Section */}
        <div className="col-md-2">
          {username.usertype === 'OPERATOR' && <NavbarLocal />}
        </div>
        {/* Main Content Section */}
        <div className="col-md-10" style={{ padding: ' 0px 30px' }}>
          <div className="top-image-container-dashboard">
            {/* <img src={LogoImage} alt="GMR Delhi Logo" className="logo-image" /> */}
          </div>
          <div className="custom-dropdown">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 15px', width: '100%' }}>
              <button className="dropdown-button">Today</button>
              <img className='dropdown-img' src={dropdownImg} style={{ width: '25px', height: '25px' }} />
            </div>
            <ul className="dropdown-listbox">
              <li className="dropdown-list">Today</li>
              <li className="dropdown-list">This Week</li>
              <li className="dropdown-list">This Month</li>
              <li className="dropdown-list">This Year</li>
              <li className="dropdown-list">Custom</li>
            </ul>
          </div>
          {showCustomDatePopup ?
            <div className='custom-popup'>
              <div className='custom-popup-modal'>
                <div className='custom-popup-header'>
                  <h5>Please select a date range</h5>
                </div>
                <div className="custom-popup-body">
                  <div className="date-range-container">
                    <input type="date" className="date-input" max={new Date().toISOString().split('T')[0]} onChange={(e) => setCustomStartDate(e.target.value)} />
                    <span className="date-label">to</span>
                    <input type="date" className="date-input" min={customStartDate} max={new Date().toISOString().split('T')[0]} onChange={(e) => setCustomEndDate(e.target.value)} />
                  </div>
                </div>
                {filterDateErrorMsg ? <div className='error-msg'>{errorMsg}</div> : null}
                <div className='popup-btns'>
                  <button className='popupbtn back-btn' onClick={() => closePopup()}>BACK</button>
                  <button className="popupbtn save-btn" onClick={() => showFilterData()}>SAVE</button>
                </div>
              </div>
            </div>
            : null
          }
          {/* New Dashboard Layout */}
          {
            common.getToken().split('?')[1] === 'isAdmin=1' ? (
              <>
                <div className="dashboard-content row">
                  {/* Left Section */}
                  <div className="dashboard-left col-md-6" style={{ paddingLeft: '55px' }}>
                    <h2 className="activityTitle" style={{ marginBottom: '20px', color: '#29417D', position: 'relative', top: '-40px' }}>
                      Activity
                    </h2>
                    <h3 className="section-title">Agents</h3>
                    <div className="row agents-status">

                      {/* Inbound Calls - Always Green */}
                      <div className="col-3" style={{ height: '112px', width: '149px', marginBottom: '20px' }}>
                        <div className="agent-card Inbound-Calls">
                          <img src={availableAgent} alt="Inbound Calls" style={{ width: '25px', height: '25px' }} className="icon" />
                          <span className="agent-labels " style={{ marginTop: '12px', width: '32px' }}>Available Agents</span>
                          <span className="agent-count" style={{ bottom: '0px', }}> {agentStatus.available}</span>
                          <span className="status-dot" style={{ backgroundColor: 'green', borderRadius: '50%', height: '10px', width: '10px', display: 'inline-block', marginLeft: '10px', position: 'relative', top: '-103px', left: '42px' }}></span>
                        </div>
                      </div>

                      {/* Total Call Duration */}
                      <div className="col-3" style={{ height: '112px', width: '149px', marginBottom: '20px' }}>
                        <div className="agent-card Call-Time">
                          <img src={onBreak} alt="Call Time" style={{ width: '25px', height: '25px' }} className="icon" />
                          <span className="agent-labels" style={{ marginTop: '12px', width: '32px' }}>On Break</span>
                          <span className="agent-count" style={{ bottom: '0px', }}>{agentStatus.on_break}</span>
                          <span
                            className="status-dot"
                            style={{
                              backgroundColor: totalDuration < 20 ? 'red' : totalDuration < 50 ? 'orange' : 'green',
                              borderRadius: '50%',
                              height: '10px',
                              width: '10px',
                              display: 'inline-block',
                              marginLeft: '10px',
                              position: 'relative', top: '-103px', left: '42px'
                            }}
                          ></span>
                        </div>
                      </div>

                      {/* Resolution Rate */}
                      <div className="col-3" style={{ height: '112px', width: '149px', marginBottom: '20px' }}>
                        <div className="agent-card Resolution-Rate">
                          <img src={Thumbup} alt="Resolution Rate" className="icon" />
                          <span className="agent-labels" style={{ marginTop: '12px', width: '32px' }}>Busy In-Call</span>
                          <span className="agent-count" style={{ bottom: '0px', marginTop: '10px' }}>{agentStatus.busy_in_call}</span>
                          <span
                            className="status-dot"
                            style={{
                              backgroundColor: agentStatus.busy_in_call < 20 ? 'red' : resolutionRate < 50 ? 'orange' : 'green',
                              borderRadius: '50%',
                              height: '10px',
                              width: '10px',
                              display: 'inline-block',
                              marginLeft: '10px',
                              position: 'relative', top: '-100px', left: '42px'
                            }}
                          ></span>
                        </div>
                      </div>
                    </div>
                    {/* Calls Section */}
                    <h3 className="section-title" style={{ marginTop: '15px' }} >Calls</h3>
                    <div className="row calls-status">
                      <div className="col-3" style={{ height: '125px', border: '1px solid #8CB0FF', marginRight: '20px', borderRadius: '10px' }}>
                        <div className="calls-card" style={{ display: 'flex', flexDirection: 'column' }}>
                          <div className="calls-label" style={{ width: "94px" }}>Calls Received</div>
                          <div className="calls-count" style={{ color: '#29417D', marginTop: '20px' }}>{inboundCalls}</div>
                        </div>
                      </div>
                      <div className="col-3" style={{ height: '125px', border: '1px solid #8CB0FF ', borderRadius: '10px' }}>
                        <div className="calls-card" style={{ display: 'flex', flexDirection: 'column' }}>
                          <div className="calls-label" style={{ width: "94px" }}>Abandoned Calls</div>
                          <div className="calls-count" style={{ color: '#FF0000', marginTop: '15px' }}>{missedCallCount}</div>
                        </div>
                      </div>
                      <div className="col-3" style={{ height: '125px', border: '1px solid #8CB0FF ', borderRadius: '10px' , marginLeft:'20px'}}>
                        <div className="calls-card" style={{ display: 'flex', flexDirection: 'column' }}>
                      <Link to="/Auditlist" style={{ textDecoration: 'none' , zIndex:'9' }}>
                          <div className="calls-label" style={{ width: "94px" }}>Query Details</div>
                          <div style={{fontSize:'10px'}}>Plese click here to see the details log</div>
                          <div className="calls-count" style={{ color: '#FF0000', }}>{QueryCount}</div>
                      </Link>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Section */}
                  <div className="dashboard-right col-md-5" style={{ backgroundColor: '#FDFDFF', fontSize: '14px', marginTop: '30px' }}>
                    <div className="top-queries mb-4">
                      <h3 className="section-title" style={{ textDecoration: 'underline' }}>Top Queries</h3>
                      <ul>
                        {topQueries.map((query, index) => (
                          <li key={index}>
                            {query.query} <span className="float-right">{query.count}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="top-kiosk mb-4">
                      <h3 className="section-title" style={{ textDecoration: 'underline' }}>Top Kiosk</h3>
                      <ul>
                        {topKiosks.map((kiosk, index) => (
                          <li key={index}>{kiosk.callOrigin} <span className="float-right">{kiosk.total_count}</span></li>
                        ))}
                      </ul>
                    </div>

                    <div className="longest-call-duration">
                      <h3 className="section-title" style={{ textDecoration: 'underline' }}>Longest Call Duration</h3>
                      <ul>
                        {longestDurations.map((duration, index) => (
                          <li key={index}>Session ID-{duration.sessionId} <span className="float-right">{duration.callDuration}</span></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </>) : (
              <div className="dashboard-content row">
                <div className="hamburger-container">
                  {/* Hamburger Icon */}
                  <div className="hamburger-menu" onClick={toggleMenu}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                  </div>

                  {/* Popup Menu */}
                  {isMenuOpen && (
                    <div className="menu-popup">
                      <ul>
                        <li><Link to="/userprofile">User Profile</Link></li>
                        {/* <li><a href="/settings">Settings</a></li>
                        <li><a href="/logout">Log out</a></li> */}
                      </ul>
                    </div>
                  )}
                </div>
                {/* Left Section */}
                <div className="dashboard-left col-md-6" style={{ paddingLeft: '55px' }}>
                  <h2 className="activityTitle" style={{ marginBottom: '20px', color: '#29417D', position: 'relative', top: '-40px' }}>Activity</h2>
                  <h3 className="section-title">Your Calls</h3>
                  <div className="row agents-status">

                    {/* Total Inbound Calls */}
                    <div className="col-6" style={{ height: '130px', width: '230px', marginBottom: '20px' }}>
                      <div className="agent-card Inbound-Calls">
                        <img src={availableAgent} alt="Inbound Calls" size={24} className="icon" />
                        <span className="agent-labels">Total number of Inbound Calls</span>
                        <span className="agent-count">{inboundCalls}</span>
                        {/* Dot for Inbound Calls - always green */}
                        <span className="status-dot" style={{ backgroundColor: 'green', borderRadius: '50%', width: '10px', height: '10px', display: 'inline-block', marginLeft: '10px', position: 'relative', top: '-125px', left: '78px' }}></span>
                      </div>
                    </div>

                    {/* Total Call Duration */}
                    <div className="col-6" style={{ height: '130px', width: '230px', marginBottom: '20px' }}>
                      <div className="agent-card Call-Time">
                        <img src={onBreak} alt="Call Time" size={24} className="icon" />
                        <span className="agent-labels">Total Call Duration (minutes)</span>
                        <span className="agent-count">{totalDuration}</span>
                        {/* Dot for Call Time */}
                        <span className="status-dot" style={{ backgroundColor: totalDuration < 20 ? 'red' : totalDuration < 50 ? 'orange' : 'green', borderRadius: '50%', width: '10px', height: '10px', display: 'inline-block', marginLeft: '10px', position: 'relative', top: '-125px', left: '78px' }}></span>
                      </div>
                    </div>

                    {/* Resolution Rate */}
                    <div className="col-6" style={{ height: '130px', width: '230px', marginBottom: '20px' }}>
                      <div className="agent-card Resolution-Rate">
                        <img src={Thumbup} alt="Resolution Rate" size={24} className="icon" />
                        <span className="agent-labels">Resolution Rate (%)</span>
                        <span className="agent-count">{resolutionRate} %</span>
                        {/* Dot for Resolution Rate */}
                        <span className="status-dot" style={{ backgroundColor: resolutionRate < 20 ? 'red' : resolutionRate < 50 ? 'orange' : 'green', borderRadius: '50%', width: '10px', height: '10px', display: 'inline-block', marginLeft: '10px', position: 'relative', top: '-107px', left: '78px' }}></span>
                      </div>
                    </div>
                    {/* Query Rate */}
                    <div className="col-6" style={{ height: '130px', width: '230px', marginBottom: '20px' }}>
                    <Link to="/Auditlist" style={{ textDecoration: 'none' }}>
                      <div className="agent-card Resolution-Rate">
                        <img src={Thumbup} alt="Query Coun" size={24} className="icon" />
                        <span className="agent-labels">Query Count</span>
                        <span className="agent-count">{QueryCount}</span>
                        {/* Dot for Resolution Rate */}
                        <span className="status-dot" style={{ backgroundColor: resolutionRate < 20 ? 'red' : resolutionRate < 50 ? 'orange' : 'green', borderRadius: '50%', width: '10px', height: '10px', display: 'inline-block', marginLeft: '10px', position: 'relative', top: '-95px', left: '78px' }}></span>
                        <span className="agent-labels" style={{position:'relative', top:'-60px', color:'#29417D'}}>Plese click here to see the details log</span>
                      </div>
                      </Link>
                    </div>
                  </div>
                </div>


                {/* Right Section */}
                <div className="dashboard-right col-md-6" style={{ backgroundColor: '#FDFDFF', padding: '20px' }}>
                  <h3 className="section-title">Recent Call Logs</h3>
                  <div>
                    <table className="table table-striped" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ color: '#29417D', textAlign: 'center' }}>
                          <th>Session</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Kiosk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions?.data.map((session, index) => {
                          const formattedDate = session.date.split('-').reverse().join('-'); // Format the date to DD-MM-YYYY
                          return (
                            <tr key={index} style={{ textAlign: 'center' }}>
                              <td>{session.sessionId}</td>
                              <td>{formattedDate}</td>
                              <td>{session.time}</td>
                              <td>{session.kiosk}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-end mt-2">
                      <nav aria-label="Page navigation example">
                        <ul className="pagination">
                          {/* Previous Button */}
                          <li
                            className={`page-item ${currentPage === 1 ? "disabled" : ""
                              }`}
                          >
                            <a
                              className="page-link"
                              href="#!"
                              onClick={() =>
                                currentPage > 1 && setCurrentPage(currentPage - 1)
                              }
                            >
                              Previous
                            </a>
                          </li>
                          {pageNumbers
                            .slice(
                              Math.max(0, currentPage - 2), // Show 2 pages before the current one
                              Math.min(totalPages, currentPage + 1) // Show up to 1 page after the current one
                            )
                            .map((number) => (
                              <li
                                key={number}
                                className={`page-item ${number === currentPage ? "active" : ""
                                  }`}
                                onClick={() => setCurrentPage(number)}
                              >
                                <a className="page-link" href="#!">
                                  {number}
                                </a>
                              </li>
                            ))}
                          <li
                            className={`page-item ${currentPage === totalPages ? "disabled" : ""
                              }`}
                          >
                            <a
                              className="page-link"
                              href="#!"
                              onClick={() =>
                                currentPage < totalPages &&
                                setCurrentPage(currentPage + 1)
                              }
                            >
                              Next
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ call, dashboard }) => ({
  ...call,
  ...dashboard
});

export default connect(mapStateToProps)(Dashboard);