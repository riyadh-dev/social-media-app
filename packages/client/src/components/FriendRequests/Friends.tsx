import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import useGetCurrentUserFriends from '../../hooks/useGetFriends';
import UserCard from './UserCard';

const FriendsCardList = () => {
	const { data: friends } = useGetCurrentUserFriends();
	if (!friends) return null;

	return (
		<>
			<Typography variant='h6' sx={{ mx: '18px', mt: '18px' }}>
				Friends
			</Typography>
			<Grid
				container
				direction='row'
				spacing={2}
				sx={{ p: '16px' }}
				justifyContent='flex-start'
			>
				{friends?.map((friend) => (
					<Grid item key={friend.id}>
						<UserCard cardType='friend' user={friend} />
					</Grid>
				))}
			</Grid>
		</>
	);
};

export default FriendsCardList;
