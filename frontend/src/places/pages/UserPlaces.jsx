import React from 'react'
import {useParams} from 'react-router-dom'
import PlaceList from '../components/PlaceList'

const DUMMY_PLACES = [
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


function UserPlaces() {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(place=>place.creator === userId)
  return (
   
   <PlaceList items={loadedPlaces}/>
  )
}

export default UserPlaces
