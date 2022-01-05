import FavoriteIcon from '@mui/icons-material/FavoriteRounded';
import HomeIcon from '@mui/icons-material/HomeRounded';
import MenuIcon from '@mui/icons-material/MenuRounded';
import PeopleIcon from '@mui/icons-material/PeopleRounded';
import SearchIcon from '@mui/icons-material/SearchRounded';
import {
	alpha,
	InputBase,
	ListItemIcon,
	ListItemText,
	styled,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';

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

const LeftSection = () => {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
		null
	);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				width: { md: '245px' },
			}}
		>
			<img
				src='https://cdn-icons-png.flaticon.com/512/4207/4207232.png'
				alt='Logo'
				style={{ width: '40px', marginInline: '5px' }}
			/>

			<Search sx={{ display: { xs: 'none', md: 'inline' } }}>
				<SearchIconWrapper>
					<SearchIcon />
				</SearchIconWrapper>
				<StyledInputBase
					placeholder='Search…'
					inputProps={{ 'aria-label': 'search' }}
				/>
			</Search>

			<IconButton
				sx={{
					p: 0,
					mx: '5px',
					display: { md: 'none' },
				}}
			>
				<Avatar>
					<SearchIcon />
				</Avatar>
			</IconButton>

			<Box
				sx={{
					mx: '5px',
					display: { xs: 'flex', md: 'none' },
				}}
			>
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
						display: { xs: 'inline', md: 'none' },
						mt: '10px',
					}}
				>
					<MenuItem>
						<ListItemIcon>
							<HomeIcon fontSize='small' />
						</ListItemIcon>
						<ListItemText>Home</ListItemText>
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
						<ListItemText>Friends</ListItemText>
					</MenuItem>
				</Menu>
			</Box>
		</Box>
	);
};
export default LeftSection;
