import AppsIcon from '@mui/icons-material/AppsRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDownRounded';
import FavoriteIcon from '@mui/icons-material/FavoriteRounded';
import HomeIcon from '@mui/icons-material/HomeRounded';
import MenuIcon from '@mui/icons-material/MenuRounded';
import MessageIcon from '@mui/icons-material/MessageRounded';
import NotificationsIcon from '@mui/icons-material/NotificationsRounded';
import PeopleIcon from '@mui/icons-material/PeopleRounded';
import SearchIcon from '@mui/icons-material/SearchRounded';
import {
	alpha,
	InputBase,
	ListItemIcon,
	ListItemText,
	styled,
	Tab,
	Tabs,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: '50px',
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(1),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: '12ch',
			'&:focus': {
				width: '20ch',
			},
		},
	},
}));

const TopBar = () => {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
		null
	);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null
	);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const [tabValue, setTabValue] = React.useState(0);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	return (
		<AppBar position='static'>
			<Container maxWidth={false}>
				<Toolbar disableGutters>
					<Box
						sx={{
							display: { xs: 'none', md: 'flex' },
							alignItems: 'center',
							width: '245px',
						}}
					>
						<Avatar
							sx={{ mr: '10px' }}
							src='https://img.icons8.com/fluency/240/000000/share-2.png'
						>
							SA
						</Avatar>
						<Search>
							<SearchIconWrapper>
								<SearchIcon />
							</SearchIconWrapper>
							<StyledInputBase
								placeholder='Search…'
								inputProps={{ 'aria-label': 'search' }}
							/>
						</Search>
					</Box>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size='large'
							aria-label='account of current user'
							aria-controls='menu-appBar'
							aria-haspopup='true'
							onClick={handleOpenNavMenu}
							color='inherit'
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id='menu-appBar'
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
								mt: '10px',
							}}
						>
							<MenuItem>
								<ListItemIcon>
									<HomeIcon fontSize='small' />
								</ListItemIcon>
								<ListItemText>Phone</ListItemText>
							</MenuItem>
							<MenuItem>
								<ListItemIcon>
									<FavoriteIcon fontSize='small' />
								</ListItemIcon>
								<ListItemText>Favorites</ListItemText>
							</MenuItem>
							<MenuItem>
								<ListItemIcon>
									<PeopleIcon fontSize='small' />
								</ListItemIcon>
								<ListItemText>Account</ListItemText>
							</MenuItem>
						</Menu>
					</Box>
					<Typography
						variant='h6'
						noWrap
						component='div'
						sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
					>
						SocialApp
					</Typography>
					<Box
						sx={{
							flexGrow: 1,
							zIndex: 1,
							display: { xs: 'none', md: 'flex' },
							justifyContent: 'center',
						}}
					>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							aria-label='icon tabs example'
							centered
						>
							<Tab icon={<HomeIcon />} aria-label='phone' sx={{ my: '8px' }} />
							<Tab icon={<FavoriteIcon />} aria-label='favorite' />
							<Tab icon={<PeopleIcon />} aria-label='person' />
						</Tabs>
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						<IconButton
							sx={{
								p: 0,
								mx: '5px',
								display: { xs: 'none', md: 'inline' },
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
								display: { xs: 'none', md: 'inline' },
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
								display: { xs: 'none', md: 'inline' },
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
							sx={{ mt: '45px' }}
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
							{settings.map((setting) => (
								<MenuItem key={setting} onClick={handleCloseNavMenu}>
									<Typography textAlign='center'>{setting}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default TopBar;
