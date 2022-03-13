import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Grid,
	Typography,
} from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import useAddFriend from '../../common/hooks/mutations/useAddFriend';
import useSuggestedFriends from '../../common/hooks/queries/useSuggestedFriends';
import { ICurrentUser } from '../../common/interfaces';

interface ISuggestedFriendCard {
	user: ICurrentUser;
	lastItemRef?: (node: HTMLDivElement) => void;
}

const CardItem = ({ user, lastItemRef }: ISuggestedFriendCard) => {
	const { mutate, isLoading } = useAddFriend(user._id);
	const onAddFriend = () => {
		mutate(user._id);
	};
	return (
		<Card sx={{ width: 200 }} ref={lastItemRef}>
			<Link to='/'>
				<CardMedia
					component='img'
					height='194'
					image={user.profilePicture}
					alt='user picture'
				/>
			</Link>

			<CardContent>
				<Typography gutterBottom variant='h5' component='div'>
					{user.username}
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
					<Grid item key={suggestedFriend._id}>
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
