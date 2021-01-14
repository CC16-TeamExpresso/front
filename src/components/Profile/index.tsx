import React, { useEffect, useState } from 'react';
import './Profile.css';
import Post from '../Feed/Post';
import logo from '../images/logo.png';
require('dotenv').config();
declare module '*.png';

let BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8050"

export default function Profile() {
	const [historyFeed, setHistoryFeed] = useState([]);
	
	useEffect(() => {
		const test = () => {
			return fetch(BACKEND_URL+"/api/post",{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"token": localStorage.getItem("token") || "",
				}
			})
			.then(res => res.json())
			.then(data => {
				setHistoryFeed(data);
				console.log(data);
			});
		}
		test();
	},[]);

	return (
		<div className='App'>
			<img className='logo' src={logo} alt='logo' />
				<div className='your-peekify'>
					your-peekify
				</div>
			<div className='history-feed'>
				{historyFeed.map((feed : any) =>{
					return <Post username={feed.username} uri={feed.post.uri} />;
				})}


			</div>

		</div>
	);
}
