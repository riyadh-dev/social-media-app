import Joi from 'joi';
import { TPostInput } from '@social-media-app/shared';

export const createPostValidationSchema = Joi.object<TPostInput>({
	description: Joi.string().required(),
	img: Joi.string().uri(),
});

export const updatePostValidationSchema = Joi.object<TPostInput>({
	description: Joi.string(),
	img: Joi.string().uri(),
});
