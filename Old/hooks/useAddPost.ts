import { useMutation } from 'react-query';
import { queryClient } from '../..';
import { IAddPostInput, IPost } from '../../common/interfaces';
import { axiosInstance } from '../../services/axios';

const server_domain = 'http://localhost:4000/api';

const addPost = async (postId: IAddPostInput): Promise<IPost> => {
	const { data } = await axiosInstance.post(`${server_domain}/posts`, postId, {
		withCredentials: true,
	});
	return data;
};

const useAddPost = () =>
	useMutation(addPost, {
		onSuccess: () => queryClient.invalidateQueries(['posts']),
	});

export default useAddPost;