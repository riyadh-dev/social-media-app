import Joi from 'joi';
import { TLoginInput, TSignUpInput, TUserDB } from './interface';

export const signupValidationSchema = Joi.object<TSignUpInput>({
	username: Joi.string(),
	password: Joi.string().min(8),
	profilePicture: Joi.string().uri(),
});

export const loginValidationSchema = Joi.object<TLoginInput>({
	username: Joi.string(),
	password: Joi.string().min(8),
});

export const updateValidationSchema = Joi.object<TUserDB>({
	following: Joi.array().items(Joi.string()),
	followers: Joi.array().items(Joi.string()),
	isAdmin: Joi.boolean(),
	password: Joi.string().min(8),
	username: Joi.string(),
	profilePicture: Joi.string().uri(),
});
