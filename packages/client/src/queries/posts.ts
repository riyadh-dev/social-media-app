import { IPost, TPostInput } from '@social-media-app/shared';
import { axiosInstance } from '../services/axios';

export const addPostQuery = async (postInput: TPostInput): Promise<IPost> => {
	const { data } = await axiosInstance.post('/posts', postInput, {
		withCredentials: true,
	});
	return data;
};

export const likePostQuery = async (postId: string): Promise<IPost> => {
	const { data } = await axiosInstance.put(`/posts/${postId}/like`, null, {
		withCredentials: true,
	});
	return data;
};

export const dislikePostQuery = async (postId: string) => {
	const { data } = await axiosInstance.put(`/posts/${postId}/dislike`, null, {
		withCredentials: true,
	});
	return data;
};

export const getTimelinePostsQuery = async (
	userId?: string,
	date: number = Date.now()
): Promise<IPost[]> => {
	console.log(userId, date);
	if (!userId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.get(
		`/posts/timeline/${userId}/${date}`,
		{ withCredentials: true }
	);
	return data;
};

export const getLikedPostsQuery = async (
	userId?: string,
	date: number = Date.now()
): Promise<IPost[]> => {
	console.log(userId, date);
	if (!userId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.get(`/posts/liked/${userId}/${date}`, {
		withCredentials: true,
	});
	return data;
};
