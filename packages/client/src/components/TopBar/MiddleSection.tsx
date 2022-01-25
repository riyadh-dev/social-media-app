import FavoriteIcon from '@mui/icons-material/FavoriteRounded';
import HomeIcon from '@mui/icons-material/HomeRounded';
import PeopleIcon from '@mui/icons-material/PeopleRounded';
import { Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const useCurrentTab = (paths: string[]) => {
	const currentPath = useLocation().pathname;
	return paths.includes(currentPath) ? currentPath : null;
};

const MiddleSection = () => {
	const tabValue = useCurrentTab(['/', '/friends', '/favorites']);

	return (
		<Box
			sx={{
				flexGrow: 1,
				visibility: { xs: 'hidden', md: 'visible' },
				width: { xs: 0, md: 'auto' },
			}}
		>
			<Tabs value={tabValue} centered>
				<Tab
					icon={<HomeIcon />}
					aria-label='Home'
					sx={{ height: '64px' }}
					component={Link}
					to='/'
					value='/'
				/>
				<Tab
					icon={<FavoriteIcon />}
					aria-label='Favorite'
					component={Link}
					to='/favorites'
					value='/favorites'
				/>
				<Tab
					icon={<PeopleIcon />}
					aria-label='Friends'
					component={Link}
					to='/friends'
					value='/friends'
				/>
			</Tabs>
		</Box>
	);
};
export default MiddleSection;
