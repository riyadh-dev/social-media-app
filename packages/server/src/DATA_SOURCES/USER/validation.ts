import Joi from 'joi';
import {
	TLoginInput,
	TSignUpInput,
	TUpdateUserInput,
} from '@social-media-app/shared';

export const signupValidationSchema = Joi.object<TSignUpInput>({
	userName: Joi.string(),
	email: Joi.string().trim().lowercase().email(),
	password: Joi.string().min(8),
	avatar: Joi.string().uri().optional(),
});

export const loginValidationSchema = Joi.object<TLoginInput>({
	email: Joi.string().trim().lowercase().email(),
	password: Joi.string().min(8),
});

export const updateUserValidationSchema = Joi.object<TUpdateUserInput>({
	userName: Joi.string().min(3),
	email: Joi.string().trim().lowercase().email(),
	avatar: Joi.string().uri(),
	password: Joi.string().min(8),
});
