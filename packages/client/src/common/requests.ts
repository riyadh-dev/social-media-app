import axios from 'axios';
import { ILoginInput } from './interfaces';
import { TGetUsersInput } from './types';

const server_domain = 'http://localhost:4000/api';

export const loginReq = async (user: ILoginInput) => {
	const { data } = await axios.post(`${server_domain}/users/login`, user, {
		withCredentials: true,
	});
	return data;
};

export const logoutReq = async () => {
	const { data } = await axios.post(`${server_domain}/users/logout`, {
		withCredentials: true,
	});
	return data;
};

export const TimelineReq = async (userId: string) => {
	const { data } = await axios.get(
		`${server_domain}/posts/timeline/${userId}`,
		{
			withCredentials: true,
		}
	);
	return data;
};

export const UserReq = async (userId: string) => {
	const { data } = await axios.get(`${server_domain}/users/${userId}`, {
		withCredentials: true,
	});
	return data;
};

export const UsersReq = async (getUsersInput: TGetUsersInput | undefined) => {
	const { data } = await axios.post(
		`${server_domain}/users/list`,
		getUsersInput,
		{
			withCredentials: true,
		}
	);
	return data;
};

export const likePostReq = async (postId: string | undefined) => {
	const { data } = await axios.put(
		`${server_domain}/posts/${postId}/like`,
		{},
		{ withCredentials: true }
	);
	return data;
};

export const dislikePostReq = async (postId: string | undefined) => {
	const { data } = await axios.put(
		`${server_domain}/posts/${postId}/dislike`,
		{},
		{ withCredentials: true }
	);
	return data;
};
