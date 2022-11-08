import MenuIcon from '@mui/icons-material/MenuRounded';
import SearchIcon from '@mui/icons-material/SearchRounded';
import { alpha, InputBase, Stack, styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { sideBarOpenState } from '../../recoil/states';

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: '50px',
	backgroundColor: alpha(theme.palette.action.active, 0.1),
	'&:hover': {
		backgroundColor: alpha(theme.palette.action.active, 0.15),
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
	const setSideBarOpen = useRecoilState(sideBarOpenState)[1];

	const handleOpenSideBar = (event: React.MouseEvent<HTMLElement>) => {
		setSideBarOpen((currVal) => !currVal);
	};

	return (
		<Stack direction='row' alignItems='center' spacing={1}>
			<Link to='/'>
				<img
					src='https://cdn-icons-png.flaticon.com/512/4207/4207232.png'
					alt='Logo'
					style={{ width: '40px', height: '40px' }}
				/>
			</Link>

			<Search sx={{ display: { xs: 'none', md: 'inline' } }}>
				<SearchIconWrapper>
					<SearchIcon />
				</SearchIconWrapper>
				<StyledInputBase
					placeholder='Search…'
					inputProps={{ 'aria-label': 'search' }}
				/>
			</Search>

			<IconButton sx={{ display: { md: 'none' }, p: 0 }}>
				<Avatar>
					<SearchIcon />
				</Avatar>
			</IconButton>

			<IconButton
				sx={{
					display: { xs: 'flex', md: 'none' },
					p: 0,
				}}
				onClick={handleOpenSideBar}
			>
				<Avatar>
					<MenuIcon />
				</Avatar>
			</IconButton>
		</Stack>
	);
};
export default LeftSection;
