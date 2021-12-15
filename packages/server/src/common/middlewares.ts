import csurf from 'csurf';
import { ErrorRequestHandler } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { TJwtUser } from 'src/USER/interface';
import { IS_PROD, JWT_SECRET } from '../config/secrets';
import {
	IAsyncMiddleware,
	IErrorHandler,
	IMiddleware,
	isErrorWithCode,
} from './interfaces';

export const validateInput =
	(validationSchema: Joi.ObjectSchema): IMiddleware =>
	(req, res, next) => {
		const { error, value } = validationSchema.validate(req.body);
		if (error) {
			res.status(400).json({
				error: 'validation error',
			});
			console.error(error.message);
			return;
		}

		res.locals.validatedBody = value;
		next();
	};

const genericErrorHandler: IErrorHandler = (error, res) => {
	res.status(500).json({
		error: 'internal server error',
	});
	console.error(error.message);
};

export const catchAsyncMiddlewareError =
	(fn: IAsyncMiddleware, errorHandler?: IErrorHandler): IAsyncMiddleware =>
	(req, res, next) =>
		fn(req, res, next).catch((error) =>
			errorHandler ? errorHandler(error, res) : genericErrorHandler(error, res)
		);

export const csrfLogin = csurf({
	ignoreMethods: ['POST'],
	cookie: {
		httpOnly: true,
		signed: true,
		secure: IS_PROD,
		sameSite: 'strict',
	},
});

export const csrfProtection = csurf({
	cookie: {
		httpOnly: true,
		signed: true,
		secure: IS_PROD,
		sameSite: 'strict',
	},
});

export const authenticate =
	(authAdmin?: boolean): IMiddleware =>
	(req, res, next) => {
		try {
			const currentUser = jwt.verify(
				req.signedCookies.cookieToken,
				JWT_SECRET
			) as unknown as TJwtUser;

			if (authAdmin && !currentUser.isAdmin) {
				res.status(403).json({ error: 'not authorized' });
				return;
			}

			res.locals = { currentUser };
			next();
		} catch (_error) {
			res.clearCookie('token');
			res.status(403).json({ error: 'invalid token' });
		}
	};
export const handleCsurfError: ErrorRequestHandler = (err, req, res, next) => {
	if (isErrorWithCode(err)) {
		if (err.code === 'EBADCSRFTOKEN') {
			res.clearCookie('token');
			res.status(403).json({ error: 'form tampered with' });
			next(err.message);
		}
	}
};

export const handlePassedError: ErrorRequestHandler = (err, req, res, next) => {
	if (err instanceof Error) {
		res.status(500).json({
			error: 'internal server error',
		});
		next(err.message);
		return;
	}
};
