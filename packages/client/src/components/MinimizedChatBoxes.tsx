import { Avatar, IconButton, Stack } from '@mui/material';
import React from 'react';

function MinimizedChatBoxes() {
	return (
		<Stack
			sx={{
				position: 'absolute',
				bottom: 10,
				right: 10,
				zIndex: 9999,
			}}
		>
			<IconButton aria-label='close'>
				<Avatar />
			</IconButton>
			<IconButton aria-label='close'>
				<Avatar />
			</IconButton>
			<IconButton aria-label='close'>
				<Avatar />
			</IconButton>
		</Stack>
	);
}

export default MinimizedChatBoxes;
