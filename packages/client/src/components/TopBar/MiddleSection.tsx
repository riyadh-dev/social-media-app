import FavoriteIcon from '@mui/icons-material/FavoriteRounded';
import HomeIcon from '@mui/icons-material/HomeRounded';
import PeopleIcon from '@mui/icons-material/PeopleRounded';
import { Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';

const MiddleSection = () => {
	const [tabValue, setTabValue] = React.useState(0);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	return (
		<Box
			sx={{
				flexGrow: 1,
				visibility: { xs: 'hidden', md: 'visible' },
				width: { xs: 0, md: 'auto' },
			}}
		>
			<Tabs
				value={tabValue}
				onChange={handleTabChange}
				aria-label='icon tabs example'
				centered
			>
				<Tab icon={<HomeIcon />} aria-label='Home' sx={{ my: '8px' }} />
				<Tab icon={<FavoriteIcon />} aria-label='Favorite' />
				<Tab icon={<PeopleIcon />} aria-label='Friends' />
			</Tabs>
		</Box>
	);
};
export default MiddleSection;
