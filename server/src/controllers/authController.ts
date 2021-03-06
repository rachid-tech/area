import { Request, Response } from 'express';
import * as jwt from 'jwt-simple';
import * as bcrypt from 'bcryptjs';
import * as keys from '../keys';
import * as qs from 'query-string';
import githubAuth from '../api/githubAuth';
import github from '../api/github';

import User from '../models/User';
import { NextFunction } from 'connect';
import userType from '../types/userType';

const tokenForUser = (user: any) => {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, keys.jwtSecret);
};

export const signup = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, username, avatarUrl, password } = req.body;
		const user: userType = await User.findOne({
			where: { email: req.body.email }
		});
		if (user) {
			return res.status(422).json({ message: 'User already exist' });
		}
		const hash = await bcrypt.hash(password, 10);
		const newUser: userType = await User.create({
			email,
			username,
			avatarUrl,
			password: hash
		});
		return res.status(201).json({ token: tokenForUser(newUser) });
	} catch (err) {
		return next(err);
	}
};

export const signin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body;

	try {
		const user: userType = await User.findOne({ where: { email: email } });
		if (!user) {
			const error: any = new Error('No record for you in database');
			error.statusCode = 404;
			return next(error);
		}
		const isEqual: boolean = await bcrypt.compare(password, user.password);
		if (!isEqual) {
			const error: any = new Error('Invalid password');
			error.statusCode = 401;
			return next(error);
		}
		return res.status(200).json({ token: tokenForUser(user) });
	} catch (err) {
		return next(err);
	}
};

export const githubOauth = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { code, state } = req.query;
	try {
		const { data } = await githubAuth.post(
			'/access_token?' +
				qs.stringify({
					client_id: keys.githubId,
					client_secret: keys.githubSecret,
					code: code,
					redirect_uri: keys.githubRedirectUri
				})
		);
		const accessToken: string | string[] = qs.parse(data).access_token;
		const res = await github.get('/user', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		const user: userType = await User.findByPk(state);
		if (!user.githubService) {
			user.githubService = true;
			await user.createGithubProvider({
				name: res.data.login,
				accessToken
			});
			await user.save();
		}
	} catch (err) {
		return next(err);
	}
	return res.redirect('http://localhost:8081/user/profile?github=true');
};

export const trelloOauth = async (req: Request, res: Response) => {
	req;
	return res.redirect('http://localhost:8081/user/profile?trello=true');
};
