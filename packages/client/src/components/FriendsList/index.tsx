import {
	Avatar,
	Badge,
	ListItemAvatar,
	ListItemButton,
	styled,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { TUiUser } from '../../common/types';
import useChatBox from '../../hooks/useChatBox';
import {
	useGetCurrentUserFriends,
	useGetOnlineUsersIds,
} from '../../hooks/usersHooks';
import ConditionalWrapper from '../ConditionalWrapper';

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

const OnlineBadgeWrapper = ({ children }: { children?: React.ReactNode }) => (
	<OnlineBadge
		overlap='circular'
		anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
		variant='dot'
	>
		{children}
	</OnlineBadge>
);

const FriendsListItem = ({
	user,
	isOnline,
}: {
	user: TUiUser;
	isOnline: boolean;
}) => {
	const { onOpen } = useChatBox(user);

	return (
		<ListItemButton onClick={onOpen}>
			<ListItemAvatar>
				<ConditionalWrapper condition={isOnline} wrapper={OnlineBadgeWrapper}>
					<Avatar src={user.avatar} alt='Avatar' />
				</ConditionalWrapper>
			</ListItemAvatar>
			<ListItemText primary={user.userName} />
		</ListItemButton>
	);
};

const FriendsList = () => {
	const { data: friends } = useGetCurrentUserFriends();
	const { data: onlineUsersIds } = useGetOnlineUsersIds();

	return (
		<Drawer
			variant='permanent'
			anchor='right'
			sx={{
				display: { xs: 'none', md: 'block' },
				width: 330,
				[`& .MuiDrawer-paper`]: {
					width: 330,
					border: 'none',
				},
			}}
		>
			<List sx={{ mx: '8px', mt: '76px' }}>
				{friends?.map((friend) => (
					<FriendsListItem
						key={friend.id}
						isOnline={onlineUsersIds?.includes(friend.id) ?? false}
						user={friend}
					/>
				))}
			</List>
		</Drawer>
	);
};

export default FriendsList;
