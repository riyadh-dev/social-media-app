import { Router } from 'express';
import { authenticate, validateInput } from '../../common/middlewares';
import {
	createPost,
	deletePost,
	dislikePost,
	getLikedPosts,
	getPost,
	getTimelinePosts,
	likePost,
	updatePost,
} from './controllers';
import {
	createPostValidationSchema,
	updatePostValidationSchema,
} from './validation';

const router = Router();

//create post
router.post(
	'/',
	authenticate,
	validateInput(createPostValidationSchema, 'postInput'),
	createPost
);

//get timeline post
router.get('/timeline/:userId', getTimelinePosts);
router.get('/liked/:userId', getLikedPosts);

//read post
router.get('/:id', getPost);

//update posts
router.put(
	'/:id',
	authenticate,
	validateInput(updatePostValidationSchema, 'postInput'),
	updatePost
);

//delete post
router.delete('/:id', authenticate, deletePost);

//like post
router.put('/:id/like', authenticate, likePost);

//dislike post
router.put('/:id/dislike', authenticate, dislikePost);

export default router;
