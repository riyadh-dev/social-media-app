import { IPost, TPostInput } from '@social-media-app/shared';
import { axiosInstance } from '../services/axios';

export const addPost = async (postId: TPostInput): Promise<IPost> => {
	const { data } = await axiosInstance.post(`/posts`, postId, {
		withCredentials: true,
	});
	return data;
};

export const likePost = async (postId: string): Promise<IPost> => {
	const { data } = await axiosInstance.put(
		`/posts/${postId}/like`,
		{},
		{ withCredentials: true }
	);
	return data;
};

export const dislikePost = async (postId: string) => {
	const { data } = await axiosInstance.put(
		`/posts/${postId}/dislike`,
		{},
		{ withCredentials: true }
	);
	return data;
};
