import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./reports.css";
import NavbarLocal from "../Navbar/Navbar";
import axios from "axios";
import * as common from '../utils/Service/Common';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("");
  const [reportUrl, setReportUrl] = useState("");
  const [reports, setReports] = useState();
  const [roles, setRoles] = useState();
  const [permissions, setPermissions] = useState([]);
  const userName = common.getUser();
  const username = common.getUser();

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
        const fetchReports = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/reports?username=${username}`);
                setReports(response.data);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/getroles`);
                setRoles(response.data);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchReports();
        fetchRoles();
    }, [username]);

  const handleReportChange = (event) => {
    const selectedReport = reports.find(
      (report) => report.report_name === event.target.value
    );
    setSelectedReport(event.target.value);
    setReportUrl(selectedReport ? selectedReport.report_url : "");
  };

  const handleAddReport = () => {
    Swal.fire({
      title: "Add New Report",
      html: `
        <div style="text-align: left;">
          <label for="swal-input1">Report Name:</label>
          <input id="swal-input1" class="swal2-input" placeholder="Enter report name">
          <label for="swal-input2">Report URL:</label>
          <input id="swal-input2" class="swal2-input" placeholder="Enter report URL">
          <label for="swal-input3">Roles:</label>
          <select id="swal-input3" class="swal2-select" multiple>
            ${roles.map(role => `<option value="${role.id}">${role.role_name}</option>`).join('')}
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: "Close",
      confirmButtonText: "Add Report",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
      preConfirm: () => {
        const reportName = document.getElementById("swal-input1").value;
        const reportUrl = document.getElementById("swal-input2").value;
        const selectedRoles = Array.from(
          document.getElementById("swal-input3").selectedOptions
        ).map((option) => parseInt(option.value, 10));
        if (!reportName || !reportUrl || selectedRoles.length === 0) {
          Swal.showValidationMessage("Please fill in all fields");
        }
        return { reportName, reportUrl, selectedRoles };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`${process.env.REACT_APP_SERVER}/api/reports`, {
          report_name: result.value.reportName,
          report_url: result.value.reportUrl,
          report_role: result.value.selectedRoles, // Send as a plain array
        })
        .then(response => {
          setReports([...reports, response.data]);
          Swal.fire("Added!", "Your report has been added.", "success");
        })
        .catch(error => {
          console.error("Error adding report:", error);
          Swal.fire("Error!", "Failed to add report.", "error");
        });
      }
    });
  };

  const handleDeleteReport = () => {
    Swal.fire({
      title: "Edit/Delete Reports",
      html: reports
        .map(
          (report, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span>${report.report_name}</span>
              <div>
                <button class="swal2-confirm swal2-styled" style="background-color: #007bff; margin-right: 5px;" data-index="${index}" data-action="edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="swal2-deny swal2-styled" style="background-color: #dc3545;" data-index="${index}" data-action="delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          `
        )
        .join(""),
      showCancelButton: true,
      cancelButtonText: "Close",
      showConfirmButton: false,
      didOpen: () => {
        const buttons = Swal.getPopup().querySelectorAll("button[data-action]");
        buttons.forEach((button) => {
          button.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            const action = e.target.dataset.action;
            if (action === "edit") {
              handleEditReport(index);
            } else if (action === "delete") {
              confirmDeleteReport(index);
            }
          });
        });
      },
    });
  };

  const handleEditReport = (index) => {
    const report = reports[index];
    Swal.fire({
        title: "Edit Report",
        html: `
            <div style="text-align: left;">
                <label for="swal-input1">Report Name:</label>
                <input id="swal-input1" class="swal2-input" placeholder="Enter report name" value="${report.report_name}">
                <label for="swal-input2">Report URL:</label>
                <input id="swal-input2" class="swal2-input" placeholder="Enter report URL" value="${report.report_url}">
                <label for="swal-input3">Roles:</label>
                <select id="swal-input3" class="swal2-select" multiple>
                    ${roles.map(role => `<option value="${role.id}" ${Array.isArray(report.report_role) && report.report_role.includes(role.id) ? "selected" : ""}>${role.role_name}</option>`).join('')}
                </select>
            </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Save Changes",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
      preConfirm: () => {
        const reportName = document.getElementById("swal-input1").value;
        const reportUrl = document.getElementById("swal-input2").value;
        const selectedRoles = Array.from(
          document.getElementById("swal-input3").selectedOptions
        ).map((option) => parseInt(option.value, 10)); // Parse to integer
        if (!reportName || !reportUrl || selectedRoles.length === 0) {
          Swal.showValidationMessage("Please fill in all fields");
        }
        return { reportName, reportUrl, selectedRoles };
      },
    }).then((result) => {
      if (result.isConfirmed) {
          console.log("Report ID:", report.id);
          console.log("Result Value:", result.value);
          axios.put(`${process.env.REACT_APP_SERVER}/api/reports/${report.id}`, {
            report_name: result.value.reportName,
            report_url: result.value.reportUrl,
            report_role: result.value.selectedRoles,
        })
          .then(response => {
              console.log("Response data:", response.data);
              const updatedReports = [...reports];
              updatedReports[index] = response.data;
              setReports(updatedReports);
              Swal.fire("Updated!", "Your report has been updated.", "success");
          })
        .catch(error => {
          console.error("Error updating report:", error);
          Swal.fire("Error!", "Failed to update report.", "error");
        });
      }
    });
  };

  const confirmDeleteReport = (index) => {
    const report = reports[index];
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${process.env.REACT_APP_SERVER}/api/reports/${report.id}`)
        .then(() => {
          const updatedReports = reports.filter((_, i) => i !== index);
          setReports(updatedReports);
          Swal.fire("Deleted!", "Your report has been deleted.", "success");
        })
        .catch(error => {
          console.error("Error deleting report:", error);
          Swal.fire("Error!", "Failed to delete report.", "error");
        });
      }
    });
  };

  return (
    <div className="reports-page">
      <div className="sidebar">
        <NavbarLocal />
      </div>
      <div className="main-content">
        <div
          className="top-image-container"
          style={{ top: "-45px", left: "-45px" }}
        ></div>
        <h2 className="reports-heading">Reports</h2>
        <div className="report-dropdown">
        <select value={selectedReport} onChange={handleReportChange}>
            <option value="">Select a Report</option>
            {reports && reports.length > 0 && reports.map((report) => (
            <option key={report.id} value={report.report_name}>
                {report.report_name}
            </option>
            ))}
        </select>
        </div>

        <div className="iframe-container">
          {reportUrl ? (
            <iframe
              src={reportUrl}
              title={selectedReport}
              width="100%"
              style={{ border: "none",position:"relative",
                top:"-150px",height:"100vh"}}
            />
          ) : (
            <div className="no-report-message">Select a report to view</div>
          )}
        </div>
        
        <div className="report-actions">
        {hasPermission(13) && (
          <button className="add-report-btn" onClick={handleAddReport}>
            <i className="fas fa-plus"></i> 
          </button>
        )}
        {hasPermission(14) && (
          <button className="delete-report-btn" onClick={handleDeleteReport}>
            <i className="fas fa-trash"></i> 
          </button>
        )}
        </div>
      </div>
    </div>
  );
};

export default Reports;