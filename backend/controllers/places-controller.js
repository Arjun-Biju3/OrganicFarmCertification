const { v4: uuidv4 } = require('uuid');
const {validationResult} = require('express-validator')

const HttError = require('../models/http-error')

let DUMMY_PLACES = [
    {
      id: 'p1',
      imageUrl: "https://imgcdn.stablediffusionweb.com/2024/3/15/936ea4ae-7b3d-4722-b5b7-9a29f5d15606.jpg",
      title: 'Beautiful Lake View',
      description: 'A breathtaking lake surrounded by mountains.',
      address: '123 Lakeview St, Mountain Town, Country',
      creator: 'u1',
      location: { lat: 40.748817, lng: -73.985428 }
    },
    {
        id: 'p4',
        imageUrl: "https://imgcdn.stablediffusionweb.com/2024/3/15/936ea4ae-7b3d-4722-b5b7-9a29f5d15606.jpg",
        title: 'Beautiful Lake View',
        description: 'A breathtaking lake surrounded by mountains.',
        address: '123 Lakeview St, Mountain Town, Country',
        creator: 'u1',
        location: { lat: 40.748817, lng: -73.985428 }
      },
    {
      id: 'p2',
      imageUrl: 'https://source.unsplash.com/400x300/?city,night',
      title: 'City Skyline at Night',
      description: 'A stunning view of the city lights from the rooftop.',
      address: '456 Downtown Blvd, Metropolis, Country',
      creator: 'u2',
      location: { lat: 34.052235, lng: -118.243683 }
    },
    {
      id: 'p3',
      imageUrl: 'https://source.unsplash.com/400x300/?forest,path',
      title: 'Peaceful Forest Walk',
      description: 'A quiet and scenic trail through dense woods.',
      address: '789 Woodland Trail, Green Valley, Country',
      creator: 'u3',
      location: { lat: 51.507351, lng: -0.127758 }
    }
  ];


const getPlaceById =  (req, res, next) => {
    const pid = req.params.pid;
    const place = DUMMY_PLACES.find(p => p.id === pid);
    
    if (!place) {
      throw new HttError("Could not find a place for the provided place id",404); 
    }
    
    res.json({ place });
  }


const getPlaceByUserId = (req, res, next) => {
    const uid = req.params.uid;
    const places = DUMMY_PLACES.filter(p => p.creator === uid);
    
    if (!places || places.length === 0) {
      throw new HttError("Could not find a places for the provided user id",404);
    }
    
    res.json({ places });
  }


const createPlaces = (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors);
      
      throw new HttError("Invalid inputs passed, please check your data",422)
    }
    const {title,description,coordinates,address,creator} = req.body;
    const createdPlace = {
        id:uuidv4(),
        title,
        description,
        location:coordinates,
        address,
        creator
    };
    DUMMY_PLACES.push(createdPlace)
    res.status(201).json({createdPlace});
}


const updatePlaceById = (req, res, next)=>{
  const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors);
      
      throw new HttError("Invalid inputs passed, please check your data",422)
    }
    const {title,description} = req.body;
    const pid = req.params.pid;
    const updatedPlace = {...DUMMY_PLACES.find(p=> p.id === pid)};
    const placeIndex = DUMMY_PLACES.findIndex(p=>p.id === pid)
    updatedPlace.title = title;
    updatedPlace.description = description;
    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({updatedPlace});
}

const deletePlaceById = (req, res, next)=>{
    const pid = req.params.pid;
    if(!DUMMY_PLACES.find(p=>p.id === pid)){
      throw new HttError("Could not find a place for that id",401)
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p=>p.id !== pid)
    res.status(200).json({message:'deleted place'})
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlaces = createPlaces;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;