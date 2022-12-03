import { useInfiniteQuery } from 'react-query';
import { TPaginatedPostsType } from '../common/types';
import queryKeys from '../constants/reactQueryKeys';
import { getPaginatedPostsQuery } from '../queries/posts';
import useIntersectionObserver from './useIntersectionObserver';

const useGetInfinitePosts = (
	queryType: TPaginatedPostsType,
	userId?: string
) => {
	const postInfiniteQuery = useInfiniteQuery(
		queryKeys.posts(queryType, userId),
		({ pageParam }) => getPaginatedPostsQuery(queryType, userId, pageParam),
		{ getNextPageParam: (_, pages) => pages.length }
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
