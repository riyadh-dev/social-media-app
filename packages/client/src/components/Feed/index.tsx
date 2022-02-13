import { Stack } from '@mui/material';
import React from 'react';
import { useQuery } from 'react-query';
import { IPost } from '../../common/interfaces';
import { TimelineReq } from '../../common/requests';
import Post from './Post';

const Feed = () => {
	const { data, isError, isLoading } = useQuery<IPost[]>('posts', TimelineReq);

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
