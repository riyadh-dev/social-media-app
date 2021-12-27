import { isValidObjectId } from 'mongoose';
import { TCurrentUser } from 'src/USER/types';
import { IAsyncRequestHandler } from '../common/interfaces';
import { catchAsyncRequestHandlerError } from '../common/middlewares';
import PostModel from './model';
import { TPostInput } from './types';

const createPostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUser: TCurrentUser = res.locals.currentUser;
	const createPostInput: TPostInput = res.locals.validatedBody;
	const postDoc = await PostModel.create({
		userId: currentUser._id,
		...createPostInput,
	});
	res.status(200).json({
		post: postDoc.toObject({ versionKey: false }),
	});
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

	res.status(200).json({ post: postDoc.toObject({ versionKey: false }) });
};

const updatePostUnsafe: IAsyncRequestHandler = async (req, res) => {
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

	const currentUser: TCurrentUser = res.locals.currentUser;
	if (postDoc.userId !== currentUser._id && !currentUser.isAdmin) {
		res.status(400).json({ error: 'not authorized' });
		return;
	}

	const postUpdateInput: TPostInput = res.locals.validatedBody;
	postDoc.$set({ ...postUpdateInput });
	await postDoc.save();
	res
		.status(200)
		.json({ updatedPost: postDoc.toObject({ versionKey: false }) });
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

	const currentUser: TCurrentUser = res.locals.currentUser;
	if (postDoc.userId !== currentUser._id && !currentUser.isAdmin) {
		res.status(400).json({ error: 'not authorized' });
		return;
	}

	await postDoc.delete();

	res.status(200).json({ success: 'post deleted' });
};

export const createPost = catchAsyncRequestHandlerError(createPostUnsafe);
export const getPost = catchAsyncRequestHandlerError(getPostUnsafe);
export const updatePost = catchAsyncRequestHandlerError(updatePostUnsafe);
export const deletePost = catchAsyncRequestHandlerError(deletePostUnsafe);
