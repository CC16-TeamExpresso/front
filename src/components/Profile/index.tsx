import React, { useEffect, useState } from 'react';
import './Profile.css';
import Post from '../Feed/Post';
import { useHistory } from 'react-router-dom';
import logo from '../images/logo.png';

declare module '*.png';
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
				console.log(data);
				if(data.result.length !== 0){
                    setFeedUsers(data.result[0].post.reverse())
				}
				console.log(feedUsers);
			});
					

	  },[] 
	  )

	  const history = useHistory();
	  //onsole.log("index.tsx line 59 feedUser is " + feedUsers)

	return (
		<div className='App'>
			    <button className='goback-button' onClick={() => history.goBack()}>Go Back</button>		
      <img className="logo" src={logo} alt='logo'></img>
    			<h1 className='posthistory-title'>{user}'s post history</h1>
				<div className='history-feed'>
				{feedUsers.map((feedUser:any) => {
		  return <Post isHistory={true} username={user} uri={feedUser.uri} id={feedUser._id} like={feedUser.like} />
        }) }	

				</div>
				<div className='profile-info-box'>

		
			</div>
		</div>
	);
}