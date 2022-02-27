import { Router } from 'express';
import { authenticate, validateInput } from '../common/middlewares';
import {
	createPostComment,
	deletePostComment,
	dislikePostComment,
	getPostComments,
	likePostComment,
	updatePostComment,
} from './controllers';
import {
	createPostCommentValidationSchema,
	getPostCommentsValidationSchema,
	updatePostCommentValidationSchema,
} from './validation';

const router = Router();

//create post comment
router.post(
	'/:postId',
	authenticate(),
	validateInput(createPostCommentValidationSchema),
	createPostComment
);

//get post comments
router.get(
	'/list/:date',
	validateInput(getPostCommentsValidationSchema),
	getPostComments
);

//update post
router.put(
	'/:id',
	authenticate(),
	validateInput(updatePostCommentValidationSchema),
	updatePostComment
);

//delete post
router.delete('/:id', authenticate(), deletePostComment);

//like post
router.put('/:id/like', authenticate(), likePostComment);

//dislike post
router.put('/:id/dislike', authenticate(), dislikePostComment);

export default router;
