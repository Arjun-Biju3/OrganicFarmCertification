const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Place = require('../models/place');
const User = require('../models/user')



const getPlaceById = async (req, res, next) => {
    const pid = req.params.pid;
    let place;
  try{
     place = await Place.findById(pid);
  }
  catch(err){
    return next(new HttpError('Something went wrong, could not find a place.',500));
  }

    if (!place) { 
      return next(new HttpError("Could not find a place for the provided place id",404));
    }
    
    res.json({ place:place.toObject({getters:true}) });
  }


const getPlaceByUserId = async (req, res, next) => {
    const uid = req.params.uid;
    let places
   try{
     places =await Place.find({creator:uid});
   }
   catch(err){
      return next(new HttpError("Could not find a place for the provided user id",500));
   }
    if (!places || places.length === 0) {
      return next(new HttpError("Could not find a places for the provided user id",404));
    }
    
    res.json({ places:places.map(place=>place.toObject({getters:true})) });
  }


const createPlaces = async (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors);
      return next(new HttpError("Invalid inputs passed, please check your data",422))
    }
    const {title,description,coordinates,address,creator} = req.body;
    const createdPlace = new Place({
      title,
      description,
      address,
      location:coordinates,
      image:"https://www.google.com/imgres?q=nature%20images&imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fthumbnails%2F049%2F855%2F296%2Fsmall_2x%2Fnature-background-high-resolution-wallpaper-for-a-serene-and-stunning-view-photo.jpg&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Ffree-photos%2F4k-nature&docid=QPoY9d5rgesGjM&tbnid=2F16SnveSNiQEM&vet=12ahUKEwiktdy5ju6LAxX3nK8BHZarCWgQM3oECDQQAA..i&w=714&h=400&hcb=2&ved=2ahUKEwiktdy5ju6LAxX3nK8BHZarCWgQM3oECDQQAA",
      creator
    });


    let user;
    try{
      user = await User.findById(creator)
    }
    catch(error){
      return next(new HttpError('creating place failed, please try again',500));
    }


    if(!user){
      return next(new HttpError("could not find user for provided id",404));
    }

    try{
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdPlace.save({session:sess});
      user.places.push(createdPlace);
      await user.save({session:sess});
      sess.commitTransaction();
    }
    catch(err){
      return next(new HttpError('creating place failed, please try again.',500));
    }

    res.status(201).json({createdPlace});
}


const updatePlaceById =async (req, res, next)=>{
  const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors);
      
      throw new HttpError("Invalid inputs passed, please check your data",422)
    }
    const {title,description} = req.body;
    const pid = req.params.pid;
    
    let place;
    try{
      place = await Place.findById(pid);
    }
    catch(error){
      return next(new HttpError('Something went wrong, please try again.',500));
    }

    place.title = title;
    place.description = description;
    
    try{
      await place.save();
    }
    catch(error){
      return next(new HttpError('Something went wrong, please try again.',500));
    }
    res.status(200).json({place:place.toObject({getters:true})});
}


const deletePlaceById = async (req, res, next) => {
  const pid = req.params.pid;
  let place;

  try {
    place = await Place.findById(pid).populate('creator');
    if (!place) {
      return next(new HttpError("Could not find a place with the provided ID.", 404));
    }
  } catch (error) {
    return next(new HttpError("Something went wrong, could not find the place.", 500));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    
    
    await place.deleteOne({ session: sess });


    if (place.creator) {
      place.creator.places.pull(place);
      await place.creator.save({ session: sess });
    }

    await sess.commitTransaction();
    sess.endSession(); 
  } catch (error) {
    return next(new HttpError("Something went wrong. Unable to delete, please try again.", 500));
  }

  res.status(200).json({ message: "Deleted place successfully" });
};


exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlaces = createPlaces;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;