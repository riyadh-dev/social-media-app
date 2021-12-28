import { Router } from 'express';
import { authenticate, validateInput } from '../common/middlewares';
import {
	createPost,
	deletePost,
	dislikePost,
	getPost,
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
	authenticate(),
	validateInput(createPostValidationSchema),
	createPost
);

//read post
router.get('/:id', getPost);

//update posts
router.put(
	'/:id',
	authenticate(),
	validateInput(updatePostValidationSchema),
	updatePost
);

//delete post
router.delete('/:id', authenticate(), deletePost);

//like post
router.put('/:id/like', authenticate(), likePost);

//dislike post
router.put('/:id/dislike', authenticate(), dislikePost);

//get timeline post

export default router;
