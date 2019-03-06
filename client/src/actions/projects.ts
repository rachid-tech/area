import { reset } from 'redux-form';
import tribe from '../api/tribe';
import Axios from 'axios';
import { PROJECT_CREATE, PROJECTS_FETCH, PROJECT_FETCH } from './types';
import globalState from '../types/states/globalState';
import actionType from '../types/actionType';

const _uploadFile = async (file: any, accessToken: string) => {
	const uploadConfig: any = await tribe.get(
		`/projects/upload/image?filename=${file.name}&contentType=${file.type}`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	);
	const { url, key } = uploadConfig.data;
	await Axios.put(url, file, {
		headers: {
			'Content-Type': file.type
		}
	});
	return key;
};

export const createProject = (formValues: any, file: any) => async (
	dispatch: (source: actionType) => any,
	getState: () => globalState
) => {
	let imageUrl: any = null;
	const accessToken = getState().auth.authenticated;
	let error: boolean = false;

	if (
		!getState().user.googleService ||
		!getState().user.trelloService ||
		!getState().user.githubService
	) {
		return true;
	}

	try {
		if (file) {
			imageUrl = await _uploadFile(file, accessToken);
		}
		const { data } = await tribe.post(
			'/projects',
			{
				...formValues,
				imageUrl
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		);
		dispatch(reset('projectForm'));
		dispatch({ type: PROJECT_CREATE, payload: data });
	} catch (err) {
		error = true;
	} finally {
		return error;
	}
};

export const getProject = (projectId: number) => async (
	dispatch: (source: actionType) => any,
	getState: () => globalState
) => {
	const accessToken = getState().auth.authenticated;

	try {
		const { data } = await tribe.get(`/projects/${projectId}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		dispatch({ type: PROJECT_FETCH, payload: data });
	} catch (err) {
		console.log(err);
	}
};

export const getProjects = () => async (
	dispatch: (source: actionType) => any,
	getState: () => globalState
) => {
	const accessToken = getState().auth.authenticated;

	try {
		const { data } = await tribe.get('/projects', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		dispatch({ type: PROJECTS_FETCH, payload: data });
	} catch (e) {
		return;
	}
};
