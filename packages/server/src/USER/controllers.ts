import bcrypt from 'bcryptjs';
import { ErrorRequestHandler, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';
import { isUniqueInArray } from '../common/helpers';
import { IAsyncRequestHandler, isErrorWithCode } from '../common/interfaces';
import { catchAsyncRequestHandlerError } from '../common/middlewares';
import { IS_PROD, JWT_SECRET } from '../config/secrets';
import UserModel from './model';
import { TGetUsersInput, TLoginInput } from './types';

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

	const jwtToken = jwt.sign(payload._id.toString(), JWT_SECRET);
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

export const logout: RequestHandler = (req, res) => {
	res.clearCookie('cookieToken');
	res.status(200).json({ success: 'logout successful' });
};

const updateUserUnsafe: IAsyncRequestHandler = async (req, res) => {
	const updatedUserId = req.params.id;
	if (!isValidObjectId(updatedUserId)) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	const currentUserId: string = res.locals.currentUserId;
	const currentUserDoc = await UserModel.findById(currentUserId);
	if (updatedUserId !== currentUserId && !currentUserDoc?.isAdmin) {
		res.status(400).json({ error: 'you can only update your account' });
		return;
	}

	const updateInput = res.locals.validatedBody;
	if (updateInput.password) {
		const salt = bcrypt.genSaltSync(10);
		updateInput.password = bcrypt.hashSync(updateInput.password, salt);
	}

	const updateUser = await UserModel.findByIdAndUpdate(
		updatedUserId,
		updateInput,
		{ new: true }
	).select('-password');

	if (!updateUser) {
		res.status(400).json({ error: 'no such user' });
		return;
	}

	res.status(200).json(updateUser.toObject({ versionKey: false }));
};

const deleteUserUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUserId: string = res.locals.currentUserId;
	const deletedUserId = req.params.id;

	if (!isValidObjectId(deletedUserId)) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	const currentUserDoc = await UserModel.findById(currentUserId);
	if (!currentUserDoc?.isAdmin && deletedUserId !== currentUserId) {
		res.status(400).json({
			error: 'can not delete an account that is not yours',
		});
		return;
	}

	const deletedUser = await UserModel.findByIdAndUpdate(deletedUserId);

	if (!deletedUser) {
		res.status(400).json({
			error: 'no user with such id',
		});
		return;
	}

	if (deletedUser.isAdmin) {
		res.status(400).json({
			error: 'can not delete an admin account',
		});
		return;
	}

	await deletedUser.delete();
	res.status(200).json({ success: 'user deleted' });
};

const getUserUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userId = req.params.id;

	if (!isValidObjectId(userId)) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	const userDoc = await UserModel.findById(userId).select('-password');
	if (!userDoc) {
		res.status(400).json({ error: 'no such user' });
		return;
	}
	const user = userDoc.toObject({ versionKey: false });
	res.status(200).json(user);
};

const getUsersUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userIds = res.locals.validatedBody as TGetUsersInput;
	const filteredIds = userIds.filter(isUniqueInArray);
	const usersPromises = filteredIds.map(async (userId) => {
		if (!isValidObjectId(userId)) {
			return;
		}
		const userDoc = await UserModel.findById(userId).select('-password');
		return userDoc?.toObject({ versionKey: false });
	});

	const users = (await Promise.all(usersPromises)).filter((user) =>
		Boolean(user)
	);
	res.status(200).json(users);
};

const followUnsafe: IAsyncRequestHandler = async (req, res) => {
	const followedUserId = req.params.id;
	const followerUserId = res.locals.currentUserId;

	if (!isValidObjectId(followedUserId)) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	if (followedUserId === followerUserId) {
		res.status(400).json({ error: 'a user can not follow himself' });
		return;
	}

	const followedUserDoc = await UserModel.findById(followedUserId);
	const followerUserDoc = await UserModel.findById(followerUserId);

	if (!followedUserDoc || !followerUserDoc) {
		res
			.status(400)
			.send({ error: 'wrong user id for the follower or followed' });
		return;
	}

	if (followerUserDoc.followings.includes(followedUserId)) {
		res.status(400).json({ error: 'user already followed' });
		return;
	}

	followedUserDoc.followers.push(followerUserId);
	followerUserDoc.followings.push(followedUserId);

	await followerUserDoc.save();
	await followedUserDoc.save();

	res.status(200).json({
		success: 'user followed',
	});
};

const unfollowUnsafe: IAsyncRequestHandler = async (req, res) => {
	const followedUserId = req.params.id;
	const followerUserId = res.locals.currentUserId;

	if (!isValidObjectId(followedUserId)) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	if (followedUserId === followerUserId) {
		res.status(400).json({ error: 'a user can not unfollow himself' });
		return;
	}

	const followedUserDoc = await UserModel.findById(followedUserId);
	const followerUserDoc = await UserModel.findById(followerUserId);

	if (!followedUserDoc || !followerUserDoc) {
		res
			.status(400)
			.send({ error: 'wrong user id for the follower or followed' });
		return;
	}

	const followedUserIdIndex = followerUserDoc.followers.indexOf(followedUserId);
	const followerUserIdIndex = followedUserDoc.followers.indexOf(followerUserId);

	if (followedUserIdIndex === -1 && followerUserIdIndex === -1) {
		res.status(400).json({ error: 'user not followed' });
		return;
	}

	followedUserDoc.followers.splice(followerUserIdIndex, 1);
	followerUserDoc.followings.splice(followedUserIdIndex, 1);

	await followerUserDoc.save();
	await followedUserDoc.save();

	res.status(200).json({
		success: 'user unfollowed',
	});
};

export const createUser = catchAsyncRequestHandlerError(
	createUserUnsafe,
	createUserErrorHandler
);
export const login = catchAsyncRequestHandlerError(loginUnsafe);
export const updateUser = catchAsyncRequestHandlerError(updateUserUnsafe);
export const deleteUser = catchAsyncRequestHandlerError(deleteUserUnsafe);
export const getUser = catchAsyncRequestHandlerError(getUserUnsafe);
export const getUsers = catchAsyncRequestHandlerError(getUsersUnsafe);
export const follow = catchAsyncRequestHandlerError(followUnsafe);
export const unfollow = catchAsyncRequestHandlerError(unfollowUnsafe);
