import { isValidObjectId } from 'mongoose';
import { IAsyncRequestHandler } from '../../common/interfaces';
import { catchAsyncReqHandlerErr } from '../../common/middlewares';
import UserModel from '../USER/model';
import PostModel from './model';

const createPostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUserDoc = await UserModel.findById(req.currentUserId);
	if (!currentUserDoc) {
		res.status(404).json({ error: 'no such user' });
		return;
	}

	const { userName, avatar, id } = currentUserDoc;
	const postDoc = await PostModel.create({
		author: {
			id,
			userName,
			avatar,
		},
		...req.postInput,
	});

	res.status(200).json(postDoc);
};

const getPostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postId = req.params.id;
	if (!isValidObjectId(postId)) {
		res.status(400).json({ error: 'invalid post id' });
		return;
	}

	const postDoc = await PostModel.findById(postId);
	if (!postDoc) {
		res.status(404).json({ error: 'post not found' });
		return;
	}

	res.status(200).json(postDoc);
};

const updatePostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postId = req.params.id;
	if (!isValidObjectId(postId)) {
		res.status(400).json({ error: 'invalid post id' });
		return;
	}

	const post = await PostModel.findByIdAndUpdate(
		postId,
		{ ...req.postInput },
		{ new: true }
	);

	if (!post) {
		res.status(404).json({ error: 'post not found' });
		return;
	}

	res.status(200).json(post);
};

const deletePostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postId = req.params.id;
	if (!isValidObjectId(postId)) {
		res.status(400).json({ error: 'invalid post id' });
		return;
	}

	const postDoc = await PostModel.findById(postId);
	if (!postDoc) {
		res.status(404).json({ error: 'post not found' });
		return;
	}

	const currentUserId = res.locals.currentUserId;
	const currentUserDoc = await UserModel.findById(currentUserId);

	if (postDoc.author !== currentUserId && !currentUserDoc?.isAdmin) {
		res.status(400).json({ error: 'not authorized' });
		return;
	}

	await postDoc.delete();

	res.status(200).json({ success: 'post deleted' });
};

const likePostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postId = req.params.id;
	const currentUserId = res.locals.currentUserId;

	if (!isValidObjectId(postId)) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	const postDoc = await PostModel.findById(postId);
	const currentUserDoc = await UserModel.findById(currentUserId);

	if (!postDoc || !currentUserDoc) {
		res.status(404).send({ error: 'post or current user not found' });
		return;
	}

	if (postDoc.likes.includes(currentUserId)) {
		res.status(400).json({ error: 'post already liked' });
		return;
	}

	postDoc.likes.push(currentUserId);
	currentUserDoc.likedPosts.push(postDoc.id);

	const postDislikeIdx = postDoc.dislikes.indexOf(currentUserId);
	const userDislikeIdx = currentUserDoc.dislikedPosts.indexOf(currentUserId);

	if (postDislikeIdx !== -1) {
		postDoc.dislikes.splice(postDislikeIdx, 1);
	}

	if (userDislikeIdx !== -1) {
		currentUserDoc.dislikedPosts.splice(postDislikeIdx, 1);
	}

	await currentUserDoc.save();
	await postDoc.save();

	res.status(200).json(postDoc);
};

const dislikePostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postId = req.params.id;
	const currentUserId = res.locals.currentUserId;

	if (!isValidObjectId(postId)) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	const postDoc = await PostModel.findById(postId);
	const currentUserDoc = await UserModel.findById(currentUserId);

	if (!postDoc || !currentUserDoc) {
		res.status(404).send({ error: 'post or current user not found' });
		return;
	}

	if (postDoc.dislikes.includes(currentUserId)) {
		res.status(400).json({ error: 'post already disliked' });
		return;
	}

	postDoc.dislikes.push(currentUserId);
	currentUserDoc.dislikedPosts.push(postDoc.id);

	const postDislikeIdx = postDoc.likes.indexOf(currentUserId);
	const userDislikeIdx = currentUserDoc.likedPosts.indexOf(currentUserId);

	if (postDislikeIdx !== -1) {
		postDoc.likes.splice(postDislikeIdx, 1);
	}

	if (userDislikeIdx !== -1) {
		currentUserDoc.likedPosts.splice(postDislikeIdx, 1);
	}

	await currentUserDoc.save();
	await postDoc.save();

	res.status(200).json(postDoc);
};

const getTimelinePostsUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userId = req.params.userId;
	const date = req.params.date;

	const userDoc = await UserModel.findById(userId);
	if (!userDoc) {
		res.status(404).json({ error: 'no such user' });
		return;
	}

	if (!userDoc.friends.length) {
		res.status(200).json([]);
		return;
	}

	const posts = await PostModel.find({
		'author.id': { $in: [...userDoc.friends, userDoc.id.toString()] },
		createdAt: { $lt: new Date(parseInt(date)) },
	})
		.sort({ createdAt: -1 })
		.limit(10);

	res.status(200).json(posts);
};
export const createPost = catchAsyncReqHandlerErr(createPostUnsafe);
export const getPost = catchAsyncReqHandlerErr(getPostUnsafe);
export const updatePost = catchAsyncReqHandlerErr(updatePostUnsafe);
export const deletePost = catchAsyncReqHandlerErr(deletePostUnsafe);
export const likePost = catchAsyncReqHandlerErr(likePostUnsafe);
export const dislikePost = catchAsyncReqHandlerErr(dislikePostUnsafe);
export const getTimelinePosts = catchAsyncReqHandlerErr(getTimelinePostsUnsafe);