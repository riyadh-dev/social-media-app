import { Stack } from '@mui/material';
import React from 'react';
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
			{posts &&
				posts.map((post, idx) =>
					idx + 1 === posts.length ? (
						<Post
							key={post._id}
							lastItemRef={intersectionItemRef}
							post={post}
						/>
					) : (
						<Post key={post._id} post={post} />
					)
				)}
		</Stack>
	);
};

export default Feed;
