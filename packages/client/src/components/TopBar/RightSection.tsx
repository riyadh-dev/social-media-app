import AppsIcon from '@mui/icons-material/AppsRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDownRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import MessageIcon from '@mui/icons-material/MessageRounded';
import NotificationsIcon from '@mui/icons-material/NotificationsRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import { ListItemIcon, ListItemText } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';

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

	return (
		<Box>
			<IconButton
				sx={{
					p: 0,
					mx: '5px',
				}}
			>
				<Avatar alt='Avatar' />
			</IconButton>
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
				<MenuItem onClick={handleCloseUserMenu}>
					<ListItemIcon>
						<DarkModeIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Dark Mode</ListItemText>
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
