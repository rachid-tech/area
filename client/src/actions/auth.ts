import tribe from '../api/tribe';
import { AUTH_USER, AUTH_ERROR, AUTH_LOGOUT } from './types';
import history from '../history';
import actionType from '../types/actionType';

export const signUp = (formProps: any) => async (
	dispatch: (source: actionType) => any
) => {
	try {
		const { data } = await tribe.post('/auth/signup', {
			email: formProps.email,
			username: formProps.username,
			password: formProps.password
		});
		if (data.token) {
			localStorage.setItem('tokenTribe', data.token);
			dispatch({ type: AUTH_USER, payload: data });
			history.push('/user/details');
		}
	} catch (e) {
		dispatch({ type: AUTH_ERROR, payload: 'Email in use' });
	}
};

export const signIn = (formProps: any) => async (
	dispatch: (source: actionType) => any
) => {
	try {
		const { data } = await tribe.post('/auth/signin', {
			email: formProps.email,
			password: formProps.password
		});
		if (data.token) {
			localStorage.setItem('tokenTribe', data.token);
			dispatch({ type: AUTH_USER, payload: data });
			history.push('/');
		}
	} catch (e) {
		dispatch({ type: AUTH_ERROR, payload: 'Invalid credentials' });
	}
};

export const signout = () => {
	localStorage.removeItem('tokenTribe');
	history.push('/signin');
	return {
		type: AUTH_LOGOUT
	};
};
