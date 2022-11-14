import { useMutation } from 'react-query';
import queryKeys from '../constants/reactQueryKeys';
import { dislikePostQuery } from '../queries/posts';

const useDislikePost = (postId: string) =>
	useMutation([queryKeys.post, postId], () => dislikePostQuery(postId));

export default useDislikePost;
