import axios from 'axios';
import { useMutation } from 'react-query';
import { queryClient } from '../../..';
import { IPost } from '../../interfaces';

const server_domain = 'http://localhost:4000/api';

const likePost = async (postId: string): Promise<IPost> => {
	const { data } = await axios.put(
		`${server_domain}/posts/${postId}/like`,
		{},
		{ withCredentials: true }
	);
	return data;
};

const useLikePost = (postId: string) =>
	useMutation(['post', postId], () => likePost(postId), {
		onSuccess: () => queryClient.invalidateQueries(['posts']),
	});

export default useLikePost;
