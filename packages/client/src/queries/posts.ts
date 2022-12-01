import {
	IGetPostsWithImagesInput,
	IPost,
	TPostInput,
} from '@social-media-app/shared';
import { axiosInstance } from '../services/axios';

export const addPostQuery = async (postInput: TPostInput): Promise<IPost> => {
	const { data } = await axiosInstance.post('/posts', postInput, {
		withCredentials: true,
	});
	return data;
};

export const likePostQuery = async (postId?: string): Promise<unknown> => {
	if (!postId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.put(`/posts/${postId}/like`, null, {
		withCredentials: true,
	});
	return data;
};

export const dislikePostQuery = async (postId?: string): Promise<unknown> => {
	if (!postId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.put(`/posts/${postId}/dislike`, null, {
		withCredentials: true,
	});
	return data;
};

export const getTimelinePostsQuery = async (
	userId?: string,
	date: number | 'first' = 'first'
): Promise<IPost[]> => {
	if (!userId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.get(
		`/posts/timeline/${userId}/${date}`,
		{ withCredentials: true }
	);
	return data;
};

export const getLikedPostsQuery = async (
	userId?: string,
	date: number | 'first' = 'first'
): Promise<IPost[]> => {
	if (!userId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.get(`/posts/liked/${userId}/${date}`, {
		withCredentials: true,
	});
	return data;
};

export const getPostsWithImagesQuery = async (
	getPostsWithImagesInput: IGetPostsWithImagesInput
): Promise<IPost[]> => {
	if (getPostsWithImagesInput.date === 'first') {
		delete getPostsWithImagesInput.date;
		delete getPostsWithImagesInput.authorId;
	} else delete getPostsWithImagesInput.postId;

	const { data } = await axiosInstance.post(
		'/posts/images/',
		getPostsWithImagesInput,
		{ withCredentials: true }
	);
	return data;
};
