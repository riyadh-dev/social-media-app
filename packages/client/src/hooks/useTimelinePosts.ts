import { useInfiniteQuery } from 'react-query';
import queryKeys from '../constants/reactQueryKeys';
import { getTimelinePostsQuery } from '../queries/posts';
import useIntersectionObserver from './useIntersectionObserver';

const useTimelinePosts = (userId: string | undefined) => {
	const postInfiniteQuery = useInfiniteQuery(
		[...queryKeys.timeline, userId],
		({ pageParam }) => getTimelinePostsQuery(userId, pageParam),
		{ getNextPageParam: (lastPage) => lastPage[lastPage.length - 1]?.createdAt }
	);

	const intersectionItemRef = useIntersectionObserver({
		onIntersection: postInfiniteQuery.fetchNextPage,
		enable: !postInfiniteQuery.isLoading,
	});

	return {
		intersectionItemRef,
		...postInfiniteQuery,
	};
};

export default useTimelinePosts;
