import { isValidObjectId } from 'mongoose';
import { IAsyncRequestHandler } from '../../common/interfaces';
import { catchAsyncRequestHandlerError } from '../../common/middlewares';
import PostModel from '../POST/model';
import UserModel from '../USER/model';
import PostCommentModel from './model';
import { TPostCommentInput } from './types';

const createPostCommentUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postId: string = req.params.postId;
	const currentUserId: string = res.locals.currentUserId;
	const createPostCommentInput: TPostCommentInput = res.locals.validatedBody;

	const currentUserDoc = await UserModel.findById(currentUserId);
	if (!currentUserDoc) {
		res.status(404).json({ error: 'no such user' });
		return;
	}

	const postDoc = await PostModel.findById(postId);
	if (!postDoc) {
		res.status(404).json({ error: 'no such post' });
		return;
	}

	const { username, profilePicture, _id: id } = currentUserDoc;
	const postCommentDoc = await PostCommentModel.create({
		author: {
			id,
			username,
			profilePicture,
		},
		...createPostCommentInput,
	});

	postDoc.comments.push(postCommentDoc._id);
	await postDoc.save();

	res.status(200).json(postCommentDoc);
};

const updatePostCommentUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postCommentId = req.params.id;
	if (!isValidObjectId(postCommentId)) {
		res.status(400).json({ error: 'invalid Post Comment id' });
		return;
	}

	const postComment = await PostCommentModel.findByIdAndUpdate(
		postCommentId,
		{ ...res.locals.validatedBody },
		{ new: true }
	);

	if (!postComment) {
		res.status(404).json({ error: 'Post Comment not found' });
		return;
	}

	res.status(200).json(postComment);
};

const deletePostCommentUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postCommentId = req.params.id;
	if (!isValidObjectId(postCommentId)) {
		res.status(400).json({ error: 'invalid PostComment id' });
		return;
	}

	const postCommentDoc = await PostCommentModel.findById(postCommentId);
	if (!postCommentDoc) {
		res.status(404).json({ error: 'PostComment not found' });
		return;
	}

	const currentUserId = res.locals.currentUserId;
	const currentUserDoc = await UserModel.findById(currentUserId);

	if (postCommentDoc.author !== currentUserId && !currentUserDoc?.isAdmin) {
		res.status(400).json({ error: 'not authorized' });
		return;
	}

	await postCommentDoc.delete();

	res.status(200).json({ success: 'Post Comment deleted' });
};

const likePostCommentUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postCommentId = req.params.id;
	const currentUserId = res.locals.currentUserId;

	if (!isValidObjectId(postCommentId)) {
		res.status(400).json({ error: 'invalid id' });
		return;
	}

	const postCommentDoc = await PostCommentModel.findById(postCommentId);
	const currentUserDoc = await UserModel.findById(currentUserId);

	if (!postCommentDoc || !currentUserDoc) {
		res.status(404).send({ error: 'Post Comment or current user not found' });
		return;
	}

	if (postCommentDoc.likes.includes(currentUserId)) {
		res.status(400).json({ error: 'Post Comment already liked' });
		return;
	}

	postCommentDoc.likes.push(currentUserId);
	await postCommentDoc.save();

	res.status(200).json(postCommentDoc);
};

const dislikePostCommentUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postCommentId = req.params.id;
	const currentUserId = res.locals.currentUserId;

	if (!isValidObjectId(postCommentId)) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	const postCommentDoc = await PostCommentModel.findById(postCommentId);
	const currentUserDoc = await UserModel.findById(currentUserId);

	if (!postCommentDoc || !currentUserDoc) {
		res.status(404).send({ error: 'PostComment or current user not found' });
		return;
	}

	if (postCommentDoc.dislikes.includes(currentUserId)) {
		res.status(400).json({ error: 'PostComment already disliked' });
		return;
	}

	postCommentDoc.dislikes.push(currentUserId);
	await postCommentDoc.save();

	res.status(200).json(postCommentDoc);
};

const getPostCommentsUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postCommentsIds: string[] = res.locals.validatedBody ?? [];
	const filteredIds = postCommentsIds.filter(
		(postId, idx, arr) => arr.indexOf(postId) === idx && isValidObjectId(postId)
	);

	if (!filteredIds.length) {
		res.status(200).json([]);
		return;
	}

	const date = req.params.date;
	const postComments = await PostCommentModel.find({
		_id: { $in: filteredIds },
		createdAt: { $lt: new Date(parseInt(date)) },
	})
		.sort({ createdAt: -1 })
		.limit(10);

	res.status(200).json(postComments);
};

export const createPostComment = catchAsyncRequestHandlerError(
	createPostCommentUnsafe
);

export const getPostComments = catchAsyncRequestHandlerError(
	getPostCommentsUnsafe
);

export const updatePostComment = catchAsyncRequestHandlerError(
	updatePostCommentUnsafe
);
export const deletePostComment = catchAsyncRequestHandlerError(
	deletePostCommentUnsafe
);
export const likePostComment = catchAsyncRequestHandlerError(
	likePostCommentUnsafe
);
export const dislikePostComment = catchAsyncRequestHandlerError(
	dislikePostCommentUnsafe
);
