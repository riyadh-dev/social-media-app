import { Avatar, Badge, ListItemAvatar, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { useRecoilState } from 'recoil';
import { sideBarOpenState } from '../../recoil/states';

const DRAWER_WIDTH = 300;

interface Props {
	window?: () => Window;
}

interface IUserInArr {
	username: string;
	isOnline: boolean;
}

const Users: IUserInArr[] = [
	{ username: 'Ino', isOnline: false },
	{ username: 'Millia Rage', isOnline: true },
	{ username: 'Baiken', isOnline: false },
	{ username: 'Chipp', isOnline: true },
];

const OnlineBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		backgroundColor: '#44b700',
		color: '#44b700',
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		'&::after': {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			animation: 'ripple 1.2s infinite ease-in-out',
			border: '1px solid currentColor',
			content: '""',
		},
	},
	'@keyframes ripple': {
		'0%': {
			transform: 'scale(.8)',
			opacity: 1,
		},
		'100%': {
			transform: 'scale(2.4)',
			opacity: 0,
		},
	},
}));

const FriendsListItem = ({ username, isOnline }: IUserInArr) => {
	if (!isOnline)
		return (
			<ListItem button key={username}>
				<ListItemAvatar>
					<Avatar alt='Avatar' />
				</ListItemAvatar>
				<ListItemText primary={username} />
			</ListItem>
		);

	return (
		<ListItem button key={username}>
			<ListItemAvatar>
				<OnlineBadge
					overlap='circular'
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					variant='dot'
				>
					<Avatar alt='Avatar' />
				</OnlineBadge>
			</ListItemAvatar>
			<ListItemText primary={username} />
		</ListItem>
	);
};

const FriendsList = (props: Props) => {
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
				{Users.map((user) => (
					<FriendsListItem isOnline={user.isOnline} username={user.username} />
				))}
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
				anchor='right'
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
				anchor='right'
				sx={{
					display: { xs: 'none', md: 'block' },
					width: DRAWER_WIDTH,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: DRAWER_WIDTH,
						boxSizing: 'border-box',
						border: 'none',
					},
				}}
			>
				{drawer}
			</Drawer>
		</Box>
	);
};

export default FriendsList;
