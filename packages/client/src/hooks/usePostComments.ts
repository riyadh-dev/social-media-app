import { useQuery } from 'react-query';
import queryKeys from '../constants/reactQueryKeys';
import { getPostCommentQuery } from '../queries/postComments';

const useGetPostComments = (
	commentIds: string[] = [],
	postId: string,
	enabled: boolean
) => {
	return useQuery(
		queryKeys.postComments(postId),
		() => getPostCommentQuery(commentIds),
		{ enabled: Boolean(commentIds && commentIds.length && enabled) }
	);
};

export default useGetPostComments;
