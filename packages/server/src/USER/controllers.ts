import {
	IAsyncMiddleware,
	IErrorHandler,
	isErrorWithCode,
} from '../common/interfaces';
import { catchAsyncMiddlewareError } from '../common/middlewares';
import UserModel from './model';

const createUserErrorHandler: IErrorHandler = (error, res) => {
	console.log(error.message);
	if (isErrorWithCode(error)) {
		if (error.code === 11000) {
			res.status(500).json({
				error: 'username already used',
			});
			return;
		}
	}

	res.status(500).json({
		error: 'internal server error',
	});
};

const createUserUnsafe: IAsyncMiddleware = async (req, res) => {
	await UserModel.create(res.locals.validatedBody);
	res.status(200).json({
		success: 'user created successfully',
	});
};

export const createUser = catchAsyncMiddlewareError(
	createUserUnsafe,
	createUserErrorHandler
);
