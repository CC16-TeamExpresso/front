import React, { useEffect, useState } from 'react';
import './Profile.css';
import Post from '../Feed/Post';

let BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8050"

export default function Profile(props : any) {
	const [user, setUser] = useState("");
	const [feedUsers, setFeedUsers] = useState([]);


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
			  console.log();
			});
		}
		const fail = () => {
		  alert("Please turn on GPS");
		}
		navigator.geolocation.getCurrentPosition(success, fail);
	  },[])

	return (
		<div className='App'>
	
				<h1 className='posthistory-title'>{user}'s post history</h1>
				<div className='history-feed'>
				{feedUsers.map((feedUser : any) => {
          return <Post username={feedUser.username} uri={feedUser.post.uri}/>
        }) }

				</div>
				<div className='profile-info-box'>

		
			</div>
		</div>
	);
}
