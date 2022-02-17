import { Stack } from '@mui/material';
import React from 'react';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { IPost } from '../../common/interfaces';
import { TimelineReq } from '../../common/requests';
import { currentUserState } from '../../recoil/states';
import Post from './Post';

const Feed = () => {
	const currentUser = useRecoilState(currentUserState)[0];

	const { data, isError, isLoading } = useQuery<IPost[]>(
		['posts', 'timeline', currentUser?._id],
		() => TimelineReq(currentUser ? currentUser._id : ''),
		{ enabled: Boolean(currentUser) }
	);

	if (isError) return <h1>Error</h1>;
	if (isLoading) return <h1>Loading</h1>;

	return (
		<Stack spacing={2.5} sx={{ mt: '84px', mb: '20px' }}>
			{data?.map((post) => (
				<Post key={post._id} postData={post} />
			))}
		</Stack>
	);
};

export default Feed;
