import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import Post from './Post';
import '../App.css';
import './Feed.css';
import Spotify from './Spotify';
import logo from '../images/logo.png';
declare module '*.png';

function Feed() {
	const [user, setUser] = useState('');
	const [lat, setLat] = useState(35.681236);
	const [lng, setLng] = useState(139.767124);

	useEffect(() => {
		const success = (pos: any) => {
			console.log('success');
			const lat = pos.coords.latitude;
			const lng = pos.coords.longitude;
			setLat(lat);
			setLng(lng);
			fetch('http://localhost:8050/api/test', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					token: localStorage.getItem('token') || '',
				},
				body: JSON.stringify({
					lat: lat,
					lng: lng,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					setUser(data.user.email);
				});
		};
		const fail = () => {
			console.log('sipai');
		};
		navigator.geolocation.getCurrentPosition(success, fail);
	}, []);
	return (
		<div className="App">
			<img className="logo" src={logo} alt="logo"></img>
			<h1>{user}</h1>
			<div className="feed">
				<Post />
				<Spotify />
			</div>
		</div>
	);
}

export default Feed;
