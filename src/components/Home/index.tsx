import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import logo from '../images/logo.png';
import { useEffect, useState } from 'react';
declare module '*.png';

let deferredPrompt: any;

export default function Home() {
	const [installable, setInstallable] = useState(false);

	useEffect(() => {
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', function () {
				navigator.serviceWorker.register('../sw.js').then(
					function (registration) {
						// Registration was successful
						console.log('ServiceWorker registration successful with scope: ', registration.scope);
					},
					function (err) {
						// registration failed :(
						console.log('ServiceWorker registration failed: ', err);
					}
				);
			});
		}

		window.addEventListener('beforeinstallprompt', (e: any) => {
			// Prevent the mini-infobar from appearing on mobile
			e.preventDefault();
			// Stash the event so it can be triggered later.
			deferredPrompt = e;
			// Update UI notify the user they can install the PWA
			setInstallable(true);
		});

		window.addEventListener('appinstalled', () => {
			// Log install to analytics
			console.log('INSTALL: Success');
		});
	}, []);

	const handleInstallClick = (e: any) => {
		// Hide the app provided install promotion
		setInstallable(true);
		// Show the install prompt
		deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
		deferredPrompt.userChoice.then((choiceResult: any) => {
			if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the install prompt');
			} else {
				console.log('User dismissed the install prompt');
			}
		});
	};

	return (
		<div className="App">
			{installable && (
				<button className="install-button" onClick={handleInstallClick}>
					install
				</button>
			)}
			<img className="logo" src={logo} alt="logo" onClick={handleInstallClick}></img>
			<header className="App-header">
				<h1 className="title">Peekify</h1>
				<div>
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
