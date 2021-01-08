import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import logo from '../images/logo.png';
declare module '*.png';

export default function Home() {
	return (
		<div className="App">
			<img className="logo " src={logo} alt="logo"></img>
			<header className="App-header">
				<h1 className="title">Peekify</h1>
				<div className="buttons">
					<Link className="login-button" to="/login">
						Login
					</Link>
					<br />
					<Link className="register-button" to="/register">
						Register
					</Link>
				</div>
			</header>
		</div>
	);
}
