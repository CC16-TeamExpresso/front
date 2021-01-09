import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Feed from "./feed/Feed";
import './App.css';
import { profile } from 'console';

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" component={Home} exact />
				<Route path="/login" component={Login} exact />
				<Route path="/register" component={Register} exact />
				<Route path="/profile" component={Profile} exact />
				<Route path="/feed" component={Feed} exact/> 
			</Switch>
		</Router>
	);
}

export default App;
