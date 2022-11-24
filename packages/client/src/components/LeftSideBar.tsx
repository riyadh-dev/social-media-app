import FavoriteIcon from '@mui/icons-material/FavoriteRounded';
import HomeIcon from '@mui/icons-material/HomeRounded';
import PeopleIcon from '@mui/icons-material/PeopleRounded';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { leftSideBarOpenState } from '../recoil/atoms';

const LeftSideBar = () => {
	const [sideBarOpen, setSideBarOpen] = useRecoilState(leftSideBarOpenState);

	const handleDrawerToggle = () => {
		setSideBarOpen(!sideBarOpen);
	};

	const { pathname } = useLocation();
	//TODO change ListItem button to ListItemButton
	const drawer = (
		<List sx={{ mx: '8px', mt: '76px' }}>
			<ListItem
				button
				component={RouterLink}
				to='/'
				selected={pathname === '/'}
			>
				<ListItemIcon>
					<HomeIcon />
				</ListItemIcon>
				<ListItemText>Home</ListItemText>
			</ListItem>
			<ListItem
				button
				component={RouterLink}
				to='/favorites'
				selected={pathname === '/favorites'}
			>
				<ListItemIcon>
					<FavoriteIcon />
				</ListItemIcon>
				<ListItemText>Favorites</ListItemText>
			</ListItem>
			<ListItem
				button
				component={RouterLink}
				to='/friends'
				selected={pathname === '/friends'}
			>
				<ListItemIcon>
					<PeopleIcon />
				</ListItemIcon>
				<ListItemText>Friends</ListItemText>
			</ListItem>
		</List>
	);

	return (
		<>
			<Drawer
				variant='temporary'
				open={sideBarOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{
					display: { xs: 'block', lg: 'none' },
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: 300,
					},
				}}
			>
				{drawer}
			</Drawer>

			<Drawer
				variant='permanent'
				sx={{
					display: { xs: 'none', lg: 'block' },
					width: 330,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: 330,
						boxSizing: 'border-box',
						borderRight: 'none',
					},
				}}
			>
				{drawer}
			</Drawer>
		</>
	);
};

export default LeftSideBar;
