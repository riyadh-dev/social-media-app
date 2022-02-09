import AppsIcon from '@mui/icons-material/AppsRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDownRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import MessageIcon from '@mui/icons-material/MessageRounded';
import NotificationsIcon from '@mui/icons-material/NotificationsRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import { Button, ListItemIcon, ListItemText } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { useRecoilState } from 'recoil';
import { currentUserState, themeState } from '../../recoil/states';

const RightSection = () => {
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null
	);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const [theme, setTheme] = useRecoilState(themeState);

	const handleToggleTheme = () => {
		setTheme((currVal) => ({
			isUserPicked: true,
			mode: currVal.mode === 'dark' ? 'light' : 'dark',
		}));
	};

	const currentUser = useRecoilState(currentUserState)[0];
	return (
		<Box>
			<Button
				sx={{
					mx: '5px',
					borderRadius: '24px',
					display: { xs: 'none', md: 'inline-flex' },
					textTransform: 'none',
				}}
				variant='text'
				startIcon={<Avatar alt='Avatar' />}
			>
				{currentUser?.username}
			</Button>
			<IconButton
				sx={{
					p: 0,
					mx: '5px',
					display: { xs: 'none', md: 'inline' },
				}}
			>
				<Avatar>
					<AppsIcon />
				</Avatar>
			</IconButton>
			<IconButton
				sx={{
					p: 0,
					mx: '5px',
				}}
			>
				<Avatar>
					<MessageIcon />
				</Avatar>
			</IconButton>
			<IconButton
				sx={{
					p: 0,
					mx: '5px',
				}}
			>
				<Avatar>
					<NotificationsIcon />
				</Avatar>
			</IconButton>
			<Tooltip title='Open settings'>
				<IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: '5px' }}>
					<Avatar>
						<ArrowDropDownIcon />
					</Avatar>
				</IconButton>
			</Tooltip>
			<Menu
				sx={{ mt: '50px' }}
				id='menu-appBar'
				anchorEl={anchorElUser}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}
			>
				<MenuItem onClick={handleCloseUserMenu}>
					<ListItemIcon>
						<SettingsIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Settings</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleToggleTheme}>
					<ListItemIcon>
						{theme.mode === 'light' ? (
							<DarkModeIcon fontSize='small' />
						) : (
							<LightModeIcon fontSize='small' />
						)}
					</ListItemIcon>
					<ListItemText>
						{theme.mode === 'light' ? 'Dark Mode' : 'Light Mode'}
					</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleCloseUserMenu}>
					<ListItemIcon>
						<LogoutIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Log Out</ListItemText>
				</MenuItem>
			</Menu>
		</Box>
	);
};
export default RightSection;
