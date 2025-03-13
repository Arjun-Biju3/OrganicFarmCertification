const {validationResult} = require('express-validator');
const mongoose = require('mongoose');
const fs = require('fs');

const HttpError = require('../models/http-error');
const Application = require('../models/application');
const User = require('../models/user');
const { log } = require('console');



const getApplications = async (req, res, next) => {
  try {
    const pendingApplications = await Application.find({ status: "Pending" });
    if (!pendingApplications.length) {
      return res.status(404).json({ message: "No pending applications found." });
    }
    res.status(200).json({ applications: pendingApplications });
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    res.status(500).json({ message: "Fetching applications failed. Please try again later." });
  }
};


const getDetailsById = async (req, res, next) => {
  const appId = req.params.appId;
  let details;

  try {
    details = await Application.findById(appId).populate("inspection.inspector");
  } catch (error) {
    return next(new HttpError("Fetching application failed, please try again later.", 500));
  }

  if (!details) {
    return next(new HttpError("Application not found.", 404));
  }

  res.json({ application: details.toObject({ getters: true }) });
};


const updateStatus = async (req, res, next) => {
  const { appId } = req.params;
  const { accepted, remarks } = req.body;

  try {
   
    const userId = req.userData.userId;

   
    const application = await Application.findById(appId);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Update application status
    application.status = accepted ? "Inspected" : "Rejected";

    // Update embedded Inspection data
    application.inspection = {
      inspector: userId, 
      inspectionDate: new Date(), 
      status: accepted ? "Accepted" : "Rejected",
      remarks,
    };

    await application.save();

    res.status(200).json({
      message: "Application status updated and inspection recorded.",
      application,
    });
  } catch (err) {
    res.status(500).json({
      message: "Updating status failed.",
      error: err.message,
    });
  }
};

const getDetailsByFieldId = async (req, res, next) => {
  const fieldId = req.params.fieldId; 
  let details;

  try {
    details = await Application.findOne({ fieldId }).populate("inspection.inspector");
  } catch (error) {
    return next(new HttpError("Fetching application failed, please try again later.", 500));
  }

  if (!details) {
    return next(new HttpError("Application not found.", 404));
  }

  res.json({ application: details.toObject({ getters: true }) });
};





exports.getApplications = getApplications;
exports.getDetailsById = getDetailsById;
exports.updateStatus = updateStatus;
exports.getDetailsByFieldId = getDetailsByFieldId;