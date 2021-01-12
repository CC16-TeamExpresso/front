import React, { useEffect } from 'react';
import { useState } from 'react';
import Post from './Post';
import { Link } from 'react-router-dom';

import '../App.css';
import './Feed.css';
import Spotify from './Spotify';
import logo from '../images/logo.png';
declare module '*.png';

function Feed() {
  const [user, setUser] = useState("");
  const [feedUsers, setFeedUsers] = useState([]);
  useEffect(() => {
    const success = (pos: any) => {
      console.log("success");
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      fetch("http://localhost:8050/api/usergps",{
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
          return fetch("http://localhost:8050/api/user",{
            method:"GET",
            headers: {
              'Content-Type': 'application/json',
              'token': localStorage.getItem('token') || '',
            }
          })
        })
        .then(res => res.json())
        .then(data => {
          setFeedUsers(data.result)
          console.log(data);
        });
    }
    const fail = () => {
      alert("Please turn on GPS");
    }
    navigator.geolocation.getCurrentPosition(success, fail);
  },[])
  return (
    <div className="App">
    		<Link className="profile-link" to="/Profile">
						Profile
				</Link>
      <img className="logo" src={logo} alt='logo'></img>
      <h1>{user}</h1>
      <Spotify />
      <div className='feed' >
        {feedUsers.map((feedUser : any) => {
          return <Post username={feedUser.username} uri={feedUser.post.uri}/>
        }) }
      </div>
      
    </div>
  );
}

export default Feed;
