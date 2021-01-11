import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './register.css';
import { apiCall } from '../../utility';
import './register.css';
import logo from '../images/logo.png';
declare module '*.png';

export default function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const history = useHistory();


	async function registerUser() {
		const res = await apiCall('/register', { email, password });

		if (res.status ==='ok'){
			alert("Email and Password registered successfully")
			history.push('/login');
		} else {
			alert(res.error)
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
					//I used "any" as a work arount for the type system
					//define the typings for the class could be :
					// onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
					// onkeypress: (event: React.KeyboardEvent<HTMLInputElement>) => void
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
			<button className="register-button" onClick={registerUser}>
				Register
			</button>
		</div>
	);
}
