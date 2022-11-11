import { IUser } from '@social-media-app/shared';
import { TLoginInput } from '@social-media-app/shared/';
import { TCurrentUser, TUiSignUpInput, TUiUser } from '../common/types';
import { axiosInstance } from '../services/axios';

export const signUpQuery = async (
	signUpInput: TUiSignUpInput
): Promise<unknown> => {
	const { confirmEmail, confirmPassword, ...payload } = signUpInput;
	const { data } = await axiosInstance.post('/users/signup', payload, {
		withCredentials: true,
	});
	return data;
};

export const loginQuery = async (user: TLoginInput): Promise<TCurrentUser> => {
	const { data } = await axiosInstance.post('/users/login', user, {
		withCredentials: true,
	});
	return data;
};

export const logoutQuery = async () =>
	await axiosInstance.delete('/users/logout', {
		withCredentials: true,
	});

export const getUsersByIdsQuery = async (
	userIds: string[] | undefined
): Promise<TUiUser[]> => {
	if (!userIds) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.post('/users/list', userIds, {
		withCredentials: true,
	});
	return data;
};

export const getOnlineUsersIdsQuery = async (): Promise<string[]> => {
	const { data } = await axiosInstance.get('/users/online', {
		withCredentials: true,
	});
	return data;
};

export const searchUsersByUserNameQuery = async (
	userName: string | undefined
): Promise<IUser[]> => {
	if (!userName) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.get(`/users/search/${userName}`, {
		withCredentials: true,
	});
	return data;
};
