import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Map from "../../shared/components/UIElements/Map";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/AuthContext";
import "./ViewApplicationDetails.css";

function ViewApplicationDetailsCertifier() {
  const { ApplicationId } = useParams();
  const navigate = useNavigate();
  const { isLoading, sendRequest, error, clearError } = useHttpClient();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [decision, setDecision] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [certifierName, setCertifierName] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [certifierRemarks, setCertifierRemarks] = useState(""); 
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const responseData = await sendRequest(
          `https://organicfarmcertification.onrender.com/api/certifier/details/${ApplicationId}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setSelectedApplication(responseData.application);
      } catch (err) {
        console.error("Error fetching application:", err);
      }
    };
    fetchApplication();
  }, [sendRequest, ApplicationId]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!selectedApplication) {
    return (
      <div className="center">
        <Card>
          <h2>No application found for ID: {ApplicationId}</h2>
        </Card>
      </div>
    );
  }

  const selectedLocation = {
    lat: selectedApplication.place.latitude,
    lng: selectedApplication.place.longitude,
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const requestBody = {
      accepted: decision === "Accepted",
      toYear:decision === "Accepted"?toYear:null,
      remarks: decision === "Rejected" ? rejectionReason : certifierRemarks, 
    };
    try {
      await sendRequest(
        `https://organicfarmcertification.onrender.com/api/certifier/changeStatus/${ApplicationId}`,
        "PATCH",
        JSON.stringify(requestBody),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      alert("Certification status updated successfully!");
      navigate("/");
    } catch (err) {
      alert("Failed to update certification status.");
    }
  };

  return (
    <div className="application-details-container">
      <ErrorModal error={error} onClear={clearError} />
      <div className="map-and-details">
        <div className="map-container">
          <h3>Location of Field</h3>
          <Map center={selectedLocation} zoom={16} marker={selectedLocation} />
        </div>

        <Card className="application-card">
          <div className="application-details__info">
            <h2>Field ID: {selectedApplication.fieldId}</h2>
            <h3>Owner: {selectedApplication.owner}</h3>
            <p><strong>Address:</strong> {selectedApplication.address}</p>
            <p><strong>Requirement:</strong> {selectedApplication.requirement}</p>
            <p><strong>Crop:</strong> {selectedApplication.crop}</p>
            <p><strong>Extent:</strong> {selectedApplication.extent}</p>
            <p><strong>Soil Type:</strong> {selectedApplication.soilType}</p>
          </div>
        </Card>
      </div>

      <div className="inspection-details">
        <h2>Inspection Details</h2>
        <Card>
          <p><strong>Inspector Name:</strong> {selectedApplication.inspection?.inspector?.name}</p>
          <p><strong>Inspection Date:</strong> {new Date(selectedApplication.inspection.inspectionDate).toDateString()}</p>
          <p><strong>Remarks:</strong> {selectedApplication.inspection.remarks}</p>
        </Card>
      </div>

      <div className="certification-form">
        <h2>Certifier Decision</h2>
        <form onSubmit={submitHandler}>
          <label>Decision:</label>
          <select value={decision} onChange={(e) => setDecision(e.target.value)} required>
            <option value="">Select Decision</option>
            <option value="Accepted">Accept & Certify</option>
            <option value="Rejected">Reject</option>
          </select>

          {decision === "Rejected" && (
            <>
              <label>Rejection Reason:</label>
              <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} required></textarea>
            </>
          )}

          {decision === "Accepted" && (
            <>
              <label>To Year:</label>
              <input type="date" value={toYear} onChange={(e) => setToYear(e.target.value)} required min={fromYear || 2024} />

              <label>Remarks:</label>
              <textarea value={certifierRemarks} onChange={(e) => setCertifierRemarks(e.target.value)} required></textarea>
            </>
          )}
          <br /><br />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}

export default ViewApplicationDetailsCertifier;
