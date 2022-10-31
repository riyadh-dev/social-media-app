import { IUser } from '@social-media-app/shared';

export type TUpdateUser = Pick<
	IUser,
	'userName' | 'avatar' | 'email' | 'password'
>;
export type TCurrentUser = Omit<IUser, 'password'>;
export type TLoginInput = Pick<IUser, 'password' | 'email'>;
export type TSignUpInput = Pick<
	IUser,
	'userName' | 'email' | 'password' | 'avatar'
>;
