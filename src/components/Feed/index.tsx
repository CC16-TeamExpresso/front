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

  //for test
  // const [feedUsers, setFeedUsers] = useState([
  //   {username:"test1", post:{uri: "track/5Hu29JT4xtbRUBTZeOAjxW", _id: "test1"}},
  //   {username:"test2", post:{uri: "track/10Nmj3JCNoMeBQ87uw5j8k", _id: "test2"}}
  // ]);

  
  useEffect(() => {
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
          return <Post username={feedUser.username} uri={feedUser.post.uri} id={feedUser.post._id}/>
        }) }
      </div>
      
    </div>
  );
}

export default Feed;
