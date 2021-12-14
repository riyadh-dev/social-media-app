import Joi from 'joi';
import { TLoginInput, TSignUpInput } from './interface';

export const signupValidationSchema = Joi.object<TSignUpInput>({
	username: Joi.string(),
	password: Joi.string().min(8),
	profilePicture: Joi.string().uri(),
});

export const loginValidationSchema = Joi.object<TLoginInput>({
	username: Joi.string(),
	password: Joi.string().min(8),
});
