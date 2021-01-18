import React, { useEffect } from 'react';
import { useState } from 'react';
import Post from './Post';
import { Link } from 'react-router-dom';

import '../App.css';
import './Feed.css';
import Spotify from './Spotify';
import logo from '../images/logo.png';
require('dotenv').config();

declare module '*.png';

let BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8050"

function Feed() {
  const [user, setUser] = useState("");
  const [feedUsers, setFeedUsers] = useState([]);
  const [distance, setDistance] = useState(0);
  const inputDistanceArea: any = document.getElementById("inputDistance");
  const success = (pos: any) => {
    console.log("success");
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    fetch(BACKEND_URL+"/api/usergps", {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token') || '',
      },
      body: JSON.stringify({
        lat: lat,
        lng: lng
        })
      }
    )
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        return fetch(BACKEND_URL+"/api/user", {
          method:"GET",
          headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token') || '',
          }
        })
      })
      .then(res => res.json())
      .then(data => {
        setFeedUsers(data.result);
      });
  }
  const fail = () => {
    alert("Please turn on GPS");
  }
  
  const updateLocation = () => {
    inputDistanceArea.value = "";
    navigator.geolocation.getCurrentPosition(success, fail);
  }

  const inputDistance = (e: any) => {
    setDistance(Number(e.target.value));
  }

  
  const filterUsers = () => {
    if (isNaN(distance)) {
      alert("please input integer");
    } else {
      fetch(`${BACKEND_URL}/api/user/filter?km=${distance}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token') || '',
        }
      })
        .then(res => res.json())
        .then(data => {
          setFeedUsers(data.result);
        })
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, fail);
  },[])
  return (
    <div className="App">
      <div className='profile-wrapper'>
      <div className='update-location-container'>
        <button className='update-location-button' onClick={updateLocation}>Update location</button>
        <button className='filter-button'onClick={filterUsers}>filter</button>
        <input className='update-location-input'id="inputDistance" type="text" onChange={inputDistance} placeholder='KM Radius'/>

      </div>
    		<Link className="profile-link" to="/Profile">
						Profile
				</Link>
      </div>
      <img className="logo" src={logo} alt='logo'></img>
      <h1>{user}</h1>
      <Spotify />

      <div className='feed' >
        {feedUsers.map((feedUser : any) => {
          return <Post username={feedUser.username} uri={feedUser.post.uri} id={feedUser.post._id} like={feedUser.post.like}/>
        }) }
      </div>
      
    </div>
  );
}

export default Feed;
