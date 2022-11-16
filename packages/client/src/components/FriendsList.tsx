import { Avatar, Badge, ListItemAvatar, styled } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useRecoilValue } from 'recoil';
import { TUiUser } from '../common/types';
import queryKeys from '../constants/reactQueryKeys';
import useChatBox from '../hooks/useChatBox';
import useGetOnlineUsersIds from '../hooks/useGetOnlineUsers';
import useGetUsersById from '../hooks/useGetUsersById';
import { currentUserState } from '../recoil/atoms';
import ConditionalWrapper from './ConditionalWrapper';

const DRAWER_WIDTH = 300;

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
		<ListItem button onClick={onOpen}>
			<ListItemAvatar>
				<ConditionalWrapper condition={isOnline} wrapper={OnlineBadgeWrapper}>
					<Avatar src={user.avatar} alt='Avatar' />
				</ConditionalWrapper>
			</ListItemAvatar>
			<ListItemText primary={user.userName} />
		</ListItem>
	);
};

const FriendsList = () => {
	const currentUser = useRecoilValue(currentUserState);
	const { data: friends } = useGetUsersById(
		currentUser?.friends,
		queryKeys.friends(currentUser?.id)
	);

	const { data: onlineUsersIds } = useGetOnlineUsersIds();

	return (
		<Drawer
			variant='permanent'
			anchor='right'
			sx={{
				display: { xs: 'none', md: 'block' },
				width: DRAWER_WIDTH,
				[`& .MuiDrawer-paper`]: {
					width: DRAWER_WIDTH,
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
