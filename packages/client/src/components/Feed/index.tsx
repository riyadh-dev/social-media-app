import { Stack } from '@mui/material';
import React from 'react';
import Post from './Post';

const Feed = () => {
	return (
		<Stack spacing={2.5} sx={{ mt: '84px', mb: '20px' }}>
			<Post />
			<Post />
			<Post />
			<Post />
		</Stack>
	);
};

export default Feed;
