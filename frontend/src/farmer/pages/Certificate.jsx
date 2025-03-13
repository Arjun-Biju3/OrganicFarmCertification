import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/AuthContext";
import "./Certificate.css";
import logo from "../../assets/images/logo.jpg";

const Certificate = () => {
  const { id } = useParams(); 
  const { isLoading, sendRequest, error } = useHttpClient();
  const [certificateData, setCertificateData] = useState(null);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const responseData = await sendRequest(
          `https://organicfarmcertification.onrender.com/api/users/application/${id}`, 
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setCertificateData(responseData.application);
      } catch (err) {
        console.error("Error fetching certificate data:", err);
      }
    };

    if (auth.token) {
      fetchCertificate();
    }
  }, [sendRequest, id, auth.token]);

  
  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <p>Loading certificate...</p>;
  }

  if (!certificateData || certificateData.status !== "Certified") {
    return <p>No certificate found for this ID.</p>;
  }

  return (
    <>
      <div className="certificate-container" id="certificate-content">
        <div className="certificate-header">
          <img src={logo} alt="Certification Logo" className="certificate-logo" />
          <h1>Organic Farm Certificate</h1>
        </div>
        <div className="certificate-body">
          <p>This is to certify that</p>
          <h2>{certificateData.owner}</h2>
          <p>has successfully met the requirements of organic farming and is hereby awarded this certification.</p>
  
          <p><strong>Field ID:</strong> {certificateData.fieldId}</p>
          <p><strong>Certification Date:</strong> {new Date(certificateData.certification.certificationDate).toLocaleDateString()}</p>
          <p><strong>Valid Until:</strong> {new Date(certificateData.certification.toYear).toLocaleDateString()}</p>
        </div>
        <div className="certificate-footer">
          <div className="signature">
            <p>_________________________</p>
            <p>{certificateData.certification.certifier.name}</p>
            <p>Authorized Certifier</p>
          </div>
        </div>
      </div>
  
     
      <div className="print-button-container">
        <button onClick={handlePrint} className="print-button">Print Certificate</button>
      </div>
    </>
  );
  
};

export default Certificate;
