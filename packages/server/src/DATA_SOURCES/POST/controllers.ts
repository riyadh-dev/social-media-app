import { IGetPostsWithImagesInput, IPost } from '@social-media-app/shared';
import Joi from 'joi';
import { FilterQuery, isValidObjectId } from 'mongoose';
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

	const currentUserId = req.currentUserId;
	const currentUserDoc = await UserModel.findById(currentUserId);

	if (postDoc.author.id !== currentUserId && !currentUserDoc?.isAdmin) {
		res.status(400).json({ error: 'not authorized' });
		return;
	}

	await postDoc.delete();

	res.status(200).json({ success: 'post deleted' });
};

const likePostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postId = req.params.id;
	const currentUserId = req.currentUserId as string;

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
	const currentUserId = req.currentUserId as string;

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

const getPaginatedPostsUnsafe =
	(queryType: 'timeline' | 'liked'): IAsyncRequestHandler =>
	async (req, res) => {
		const PAGE_SIZE = 10;
		const userId = req.params.userId;

		const user = await UserModel.findById(userId);
		if (!user) {
			res.status(404).json({ error: 'no such user' });
			return;
		}

		if (!user.friends.length) {
			res.status(200).json([]);
			return;
		}

		const filter: FilterQuery<IPost> = {};
		switch (queryType) {
			case 'timeline':
				filter['author.id'] = { $in: [...user.friends, user.id] };
				break;
			case 'liked':
				filter.likes = user.id;
				break;
		}

		const page = Joi.attempt(req.query.page, Joi.number());
		const posts = await PostModel.find(filter)
			.sort({ createdAt: -1 })
			.skip(page * PAGE_SIZE)
			.limit(PAGE_SIZE);

		res.status(200).json(posts);
	};

//TODO remove
const getImageViewersPostsUnsafe: IAsyncRequestHandler = async (req, res) => {
	const { authorId, date, postId } =
		req.postWithImagesInput as IGetPostsWithImagesInput;

	const postsAcc = [];

	if (postId) {
		const post = await PostModel.findById(postId);
		if (!post || !post.img) {
			res
				.status(404)
				.json({ error: 'post not found or does not have an image' });
			return;
		}

		const author = await UserModel.findById(post.author.id);
		if (!author) {
			res.status(404).json({ error: 'no such user' });
			return;
		}

		console.log(post.updatedAt);
		console.log(post.createdAt);

		const posts = await PostModel.find({
			'author.id': { $in: [...author.friends, author.id] },
			img: { $exists: true },
			createdAt: { $lt: post.createdAt },
		})
			.sort({ createdAt: -1 })
			.limit(2);
		if (posts) postsAcc.push(...posts, post);
	} else {
		const author = await UserModel.findById(authorId);
		if (!author) {
			res.status(404).json({ error: 'no such user' });
			return;
		}

		const posts = await PostModel.find({
			'author.id': { $in: [...author.friends, author.id] },
			img: { $exists: true },
			createdAt: { $lt: new Date(date as number) },
		})
			.sort({ createdAt: -1 })
			.limit(3);

		if (posts) postsAcc.push(...posts);
	}

	res.status(200).json(postsAcc);
};

export const createPost = catchAsyncReqHandlerErr(createPostUnsafe);
export const getPost = catchAsyncReqHandlerErr(getPostUnsafe);
export const updatePost = catchAsyncReqHandlerErr(updatePostUnsafe);
export const deletePost = catchAsyncReqHandlerErr(deletePostUnsafe);
export const likePost = catchAsyncReqHandlerErr(likePostUnsafe);
export const dislikePost = catchAsyncReqHandlerErr(dislikePostUnsafe);
export const getTimelinePosts = catchAsyncReqHandlerErr(
	getPaginatedPostsUnsafe('timeline')
);
export const getLikedPosts = catchAsyncReqHandlerErr(
	getPaginatedPostsUnsafe('liked')
);
export const getImageViewersPosts = catchAsyncReqHandlerErr(
	getImageViewersPostsUnsafe
);
