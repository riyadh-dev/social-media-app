import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Grid,
	Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { TUiUser } from '../../common/interfaces';
import useAddFriend from '../../hooks/mutations/useAddFriend';
import useSuggestedFriends from '../../hooks/queries/useSuggestedFriends';

interface ISuggestedFriendCard {
	user: TUiUser;
	lastItemRef?: (node: HTMLDivElement) => void;
}

const CardItem = ({ user, lastItemRef }: ISuggestedFriendCard) => {
	const { mutate, isLoading } = useAddFriend(user.id);
	const onAddFriend = () => {
		mutate(user.id);
	};
	return (
		<Card sx={{ width: 200 }} ref={lastItemRef}>
			<Link to='/'>
				<CardMedia
					component='img'
					height='194'
					image={user.avatar}
					alt='user picture'
				/>
			</Link>

			<CardContent>
				<Typography gutterBottom variant='h5' component='div'>
					{user.userName}
				</Typography>
			</CardContent>
			<CardActions sx={{ flexDirection: 'column' }}>
				<Button
					variant='contained'
					fullWidth
					onClick={onAddFriend}
					disabled={isLoading}
				>
					add friend
				</Button>
			</CardActions>
		</Card>
	);
};

const FriendsListPage = () => {
	const { intersectionItemRef, data } = useSuggestedFriends();

	const suggestedFriends = data?.pages.flat();
	return (
		<Grid
			container
			direction='row'
			spacing={2}
			sx={{ mt: '84px' }}
			justifyContent='space-around'
		>
			{suggestedFriends &&
				suggestedFriends.map((suggestedFriend) => (
					<Grid item key={suggestedFriend.id}>
						<CardItem
							user={suggestedFriend}
							lastItemRef={intersectionItemRef}
						/>
					</Grid>
				))}
		</Grid>
	);
};

export default FriendsListPage;
