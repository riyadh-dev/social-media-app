import csurf from 'csurf';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { IUserDB } from 'src/USER/interface';
import { IS_PROD, JWT_SECRET } from '../config/secrets';
import { IAsyncMiddleware, IErrorHandler, IMiddleware } from './interfaces';

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
			//jwt user object doesn't contain all props in the interface.
			//this casting is only to check the isAdmin prop.
			res.locals.currentUser = jwt.verify(
				req.signedCookies.token,
				JWT_SECRET
			) as IUserDB;
			console.log(res.locals.currentUser);
			next();
		} catch (_error) {
			res.clearCookie('token');
			res.status(403).json({ error: 'invalid token' });
		}
	};
