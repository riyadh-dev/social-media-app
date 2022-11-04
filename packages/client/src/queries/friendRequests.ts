import { IFriendRequest } from '@social-media-app/shared/src';
import { axiosInstance } from '../services/axios';

export const sendFriendRequest = async (
	userId: string | undefined
): Promise<string> => {
	if (!userId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.post(
		`/friend-requests/send/${userId}`,
		{},
		{ withCredentials: true }
	);
	return data;
};

export const acceptFriendRequest = async (
	requestId: string | undefined
): Promise<string> => {
	if (!requestId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.put(
		`/friend-requests/accept/${requestId}`,
		{},
		{ withCredentials: true }
	);
	return data;
};

export const rejectFriendRequest = async (
	requestId: string | undefined
): Promise<string> => {
	if (!requestId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.put(
		`/friend-requests/reject/${requestId}`,
		{},
		{ withCredentials: true }
	);
	return data;
};

export const getSentFriendRequests = async (): Promise<IFriendRequest[]> => {
	const { data } = await axiosInstance.get(`/friend-requests/sent`, {
		withCredentials: true,
	});
	return data;
};

export const getReceivedFriendRequests = async (): Promise<
	IFriendRequest[]
> => {
	const { data } = await axiosInstance.get(`/friend-requests/received`, {
		withCredentials: true,
	});
	return data;
};
