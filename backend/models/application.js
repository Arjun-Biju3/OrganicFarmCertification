const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  fieldId: { type: String, required: true, unique: true }, 
  owner: { type: String, required: true }, 
  address: { type: String, required: true }, 
  place: {
    latitude: { type: Number, required: true }, 
    longitude: { type: Number, required: true } 
  },
  requirement: { type: String, required: true }, 
  standard: { type: String, required: true }, 
  status: { type: String, enum: ["Pending", "Inspected", "Certified", "Rejected"], default: "Pending" }, 
  crop: { type: String, required: true }, 
  extent: { type: String, required: true }, 
  previousCropMeasures: { type: String }, 
  seed: { type: String, required: true }, 
  protect: { type: String }, 
  soilType: { type: String, required: true }, 
  manure: { type: String, required: true }, 
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  createdAt: { type: Date, default: Date.now }, 
  
  
  inspection: {
    inspector: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    inspectionDate: { type: Date }, 
    status: { type: String, enum: ["Accepted", "Rejected"] }, 
    remarks: { type: String }
  },

  certification: {
    certifier: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    fromYear: { type: Date }, 
    toYear: { type: Date }, 
    certificationDate: { type: Date}, 
    status: { type: String, enum: ["Certified", "Rejected"] },
    remarks:{type:String}
  }
});

module.exports = mongoose.model("Application", applicationSchema);
