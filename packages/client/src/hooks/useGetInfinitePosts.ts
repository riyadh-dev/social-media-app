import { useInfiniteQuery } from 'react-query';
import { TInfinitePostsQueryType } from '../common/types';
import queryKeys from '../constants/reactQueryKeys';
import { getLikedPostsQuery, getTimelinePostsQuery } from '../queries/posts';
import useIntersectionObserver from './useIntersectionObserver';

const getPostsQuery = (queryType: TInfinitePostsQueryType) => {
	switch (queryType) {
		case 'timeline-posts':
			return getTimelinePostsQuery;
		case 'liked-posts':
			return getLikedPostsQuery;
	}
};

const queryKey = (queryType: TInfinitePostsQueryType) => {
	switch (queryType) {
		case 'timeline-posts':
			return queryKeys.timeline;
		case 'liked-posts':
			return queryKeys.likedPosts;
	}
};

const useGetInfinitePosts = (
	queryType: TInfinitePostsQueryType,
	userId?: string
) => {
	const postInfiniteQuery = useInfiniteQuery(
		queryKey(queryType)(userId),
		({ pageParam }) => getPostsQuery(queryType)(userId, pageParam),
		{
			getNextPageParam: (lastPage) => lastPage[lastPage.length - 1]?.createdAt,
		}
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

export default useGetInfinitePosts;
