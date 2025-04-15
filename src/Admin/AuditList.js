
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import DownloadImage from "../resources/download.png";
import * as XLSX from "xlsx";
import NavbarLocal from "../Navbar/Navbar";
import LogoImage from "../resources/GMR_delhi_combine_logo.png";
import downlaod from "../resources/downlaod.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import * as common from '../utils/Service/Common';
import "./Operator.css";
import { saveAs } from "file-saver";
import * as Services from '../utils/Service/Service'
import Swal from 'sweetalert2';


const AuditList = () => {
  const [auditReports, setAuditReports] = useState([]);
  const [sortField, setSortField] = useState("callEndTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Maintain itemsPerPage in state
  const [totalPages, setTotalPages] = useState(1); // State to track total pages returned from the server

  const history = useHistory();
  const userName = common.getUser(); // Assuming common.getUser() fetches the current username
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER}/api/user-permissions?username=${userName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user permissions');
        }
        const data = await response.json();
        setPermissions(data);
      } catch (error) {
        console.error('Error fetching user permissions:', error);
      }
    };

    fetchUserPermissions();
  }, [userName]);


 const hasPermission = (permissionId) => {
    return permissions.includes(permissionId);
  };

  useEffect(() => {
    Services.updateAgentCallStatus(userDetails.userId, 'available', true);
    return () => {
    };
  }, []);

  useEffect(() => {
      const fetchAuditReports = async () => {
          try {
              const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
              const response = await fetch(
                  `${process.env.REACT_APP_SERVER}/getAuditReports?timezone=${encodeURIComponent(
                      timeZone
                  )}&page=${currentPage}&limit=${itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}&startDate=${startDate}&endDate=${endDate}&userName=${userName}`
              );
  
              if (!response.ok) {
                  throw new Error("Network response was not ok");
              }
  
              const { data, totalPages } = await response.json();
              console.log("API Response Data:", data);
            console.log("Raw API Response:", response);
  
              setAuditReports(data);
              setTotalPages(totalPages); // Update total pages
          } catch (error) {
              console.error("Fetch error:", error);
          }
      };
  
      fetchAuditReports();
  }, [currentPage, itemsPerPage, sortField, sortOrder, startDate, endDate, userName]);



  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  
  

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value)); // Update items per page when selection changes
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  const formatDuration = (duration) => {
    if (!duration) return "00:00:00"; // Handle null or undefined durations
  
    const match = duration.match(/(\d+) Minute[s]? (\d+) Second[s]?/);
    if (!match) return "00:00:00"; // If no match, return default duration format
  
    const [, minutes, seconds] = match;
    const hrs = Math.floor(Number(minutes) / 60);
    const mins = Number(minutes) % 60;
    const secs = Number(seconds);
  
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };
  

  const handleRowClick = (roomId, missedCall) => {
    if (!hasPermission(7)) {
      Swal.fire({
        icon: 'warning',
        title: 'Permission Denied',
        text: 'You do not have permission to edit call logs. Please contact an admin for access.',
      });
      return;
    }

    if (missedCall) {
      // Do nothing if it's a missed call
      return;
    }
    history.push(`/selectedCalllog/${roomId}`);
  };

  const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);

  const exportToExcel = async () => {
    try {
        // Fetch all records based on the current pagination settings
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        const response = await fetch(
            `${process.env.REACT_APP_SERVER}/getAuditReports?timezone=${encodeURIComponent(timeZone)}&page=1&limit=${totalPages * itemsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}&startDate=${startDate}&endDate=${endDate}&userName=${userName}`
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        console.log("Full API Response:", responseData);

        let { data } = responseData;

        // Function to convert duration string to total seconds
        const convertDurationToSeconds = (duration) => {
            if (!duration || typeof duration !== "string") {
                return 0; // Return 0 if duration is null, undefined, or not a string
            }

            const hourMatch = duration.match(/(\d+)\s*Hour/);
            const minuteMatch = duration.match(/(\d+)\s*Minute/);
            const secondMatch = duration.match(/(\d+)\s*Second/);

            const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
            const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
            const seconds = secondMatch ? parseInt(secondMatch[1]) : 0;

            return (hours * 3600) + (minutes * 60) + seconds;
        };

        // Process data: Remove unwanted fields and add new calculated field
        data = data.map(({ callDate,operator_recording, user_recording, duration, ...rest }) => ({
            ...rest,
            duration: duration || "Unknown", // Keep original duration or set default text
            call_duration_seconds: convertDurationToSeconds(duration) // Convert to seconds
        }));

        console.log("Processed Data:", data);

        // Convert fetched data to Excel sheet format
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Audit Reports");

        // Write Excel file to user
        XLSX.writeFile(wb, "AuditReports.xlsx");

    } catch (error) {
        console.error("Error fetching data for export:", error);
    }
};






  const downloadVideo = (data) => {
    console.log("Operator recording:", data.operator_recording); // Log operator recording
    const fileName = data.operator_recording.split('/').pop(); 
    var name = { url: data.operator_recording };
  
    fetch(process.env.REACT_APP_SERVER + '/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(name)
    })
    .then(response => response.blob())
    .then((res) => {
      const resp = new Blob([res], {type: "video/mp4"});
      saveAs(resp, fileName);
    })
    .catch((error) => console.error("Download error:", error)); // Log any errors
  };
  
  const downloadVideo1 = (data) => {
    console.log("User recording:", data.user_recording); // Log user recording
    const fileName = data.user_recording.split('/').pop(); 
    var name1 = { url: data.user_recording };
  
    fetch(process.env.REACT_APP_SERVER + '/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(name1)
    })
    .then(response => response.blob())
    .then((res) => {
      const resp = new Blob([res], {type: "video/mp4"});
      saveAs(resp, fileName);
    })
    .catch((error) => console.error("Download error:", error)); // Log any errors
  };
  
      
      


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <NavbarLocal />
        </div>
        <div className="col-md-10">
          <div>
            <div
              className="top-image-container"
              style={{ top: "-16px", left: "-45px" }}
            >
              {/* <img
                src={LogoImage}
                alt="GMR Delhi Logo"
                className="logo-image"
              /> */}
            </div>
            <div className="m-2 p-3">
              <div
                className="d-flex justify-content-between align-items-center mb-2"
                style={{ marginLeft: "10px" }}
              >
                <div
      style={{
        padding: "5px",
        border: "2px solid #fff",
        boxShadow: "0px 0px 5px 0px",
        borderRadius: "20px",
      }}
    >
      <label>Period:</label>
      <input
        style={{
          border: "1px solid rgb(196 196 196)",
          borderRadius: "5px",
        }}
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        max={endDate} // Disable future dates beyond the selected end date
      />
      <input
        style={{
          border: "1px solid rgb(196 196 196)",
          borderRadius: "5px",
        }}
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        min={startDate} // Disable previous dates before the selected start date
      />
    </div>
     {/* Items per Page Dropdown */}
     <div style={{marginRight:'20px'}}>
                <label style={{marginRight:'7px'}} htmlFor="itemsPerPage">Show</label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  style={{
                    padding: "5px",
                    border: "1px solid rgb(196 196 196)",
                    borderRadius: "5px",
                    fontSize: "12px",
                  }}
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <label style={{marginLeft:'7px'}} htmlFor="itemsPerPage">Records</label>
              </div>
              </div>
              <div className="frame_table_border " style={{ fontSize: "11px" }}>
                <div
                  className="bg-light p-0 m-0 rounded table_scroll"
                  style={{ height: "250px" ,display: "inline-block" , width:'100%'}}
                >
                  <table className="table table-striped" style={{borderCollapse: "collapse"}}>
                    <thead className="table-header">
                      <tr>
                        <th scope="col">No</th>
                        <th scope="col" style={{ fontSize: "10px" }}>
                          <td>
                          <div
                            onClick={() => handleSort("agent")}
                            className="sortable"
                          >
                            Agent
                            {sortField === "agent" && (
                              <FontAwesomeIcon
                                style={{ marginLeft: "10px" }}
                                icon={
                                  sortOrder === "asc" ? faSortUp : faSortDown
                                }
                              />
                            )}
                          </div>
                          </td>
                        </th>
                        <th scope="col" style={{ fontSize: "10px" }}>
                        <td>
                          <div
                            onClick={() => handleSort("callDate")}
                            className="sortable"
                          >
                            Call date
                            {sortField === "callDate" && (
                              <FontAwesomeIcon
                                style={{ marginLeft: "10px" }}
                                icon={
                                  sortOrder === "asc" ? faSortUp : faSortDown
                                }
                              />
                            )}
                          </div>
                            </td>
                        </th>
                        <th scope="col" style={{ fontSize: "10px" }}>
                        <td>
                          <div
                            onClick={() => handleSort("callEndTime")}
                            className="sortable"
                          >
                            Call End Time
                            {sortField === "callEndTime" && (
                              <FontAwesomeIcon
                                style={{ marginLeft: "10px" }}
                                icon={
                                  sortOrder === "asc" ? faSortUp : faSortDown
                                }
                              />
                            )}
                          </div>
                          </td>
                        </th>
                        <th scope="col" style={{ fontSize: "10px" }}>
                        <td>
                          <div
                            onClick={() => handleSort("duration")}
                            className="sortable"
                          >
                            Duration
                            {sortField === "duration" && (
                              <FontAwesomeIcon
                                style={{ marginLeft: "10px" }}
                                icon={
                                  sortOrder === "asc" ? faSortUp : faSortDown
                                }
                              />
                            )}
                          </div>
                            </td>
                        </th>
                        {/* <th scope="col" style={{ fontSize: "10px" }}>
                          <div
                            onClick={() => handleSort("query")}
                            className="sortable"
                          >
                            Query
                            {sortField === "query" && (
                              <FontAwesomeIcon
                                style={{ marginLeft: "10px" }}
                                icon={
                                  sortOrder === "asc" ? faSortUp : faSortDown
                                }
                              />
                            )}
                          </div>
                        </th> */}
                        <th scope="col" style={{ fontSize: "10px" }}>
                        <td>
                          <div
                            onClick={() => handleSort("missedCall")}
                            className="sortable"
                          >
                            Status
                            {sortField === "missedCall" && (
                              <FontAwesomeIcon
                                style={{ marginLeft: "10px" }}
                                icon={sortOrder === "asc" ? faSortUp : faSortDown}
                              />
                            )}
                          </div>
                          </td>
                        </th>
                        <th scope="col" style={{ fontSize: "10px" }}>
                        <td>
                          <div
                            onClick={() => handleSort("kiosk")}
                            className="sortable"
                          >
                            Kiosk
                            {sortField === "kiosk" && (
                              <FontAwesomeIcon
                                style={{ marginLeft: "10px" }}
                                icon={
                                  sortOrder === "asc" ? faSortUp : faSortDown
                                }
                              />
                            )}
                          </div>
                          </td>
                        </th>
                        <th scope="col" style={{ fontSize: "10px" }}><td>Recording</td></th>
                        <th scope="col" style={{ fontSize: "10px" }}>
                          <td>
                            <div onClick={() => handleSort("query")} className="sortable">
                              Query Status
                              {sortField === "query" && (
                                <FontAwesomeIcon
                                  style={{ marginLeft: "10px" }}
                                  icon={sortOrder === "asc" ? faSortUp : faSortDown}
                                />
                              )}
                            </div>
                          </td>
                        </th>
                        <th scope="col" style={{ fontSize: "10px" }}>
                          <td>
                            <div onClick={() => handleSort("terminal")} className="sortable">
                              Terminal
                              {sortField === "terminal" && (
                                <FontAwesomeIcon
                                  style={{ marginLeft: "10px" }}
                                  icon={sortOrder === "asc" ? faSortUp : faSortDown}
                                />
                              )}
                            </div>
                          </td>
                        </th>
                       {/* <th scope="col" style={{ fontSize: "10px" }}><td>User Recording</td></th> */}
                      </tr>
                    </thead>
                    <tbody>
  {auditReports.length > 0 ? (
    auditReports.map((report, index) => (
      <tr
      style={{ cursor: hasPermission(7) ? "pointer" : "default" }}
        key={index}
        onClick={() =>  handleRowClick(report.roomId, report.missedCallStatus === "Missed Call")}
      >
        <td>{index + 1}</td>
        <td>{report.agent}</td>
        {/* <td>{report.callDate ? new Date(report.callDate).toLocaleDateString() : 'null'}</td> */}
        <td>{report.callDateFormatted}</td>
        <td>{report.callEndTime}</td>
        <td>{formatDuration(report.duration)}</td>
        <td style={{ maxWidth: "90px" }}>
  {report.missedCallStatus}
</td>

        <td>{report.kiosk}</td>

        {/* Operator Recording */}
        <td>
          {report.operator_recording ? (
            <img
              src={downlaod} // Replace with your download icon path
              alt="Download Operator Recording"
              style={{ cursor: "pointer" ,height:'20px', width:'20px' }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                downloadVideo(report);
              }}
            />
          ) : (
            "No Recording Available"
          )}
        </td>
        <td style={{ textAlign: "center", fontSize: "11px" }}>
          {report.missedCallStatus === "Missed Call" ? (
            "No Data Available" // Show "No Data Available" for missed calls
          ) : report.query ? (
            <span style={{ color: "green" }}>✔️</span> // Original logic for non-missed calls
          ) : (
            <span style={{ color: "red" }}>❌</span>
          )}
        </td>

        {/* User Recording */}
        {/* <td>
          {report.user_recording ? (
            <img
              src={downlaod} // Replace with your download icon path
              alt="Download User Recording"
              style={{ cursor: "pointer", height:'20px', width:'20px' }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                downloadVideo1(report);
              }}
            />
          ) : (
            "No Recording Available"
          )}
        </td> */}
        <td>{report.terminal}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7">No reports found</td>
    </tr>
  )}
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

                        {/* Page Numbers - showing only three at a time */}
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

                        {/* Next Button */}
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
                {hasPermission(6) && (
                <div className="download-container mt-2">
                  <img
                    src={DownloadImage}
                    alt="Download"
                    className="download-image"
                    onClick={exportToExcel}
                    style={{ cursor: "pointer" }}
                  />
                  <span className="download-text" onClick={exportToExcel}>
                    Click to export .xsl
                  </span>
                </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditList;
