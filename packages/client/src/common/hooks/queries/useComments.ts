import axios from 'axios';
import { useQuery } from 'react-query';
import { IPostComment } from '../../interfaces';

const server_domain = 'http://localhost:4000/api/posts/comments';

const getComments = async (
	commentIds: string[] | undefined,
	date: number = Date.now()
): Promise<IPostComment[]> => {
	if (!commentIds) Promise.reject(new Error('Invalid ids'));
	const { data } = await axios.post(
		`${server_domain}/list/${date}`,
		commentIds,
		{ withCredentials: true }
	);
	return data;
};

const useComments = (
	commentIds: string[] = [],
	postId: string,
	enabled: boolean
) => {
	return useQuery(['postComments', postId], () => getComments(commentIds), {
		enabled: Boolean(commentIds && commentIds.length && enabled),
	});
};

export default useComments;
