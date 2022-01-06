import { Stack } from '@mui/material';
import React from 'react';
import Post from './Post';

const Feed = () => {
	return (
		<Stack spacing={3}>
			<Post />
			<Post />
			<Post />
			<Post />
		</Stack>
	);
};

export default Feed;
