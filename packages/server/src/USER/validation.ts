import Joi from 'joi';
import IUser from './interface';

export const signupValidationSchema = Joi.object<IUser>({
	username: Joi.string(),
	password: Joi.string().min(8),
	profilePicture: Joi.string().uri(),
});

export const loginValidationSchema = Joi.object<IUser>({
	username: Joi.string(),
	password: Joi.string().min(8),
});
