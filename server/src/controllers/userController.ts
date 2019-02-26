import * as AWS from 'aws-sdk';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator/check';
import { NextFunction } from 'express';
import User from '../models/User';
import * as keys from '../keys';

const s3 = new AWS.S3({
	accessKeyId: keys.s3accessKeyId,
	secretAccessKey: keys.s3secretKey,
	signatureVersion: 'v4',
	region: 'eu-west-3'
});

export const edit = async (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const error: any = new Error('Validation failed');
		error.statusCode = 422;
		error.data = errors.array();
		return next(error);
	}

	const { email, username, avatarUrl } = req.body;

	try {
		const user: any = await User.findByPk(req.user.id);
		user.email = email;
		user.username = username;
		if (avatarUrl) {
			user.avatarUrl =
				'https://s3.eu-west-3.amazonaws.com/tribe-storage/' + avatarUrl;
		}
		const newUser = await user.save();
		return res.status(200).json(newUser);
	} catch (err) {
		return next(err);
	}
};

export const getUser = (req: Request, res: Response) => {
	res.status(200).json({
		id: req.user.id,
		email: req.user.email,
		avatarUrl: req.user.avatarUrl,
		username: req.user.username,
		googleService: req.user.googleService,
		githubService: req.user.githubService
	});
};

export const patch = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, username, avatarUrl } = req.body;

	try {
		const user: any = await User.findByPk(req.user.id);
		if (email) {
			user.email = email;
		}
		if (username) {
			user.username = username;
		}
		if (avatarUrl) {
			user.avatarUrl =
				'https://s3.eu-west-3.amazonaws.com/tribe-storage/' + avatarUrl;
		}
		const newUser = await user.save();
		return res.status(200).json(newUser);
	} catch (err) {
		return next(err);
	}
};

export const getS3Link = (req: Request, res: Response) => {
	const key = `${req.user.id}/profile/${req.query.filename}`;

	s3.getSignedUrl(
		'putObject',
		{
			Bucket: 'tribe-storage',
			ContentType: 'image/jpeg',
			Key: key
		},
		(err, url) => {
			err;
			res.status(200).json({ key, url });
		}
	);
};
