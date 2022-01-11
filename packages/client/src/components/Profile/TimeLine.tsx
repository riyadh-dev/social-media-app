import { Paper, Stack, Typography } from '@mui/material';
import React from 'react';

const TimeLine = () => {
	return (
		<Stack
			direction={{ xs: 'column', md: 'row' }}
			justifyContent={{ xs: 'flex-start', md: 'center' }}
			alignItems={{ xs: 'center', md: 'flex-start' }}
			spacing={3}
			sx={{ mt: '20px' }}
		>
			<Paper sx={{ p: '20px', width: '400px' }}>
				<Typography
					sx={{ fontWeight: 'bold' }}
					variant='h3'
					color='#1976d2'
					gutterBottom
				>
					Profile
				</Typography>
			</Paper>
			<Paper sx={{ p: '20px', width: '400px' }}>
				<Typography
					sx={{ fontWeight: 'bold' }}
					variant='h3'
					color='#1976d2'
					gutterBottom
				>
					Profile
				</Typography>
			</Paper>
		</Stack>
	);
};

export default TimeLine;
