import bcrypt from 'bcryptjs';
import { ErrorRequestHandler, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { IAsyncRequestHandler, isErrorWithCode } from '../common/interfaces';
import { catchAsyncRequestHandlerError } from '../common/middlewares';
import { IS_PROD, JWT_SECRET } from '../config/secrets';
import { TLoginInput } from './interface';
import UserModel from './model';

const createUserErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (isErrorWithCode(err)) {
		if (err.code === 11000) {
			res.status(500).json({
				error: 'username already used',
			});
			return;
		}
	}

	next(err);
};

const createUserUnsafe: IAsyncRequestHandler = async (req, res) => {
	await UserModel.create(res.locals.validatedBody);
	res.status(200).json({
		success: 'user created successfully',
	});
};

export const createUser = catchAsyncRequestHandlerError(
	createUserUnsafe,
	createUserErrorHandler
);

const loginUnsafe: IAsyncRequestHandler = async (req, res) => {
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

export const login = catchAsyncRequestHandlerError(loginUnsafe);

export const logout: RequestHandler = (req, res) => {
	res.clearCookie('cookieToken');
	res.status(200).json({ success: 'logout successful' });
};

const updateUserUnsafe: IAsyncRequestHandler = async (req, res) => {
	const id = req.params.id ? req.params.id : res.locals.currentUser._id;
	await UserModel.findByIdAndUpdate(id, res.locals.validatedBody);
	res.status(200).json({ success: 'user updated' });
};

export const updateUser = catchAsyncRequestHandlerError(updateUserUnsafe);

const deleteUserUnsafe: IAsyncRequestHandler = async (req, res) => {
	const id = req.params.id ? req.params.id : res.locals.currentUser._id;
	const user = await UserModel.findByIdAndUpdate(id);
	if (!user) {
		res.status(400).json({
			error: 'no user with such id',
		});
		return;
	}
	if (user?.isAdmin) {
		res.status(400).json({
			error: 'can not delete an admin account',
		});
		return;
	}
	await user?.delete();
	res.status(200).json({ success: 'user deleted' });
};

export const deleteUser = catchAsyncRequestHandlerError(deleteUserUnsafe);
