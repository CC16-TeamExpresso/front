import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Feed from './Feed';
import User from './User';
import './App.css';

//The exact param disables the partial matching for a route and makes sure that
//it only returns the route if the path is an EXACT match to the current url.

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" component={Home} exact />
				<Route path="/login" component={Login} exact />
				<Route path="/register" component={Register} exact />
				<Route path="/profile" component={Profile} exact />
				<Route path="/feed" component={Feed} exact />
				<Route path="/user/:userid" component={User} exact />
			</Switch>
		</Router>
	);
}

export default App;
