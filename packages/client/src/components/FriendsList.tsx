import { Avatar, Badge, ListItemAvatar, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { useRecoilState, useRecoilValue } from 'recoil';
import { TUiUser } from '../common/types';
import queryKeys from '../constants/reactQueryKeys';
import useChatBox from '../hooks/useChatBox';
import useGetOnlineUsersIds from '../hooks/useGetOnlineUsers';
import useGetUsersById from '../hooks/useGetUsersById';
import { currentUserState, sideBarOpenState } from '../recoil/states';
import Chat from './Chat';

const DRAWER_WIDTH = 300;

interface Props {
	window?: () => Window;
}

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

const FriendsListItem = ({
	user,
	isOnline,
}: {
	user: TUiUser;
	isOnline: boolean;
}) => {
	const { onOpen } = useChatBox(user);

	if (!isOnline)
		return (
			<ListItem button onClick={onOpen}>
				<ListItemAvatar>
					<Avatar src={user.avatar} alt='Avatar' />
				</ListItemAvatar>
				<ListItemText primary={user.userName} />
			</ListItem>
		);

	return (
		<ListItem button onClick={onOpen}>
			<ListItemAvatar>
				<OnlineBadge
					overlap='circular'
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					variant='dot'
				>
					<Avatar src={user.avatar} alt='Avatar' />
				</OnlineBadge>
			</ListItemAvatar>
			<ListItemText primary={user.userName} />
		</ListItem>
	);
};

const FriendsList = (props: Props) => {
	const { window } = props;
	const [sideBarOpen, setSideBarOpen] = useRecoilState(sideBarOpenState);

	const handleDrawerToggle = () => {
		setSideBarOpen(!sideBarOpen);
	};

	const currentUser = useRecoilValue(currentUserState);
	const { data: friends } = useGetUsersById(
		currentUser?.friends,
		queryKeys.friends
	);

	//TODO try and use a map instead
	const { data: onlineUsersIds } = useGetOnlineUsersIds();

	const container =
		window !== undefined ? () => window().document.body : undefined;

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
				{friends &&
					friends.map((friend) => (
						<FriendsListItem
							key={friend.id}
							isOnline={onlineUsersIds?.includes(friend.id) ?? false}
							user={friend}
						/>
					))}
			</List>
		</div>
	);

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
			<Chat />
		</Box>
	);
};

export default FriendsList;
