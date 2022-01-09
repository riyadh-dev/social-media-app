import FavoriteIcon from '@mui/icons-material/FavoriteRounded';
import HomeIcon from '@mui/icons-material/HomeRounded';
import PeopleIcon from '@mui/icons-material/PeopleRounded';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { useRecoilState } from 'recoil';
import { sideBarOpenState } from '../recoil/states';

const DRAWER_WIDTH = 300;

interface Props {
	window?: () => Window;
}
const SideBar = (props: Props) => {
	const { window } = props;
	const [sideBarOpen, setSideBarOpen] = useRecoilState(sideBarOpenState);

	const handleDrawerToggle = () => {
		setSideBarOpen(!sideBarOpen);
	};

	const drawer = (
		<div>
			<Toolbar />
			<Divider />
			<List
				sx={{
					mx: '8px',
					mt: '12px',
					'& .MuiButtonBase-root': {
						borderRadius: '8px',
						':hover': {
							borderRadius: '8px',
						},
					},
				}}
			>
				<ListItem button>
					<ListItemIcon>
						<HomeIcon />
					</ListItemIcon>
					<ListItemText>Home</ListItemText>
				</ListItem>
				<ListItem button>
					<ListItemIcon>
						<FavoriteIcon />
					</ListItemIcon>
					<ListItemText>Favorites</ListItemText>
				</ListItem>
				<ListItem button>
					<ListItemIcon>
						<PeopleIcon />
					</ListItemIcon>
					<ListItemText>Friends</ListItemText>
				</ListItem>
			</List>
		</div>
	);

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<Box
			component='nav'
			sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { xm: 0 } }}
			aria-label='mailbox folders'
		>
			<Drawer
				container={container}
				variant='temporary'
				open={sideBarOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{
					display: { xs: 'block', md: 'none' },
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: DRAWER_WIDTH,
					},
				}}
			>
				{drawer}
			</Drawer>

			<Drawer
				variant='permanent'
				sx={{
					display: { xs: 'none', md: 'block' },
					width: DRAWER_WIDTH,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: DRAWER_WIDTH,
						boxSizing: 'border-box',
						borderRight: 'none',
					},
				}}
			>
				{drawer}
			</Drawer>
		</Box>
	);
};

export default SideBar;
