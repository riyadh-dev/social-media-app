import { useMutation } from 'react-query';
import queryKeys from '../constants/reactQueryKeys';
import { likePostQuery } from '../queries/posts';

//optimistic updates
const useLikePost = (postId: string) =>
	useMutation([queryKeys.post, postId], () => likePostQuery(postId));

export default useLikePost;
