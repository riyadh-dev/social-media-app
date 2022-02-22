import { Collapse, Stack } from '@mui/material';
import React from 'react';
import { useInfiniteQuery } from 'react-query';
import { TransitionGroup } from 'react-transition-group';
import { useRecoilState } from 'recoil';
import { useIntersectionObserver } from '../../common/hooks';
import { IPost } from '../../common/interfaces';
import { TimelineReq } from '../../common/requests';
import { currentUserState } from '../../recoil/states';
import PostForm from '../PostForm';
import Post from './Post';

const Feed = () => {
	const currentUser = useRecoilState(currentUserState)[0];
	const id = currentUser?._id ? currentUser._id : '';

	const { data, status, fetchNextPage } = useInfiniteQuery<IPost[]>(
		['posts', 'timeline', currentUser?._id],
		({ pageParam }) => TimelineReq(id, pageParam),
		{
			getNextPageParam: (lastPage) =>
				lastPage.length
					? Date.parse(lastPage[lastPage.length - 1].createdAt)
					: undefined,
		}
	);

	const { intersectionItemRef } = useIntersectionObserver<HTMLDivElement>({
		onIntersection: fetchNextPage,
		enable: status !== 'loading',
	});

	if (status !== 'success') return <></>;

	const posts = data?.pages.flat() ?? [];
	return (
		<Stack spacing={2.5} sx={{ mt: '84px', mb: '20px' }}>
			<PostForm />
			<TransitionGroup component={null}>
				{posts.map((post, idx) => (
					<Collapse timeout={800} key={post._id}>
						{idx + 1 === posts.length ? (
							<Post lastItemRef={intersectionItemRef} postData={post} />
						) : (
							<Post postData={post} />
						)}
					</Collapse>
				))}
			</TransitionGroup>
		</Stack>
	);
};

export default Feed;
