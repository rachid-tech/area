import React from 'react';
import Header from './general/Header';
import { Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import Signup from './auth/Signup';
import Signout from './auth/Signout';
import Signin from './auth/Signin';
import UserSettings from './users/settings/UserSettings';
import UserProfile from './users/UserProfile';

const App = () => {
	return (
		<div style={{ marginTop: '2%' }}>
			<Container textAlign="center">
				<Header />
				<Route path="/signup" exact component={Signup} />
				<Route path="/signin" exact component={Signin} />
				<Route path="/signout" exact component={Signout} />
				<Route path="/user/profile" exact component={UserProfile} />
				<Route path="/user/settings" exact component={UserSettings} />
			</Container>
		</div>
	);
};

export default App;
