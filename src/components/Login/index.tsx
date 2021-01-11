import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';
import './login.css';
import { apiCall } from '../../utility';
import logo from '../images/logo.png';
declare module '*.png';

export default function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const history = useHistory();

	async function loginUser() {
		const res = await apiCall('/login', { email, password });

		if (res.status === 'ok') {
			localStorage.setItem('token', res.data); //I might change it to "refresh token"
			alert('You are logged in');
			history.push('/feed'); //the user is pushed to the feeed page once they are logged in
		} else {
			alert(res.error); //error property if login not successful
		}
	}

	return (
		<div className="Login">
			<img className="logo " src={logo} alt="logo"></img>
			<div className="title">Peekify</div>
			<label className="password">
				Email
				<br />
				<input
					type="text"
					className="email-field"
					placeholder="you@email.com"
					value={email}
					onChange={(e: any) => setEmail(e.target.value)}
				></input>
			</label>
			<label className="password">
				Password
				<br />
				<input
					type="password"
					className="password-field"
					value={password}
					onChange={(e: any) => setPassword(e.target.value)}
					placeholder="password"
				></input>
			</label>
			<br />
			<button className="login-button" onClick={loginUser}>
				Login
			</button>
		</div>
	);
}
