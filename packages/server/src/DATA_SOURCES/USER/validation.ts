import Joi from 'joi';
import { TLoginInput, TSignUpInput, TUpdateUser } from './types';

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

export const updateValidationSchema = Joi.object<TUpdateUser>({
	userName: Joi.string().min(3),
	email: Joi.string().trim().lowercase().email(),
	avatar: Joi.string().uri(),
	password: Joi.string().min(8),
});
