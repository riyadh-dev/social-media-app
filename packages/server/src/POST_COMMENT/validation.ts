import Joi from 'joi';
import { TPostCommentInput } from './types';

export const createPostCommentValidationSchema = Joi.object<TPostCommentInput>({
	text: Joi.string().required(),
});

export const updatePostCommentValidationSchema = Joi.object<TPostCommentInput>({
	text: Joi.string().required(),
});

export const getPostCommentsValidationSchema = Joi.array().items(Joi.string());
