import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Map from "../../shared/components/UIElements/Map";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./ViewApplicationDetails.css";
import { AuthContext } from "../../shared/context/AuthContext";

function ViewApplicationDetails() {
  const navigate = useNavigate();
  const ApplicationId = useParams().ApplicationId;
  const { isLoading, sendRequest, error, clearError } = useHttpClient();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [decision, setDecision] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/inspector/details/${ApplicationId}`,
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
  }, [sendRequest, ApplicationId, auth.token]);

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
      accepted: decision === "Approved",
      remarks: decision === "Approved" ? remarks : rejectionReason,
    };
    
    try {
      await sendRequest(
        `http://localhost:5000/api/inspector/changeStatus/${ApplicationId}`,
        "PATCH",
        JSON.stringify(requestBody),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      alert("Status updated successfully!");
      navigate('/');
    } catch (err) {
      console.error("Error updating application status:", err);
      alert("Failed to update status.");
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
            <p><strong>Field ID:</strong> {selectedApplication.fieldId}</p>
            <p><strong>Owner:</strong> {selectedApplication.owner}</p>
            <p><strong>Address:</strong> {selectedApplication.address}</p>
            <p><strong>Requirement:</strong> {selectedApplication.requirement}</p>
            <p><strong>Standard:</strong> {selectedApplication.standard}</p>
            <p><strong>Crop:</strong> {selectedApplication.crop}</p>
            <p><strong>Extent:</strong> {selectedApplication.extent}</p>
            <p><strong>Previous Crop Measures:</strong> {selectedApplication.previousCropMeasures}</p>
            <p><strong>Seed Source:</strong> {selectedApplication.seed}</p>
            <p><strong>Protection Methods:</strong> {selectedApplication.protect}</p>
            <p><strong>Soil Type:</strong> {selectedApplication.soilType}</p>
            <p><strong>Manure:</strong> {selectedApplication.manure}</p>
            {selectedApplication.inspection?.status && (
          
            <p><strong>Inspection remark:</strong> {selectedApplication.inspection.remarks}</p>
          
            )}

     
          {selectedApplication.certification?.status && (
            
            
              <p><strong>Certification remark: </strong>{selectedApplication.certification.remarks}</p>
          
          )}

          </div>
        </Card>
      </div>

      
      
      {/* Inspection Form - Show only if not inspected */}
      {!selectedApplication.inspection?.status && (
        <div className="inspection-form">
          <h2>Inspection Form</h2>
          <form onSubmit={submitHandler}>
            <label>Decision:</label>
            <select value={decision} onChange={(e) => setDecision(e.target.value)} required>
              <option value="">Select Decision</option>
              <option value="Approved">Approve</option>
              <option value="Rejected">Reject</option>
            </select>

            {decision === "Rejected" && (
              <>
                <label>Rejection Reason:</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                ></textarea>
              </>
            )}

            {decision === "Approved" && (
              <>
                <label>Remarks:</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  required
                ></textarea>
              </>
            )}

            <br /><br />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ViewApplicationDetails;