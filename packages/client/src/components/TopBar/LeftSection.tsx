import MenuIcon from '@mui/icons-material/MenuRounded';
import { alpha, InputBase, Stack, styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { leftSideBarOpenState } from '../../recoil/atoms';
import UserSearch from './UserSearch';

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
			width: '200px',
		},
	},
}));

const LeftSection = () => {
	const setLeftSideBarOpen = useSetRecoilState(leftSideBarOpenState);
	const handleOpenSideBar = () => setLeftSideBarOpen((prev) => !prev);

	return (
		<Stack direction='row' alignItems='center' spacing={1}>
			<Link style={{ marginBottom: '-6.4px' }} to='/'>
				<img
					src='https://cdn-icons-png.flaticon.com/512/4207/4207232.png'
					alt='Logo'
					style={{ width: '40px', height: '40px' }}
				/>
			</Link>

			<UserSearch />

			<IconButton
				sx={{
					display: { lg: 'none' },
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
