import bcrypt from 'bcryptjs';
import { RequestHandler } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';
import { IAsyncRequestHandler } from '../../common/interfaces';
import { catchAsyncReqHandlerErr } from '../../common/middlewares';
import { dbDocIdValidationSchema } from '../../common/validation';
import { socketConnections } from '../../config/app';
import { IS_PROD, JWT_SECRET } from '../../config/secrets';
import FriendRequestsModel from '../../DATA_SOURCES/FRIEND_REQUESTS/model';
import UserModel from './model';

const signupUnsafe: IAsyncRequestHandler = async (req, res) => {
	await UserModel.create(req.signupInput);
	res.status(200).json({
		success: 'user created successfully',
	});
};

const loginUnsafe: IAsyncRequestHandler = async (req, res) => {
	const loginInput = req.loginInput;
	const userDoc = await UserModel.findOne({ email: loginInput.email });
	if (!userDoc) {
		res.status(400).json({ error: 'wrong password or email' });
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

const getUserByIdUnsafe: IAsyncRequestHandler = async (req, res) => {
	const { value: userId, error } = dbDocIdValidationSchema.validate(
		req.params.userId
	);
	if (error) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	const user = await UserModel.findById(userId).select('-password');
	if (!user) {
		res.status(400).json({ error: 'no such user' });
		return;
	}

	res.status(200).json(user);
};

const getUsersByIdsUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userIds = req.dBDocIds;
	const users = await UserModel.find({ _id: { $in: userIds } });
	res.status(200).json(users);
};

const removeFriendUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userId = req.currentUserId as string;
	const { value: friendId, error } = dbDocIdValidationSchema.validate(
		req.params.friendId
	);
	if (error) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}
	const user = await UserModel.findById(userId);
	const friend = await UserModel.findById(friendId);
	if (!user || !friend) {
		res.status(400).json({ error: 'user or friend not found' });
		return;
	}

	const userIdx = friend.friends.indexOf(userId);
	const friendIdx = user.friends.indexOf(friendId);
	if (friendIdx === -1) {
		res.status(400).json({ error: 'already a not friend' });
		return;
	}

	user.friends.splice(friendIdx, 1);
	friend.friends.splice(userIdx, 1);
	await Promise.all([user.save(), friend.save()]);
	res.status(200).json({ succuss: 'friend removed' });
};

const getOnlineUserUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUser = await UserModel.findById(req.currentUserId);
	if (!currentUser) {
		res.status(400).json({ error: 'auth error' });
		return;
	}
	const onlineUsers = currentUser.friends.filter((friend) =>
		socketConnections.get(friend)
	);
	res.status(200).json(onlineUsers);
};

const searchUsersByUserNameUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUserId = req.currentUserId;
	const { error, value: username } = Joi.string()
		.min(3)
		.max(18)
		.required()
		.validate(req.params.username);
	if (error) {
		res.status(400).json({ error: 'invalid username' });
		return;
	}
	//todo use algolia or another fuzzy search method regex is expensive

	const filteringIds = (
		await FriendRequestsModel.find({
			status: 'pending',
			$or: [{ recipient: currentUserId }, { requester: currentUserId }],
		})
	).reduce<string[]>(
		(prev, curr) =>
			curr.recipient === currentUserId
				? [...prev, curr.requester]
				: [...prev, curr.recipient],
		[]
	);
	filteringIds.push(currentUserId as string);

	const regex = new RegExp(username, 'gi');
	const users = await UserModel.find({
		userName: regex,
		_id: { $nin: filteringIds },
	});

	res.status(200).json(users);
};

const getFriendsUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUser = await UserModel.findById(req.currentUserId);
	if (!currentUser) {
		res.status(400).json({ error: 'auth error' });
		return;
	}
	res.status(200).json(currentUser.friends);
};

export const signup = catchAsyncReqHandlerErr(signupUnsafe);
export const login = catchAsyncReqHandlerErr(loginUnsafe);
export const updateUser = catchAsyncReqHandlerErr(updateUserUnsafe);
export const deleteUser = catchAsyncReqHandlerErr(deleteUserUnsafe);
export const getUserById = catchAsyncReqHandlerErr(getUserByIdUnsafe);
export const getUsersByIds = catchAsyncReqHandlerErr(getUsersByIdsUnsafe);

export const removeFriend = catchAsyncReqHandlerErr(removeFriendUnsafe);
export const getOnlineUser = catchAsyncReqHandlerErr(getOnlineUserUnsafe);
export const searchUsersByUserName = catchAsyncReqHandlerErr(
	searchUsersByUserNameUnsafe
);
export const getFriends = catchAsyncReqHandlerErr(getFriendsUnsafe);
