import { isValidObjectId } from 'mongoose';
import { IAsyncRequestHandler } from '../../common/interfaces';
import { catchAsyncReqHandlerErr } from '../../common/middlewares';
import PostModel from '../POST/model';
import UserModel from '../USER/model';
import PostCommentModel from './model';

const createPostCommentUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postId: string = req.params.postId;
	if (!isValidObjectId(postId)) {
		res.status(400).json({ error: 'invalid Post id' });
		return;
	}

	const currentUserDoc = await UserModel.findById(req.currentUserId);
	if (!currentUserDoc) {
		res.status(404).json({ error: 'no such user' });
		return;
	}

	const postDoc = await PostModel.findById(postId);
	if (!postDoc) {
		res.status(404).json({ error: 'no such post' });
		return;
	}

	const { id, userName, avatar } = currentUserDoc;
	const postCommentDoc = await PostCommentModel.create({
		author: {
			id,
			userName,
			avatar,
		},
		...req.postCommentInput,
	});

	postDoc.comments.push(postCommentDoc.id);
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
		{ ...req.postCommentInput },
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

	const currentUserId = req.currentUserId;
	if (postCommentDoc.author.id !== currentUserId) {
		res.status(400).json({ error: 'not authorized' });
		return;
	}

	await postCommentDoc.delete();

	res.status(200).json({ success: 'Post Comment deleted' });
};

const likePostCommentUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postCommentId = req.params.id;
	if (!isValidObjectId(postCommentId)) {
		res.status(400).json({ error: 'invalid id' });
		return;
	}

	const currentUserId = req.currentUserId as string;
	const currentUserDoc = await UserModel.findById(currentUserId);
	const postCommentDoc = await PostCommentModel.findById(postCommentId);
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
	if (!isValidObjectId(postCommentId)) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	const currentUserId = req.currentUserId as string;
	const currentUserDoc = await UserModel.findById(currentUserId);
	const postCommentDoc = await PostCommentModel.findById(postCommentId);

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
	const postCommentsIds = req.dBDocIds;

	if (!postCommentsIds?.length) {
		res.status(200).json([]);
		return;
	}

	const postComments = await PostCommentModel.find({
		_id: { $in: postCommentsIds },
	}).sort({ createdAt: -1 });

	res.status(200).json(postComments);
};

export const createPostComment = catchAsyncReqHandlerErr(
	createPostCommentUnsafe
);

export const getPostComments = catchAsyncReqHandlerErr(getPostCommentsUnsafe);

export const updatePostComment = catchAsyncReqHandlerErr(
	updatePostCommentUnsafe
);
export const deletePostComment = catchAsyncReqHandlerErr(
	deletePostCommentUnsafe
);
export const likePostComment = catchAsyncReqHandlerErr(likePostCommentUnsafe);
export const dislikePostComment = catchAsyncReqHandlerErr(
	dislikePostCommentUnsafe
);
