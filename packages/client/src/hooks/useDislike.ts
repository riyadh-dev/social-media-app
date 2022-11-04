import { useMutation } from 'react-query';
import { queryClient } from '../..';
import { IPost } from '../../common/interfaces';
import { axiosInstance } from '../../services/axios';

const server_domain = 'http://localhost:4000/api';

const dislikePost = async (postId: string) => {
	const { data } = await axiosInstance.put(
		`${server_domain}/posts/${postId}/dislike`,
		{},
		{ withCredentials: true }
	);
	return data;
};

const useDislikePost = (postId: string) =>
	useMutation<IPost>(['post', postId], () => dislikePost(postId), {
		onSuccess: () => queryClient.invalidateQueries(['posts']),
	});

export default useDislikePost;
