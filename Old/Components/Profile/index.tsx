import { Box } from '@mui/material';
import React from 'react';
import TimeLine from './TimeLine';
import UpperSection from './UpperSection';

const Profile = () => {
	return (
		<Box sx={{ mt: '64px' }}>
			<UpperSection />
			<TimeLine />
		</Box>
	);
};

export default Profile;
