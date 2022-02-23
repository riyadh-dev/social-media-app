import { Collapse, Stack } from '@mui/material';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import { useRecoilState } from 'recoil';
import useTimeline from '../../common/hooks/queries/useTimeline';
import { currentUserState } from '../../recoil/states';
import PostForm from '../PostForm';
import Post from './Post';

const Feed = () => {
	const userId = useRecoilState(currentUserState)[0]?._id;
	const { intersectionItemRef, data } = useTimeline(userId);

	const posts = data?.pages.flat();
	return (
		<Stack
			spacing={2.5}
			sx={{
				mt: '84px',
				mb: '20px',
				mx: '16px',
				width: { xs: '100%', md: '680px' },
			}}
		>
			<PostForm />
			{posts && (
				<TransitionGroup component={null}>
					{posts.map((post, idx) => (
						<Collapse timeout={800} key={post._id}>
							{idx + 1 === posts.length ? (
								<Post lastItemRef={intersectionItemRef} post={post} />
							) : (
								<Post post={post} />
							)}
						</Collapse>
					))}
				</TransitionGroup>
			)}
		</Stack>
	);
};

export default Feed;
