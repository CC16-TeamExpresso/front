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
  const [showMenu, setShowMenu] = useState(false)



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
    // inputDistanceArea.value = "";
    // navigator.geolocation.getCurrentPosition(success, fail);
    //change to reload, because of websocket things
    window.location.reload();
  }

  const inputDistance = (e: any) => {
    setDistance(Number(e.target.value));
  }

  const showFriends = () => {
    fetch(`${BACKEND_URL}/api/follow`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token') || ''
      }
    })
     .then(res => res.json())
     .then(data => {
       setFeedUsers(data.result);
     })
  }
  
  const filterUsers = () => {
    if (isNaN(distance)) {
      alert("please input integer");
    } else {
      const users = feedUsers;
      setFeedUsers(users.filter((user: any) => user.distance <= distance));
      // fetch(`${BACKEND_URL}/api/user/filter?km=${distance}`, {
      //   method: "GET",
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'token': localStorage.getItem('token') || '',
      //   }
      // })
      //   .then(res => res.json())
      //   .then(data => {
      //     setFeedUsers(data.result);
      //   })
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, fail);
  },[])

 const handleMenu = () => {
    setShowMenu(!showMenu)
  } 


  return (
    <div className="App">

      <div  className="dropdown">
            <span onClick={handleMenu}>Menu</span>
            {showMenu ?(
            <div className="dropdown-content">
    		<Link className="profile-link-phone" to="/Profile">Profile</Link>
        <button className='update-location-button-phone' onClick={updateLocation}>Refresh</button>
        <button className='update-location-button-phone' onClick={showFriends}>Show frinends</button>
        <button className='filter-button-phone'onClick={filterUsers}>range</button>
        <input className='update-location-input-phone'id="inputDistance" type="text" onChange={inputDistance} placeholder='KM Radius'/>

          </div>):<div className='nothing'></div>}
          
      <div>

            </div>
            </div>
      <div className='profile-wrapper'>
      <div className='update-location-container'>
        <button className='update-location-button' onClick={updateLocation}>Refresh</button>
        <button className='update-location-button' onClick={showFriends}>Show friends</button>
        <button className='filter-button'onClick={filterUsers}>range</button>
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
          return <Post username={feedUser.username} userid={feedUser.userid} uri={feedUser.post.uri} id={feedUser.post._id} like={feedUser.post.like}/>
        }) }
      </div>
      
    </div>
  );
}

export default Feed;
