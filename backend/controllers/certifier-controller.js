const mongoose = require('mongoose');
const fs = require('fs');

const HttpError = require('../models/http-error');
const Application = require('../models/application');
const User = require('../models/user');




const getApplications = async (req, res, next) => {
  try {
    const pendingApplications = await Application.find({ status: "Inspected" });
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
  
      if (!details) {
        return next(new HttpError("Application not found.", 404));
      }
  
      res.json({ application: details.toObject({ getters: true }) });
    } catch (error) {
      return next(new HttpError("Fetching application failed, please try again later.", 500));
    }
  };
  
  const updateStatus = async (req, res, next) => {
    const { appId } = req.params;
    let { accepted, toYear, remarks } = req.body; 

    try {
        console.log("Received request body:", req.body);

        
        if (toYear) {
            const parsedDate = new Date(toYear); // Convert string to Date
            toYear = isNaN(parsedDate.getTime()) ? null : parsedDate; // Ensure valid date
        }

       
        const userId = req.userData?.userId;

      
        if (!mongoose.Types.ObjectId.isValid(appId)) {
            return res.status(400).json({ message: "Invalid application ID." });
        }

        // Find the application
        const application = await Application.findById(appId);
        if (!application) {
            return res.status(404).json({ message: "Application not found." });
        }

        // Ensure certification field exists
        if (!application.certification) {
            application.certification = {};
        }

        if (accepted) {
            application.status = "Certified";
            application.certification = {
                certifier: userId,
                fromYear: new Date(),
                toYear: toYear || null, 
                certificationDate: new Date(),
                status: "Certified",
                remarks,
            };
        } else {
            application.status = "Rejected";
            application.certification = {
                certifier: userId,
                fromYear: null,
                certificationDate: null,
                toYear: null,
                status: "Rejected",
                remarks,
            };
        }

        console.log("Updated application data:", application);

        await application.save();

        res.status(200).json({
            message: "Certification status updated successfully.",
            application,
        });
    } catch (err) {
        console.error("Error updating certification status:", err);
        res.status(500).json({
            message: "Updating certification status failed.",
            error: err.message,
        });
    }
};




exports.getApplications = getApplications;
exports.getDetailsById = getDetailsById;
exports.updateStatus = updateStatus;