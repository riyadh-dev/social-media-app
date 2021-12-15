import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
	IAsyncMiddleware,
	IErrorHandler,
	IMiddleware,
	isErrorWithCode,
} from '../common/interfaces';
import { catchAsyncMiddlewareError } from '../common/middlewares';
import { IS_PROD, JWT_SECRET } from '../config/secrets';
import { TLoginInput } from './interface';
import UserModel from './model';

const createUserErrorHandler: IErrorHandler = (error, res) => {
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
	console.error(error.message);
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

const loginUnsafe: IAsyncMiddleware = async (req, res) => {
	const loginInput: TLoginInput = res.locals.validatedBody;
	const userDoc = await UserModel.findOne({ username: loginInput.username });
	if (!userDoc) {
		res.status(400).json({ error: 'wrong password or username' });
		return;
	}

	const { password, ...payload } = userDoc.toObject({ versionKey: false });
	const isPasswordCorrect = bcrypt.compareSync(loginInput.password, password);
	if (!isPasswordCorrect) {
		res.status(400).json({ error: 'wrong password or username' });
		return;
	}

	const jwtToken = jwt.sign(payload, JWT_SECRET);
	res.cookie('cookieToken', jwtToken, {
		httpOnly: true,
		signed: true,
		secure: IS_PROD,
		sameSite: 'strict',
	});

	const csrfToken = req.csrfToken();
	res.status(200).json({
		...payload,
		csrfToken,
	});
};

export const login = catchAsyncMiddlewareError(loginUnsafe);

export const logout: IMiddleware = (req, res) => {
	res.clearCookie('cookieToken');
	res.status(200).json({ success: 'logout successful' });
};

const updateUserUnsafe: IAsyncMiddleware = async (req, res) => {
	console.log('update user');
};

export const updateUser = catchAsyncMiddlewareError(updateUserUnsafe);
