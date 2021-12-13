import Joi from 'joi';
import { IAsyncMiddleware, IErrorHandler, IMiddleware } from './interfaces';

export const validateInput =
	(validationSchema: Joi.ObjectSchema): IMiddleware =>
	(req, res, next) => {
		const { error, value } = validationSchema.validate(req.body);
		if (error) {
			res.status(400).json({
				error: 'validation error',
			});
			return;
		}

		res.locals.validatedBody = value;
		next();
	};

const genericErrorHandler: IErrorHandler = (error, res) => {
	console.log(error.message);
	res.status(500).json({
		error: 'internal server error',
	});
};

export const catchAsyncMiddlewareError =
	(fn: IAsyncMiddleware, errorHandler?: IErrorHandler): IAsyncMiddleware =>
	(req, res, next) =>
		fn(req, res, next).catch((error) =>
			errorHandler === undefined
				? genericErrorHandler(error, res)
				: errorHandler(error, res)
		);
