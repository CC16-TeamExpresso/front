import React, { useEffect, useState } from 'react';
import './Profile.css';
import Post from '../Feed/Post';

let BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8050"



interface IUser {
	username:string,
	post: Array<Ipost>
}

interface Ipost {
	uri: string
}

export default function Profile(props:any) {
	const [user, setUser] = useState("");
	const [feedUsers, setFeedUsers] = useState([]);





	useEffect(() => {
		
	
	
		 
		  fetch(BACKEND_URL+"/api/usergps", {
			method: "PATCH",
			headers: {
			  'Content-Type': 'application/json',
			  'token': localStorage.getItem('token') || '',
			},
			}
		  )
			.then(res => res.json())
			.then(data => {
			  setUser(data.user);

			  return fetch(BACKEND_URL+"/api/post", {
				method:"GET",
				headers: {
				  'Content-Type': 'application/json',
				  'token': localStorage.getItem('token') || '',
				}
			  })
			})
			.then(res => res.json())
			.then(data => {
			  setFeedUsers(data.result[0].post.reverse())
			console.log(feedUsers)

			});
			
			

	  },[] 
	  )

	return (
		<div className='App'>
	
				<h1 className='posthistory-title'>{user}'s post history</h1>
				<div className='history-feed'>
				{feedUsers.map((feedUser:any) => {
				
          return <Post username={user} uri={feedUser.uri}/>
        }) }	

				</div>
				<div className='profile-info-box'>

		
			</div>
		</div>
	);
}