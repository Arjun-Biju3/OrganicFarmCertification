import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/AuthContext";
import "./ApplicationDetails.css";

function ApplicationDetails() {
  const { appId } = useParams(); 
  const { isLoading, sendRequest, error, clearError } = useHttpClient();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/application/${appId}`,
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

    if (auth.token) {
      fetchApplication();
    }
  }, [sendRequest, appId, auth.token]);

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
          <h2>No application found for ID: {appId}</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="application-details">
      <ErrorModal error={error} onClear={clearError} />
      <Card className="application-details__content">
        <div
          className={`application-details__status ${selectedApplication.status.toLowerCase()}`}
        >
          {selectedApplication.status}
        </div>
        <div className="application-details__info">
          <h2>Field ID: {selectedApplication.fieldId}</h2>
         <p> <strong>Owner:</strong> {selectedApplication.owner}</p>
          <p><strong>Address:</strong> {selectedApplication.address}</p>
          <p>
            <strong>Requirement:</strong> {selectedApplication.requirement}
          </p>
          <p>
            <strong>Standard:</strong> {selectedApplication.standard}
          </p>
          <p>
            <strong>Crop:</strong> {selectedApplication.crop}
          </p>
          <p>
            <strong>Extent:</strong> {selectedApplication.extent}
          </p>
          <p>
            <strong>Previous Crop Measures:</strong>{" "}
            {selectedApplication.previousCropMeasures}
          </p>
          <p>
            <strong>Seed Source:</strong> {selectedApplication.seed}
          </p>
          <p>
            <strong>Protection Methods:</strong> {selectedApplication.protect}
          </p>
          <p>
            <strong>Soil Type:</strong> {selectedApplication.soilType}
          </p>
          <p>
            <strong>Manure:</strong> {selectedApplication.manure}
          </p>
          <p>
            
          {selectedApplication.status === "Inspected" && (
          <>
            <strong>Inspection Remarks:</strong> {selectedApplication.inspection.remarks}
          </>
        )}

          {selectedApplication.status === "Rejected" && (
          <>
            <strong>Inspection Remarks:</strong> {selectedApplication.inspection.remarks}
          </>
        )}
    <br />
{selectedApplication.certification && (
  <>
    {(selectedApplication.certification.status === "Certified" ||
      selectedApplication.certification.status === "Rejected") && (
      <>
        <strong>Certification Remarks:</strong> {selectedApplication.certification.remarks}
      </>
    )}
  </>
)}


          </p>

        </div>
        <Button to="/">Back</Button>
        {selectedApplication.status === "Certified" && <Link to={`/certificate/${selectedApplication._id}`}><Button>Certificate</Button></Link>}
      </Card>
    </div>
  );
}

export default ApplicationDetails;
