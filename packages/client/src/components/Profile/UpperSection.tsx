import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import useGetUserById from '../../hooks/useGetUserById';
import { currentUserState } from '../../recoil/atoms';

const COVER_IMG =
	'https://images.pexels.com/photos/2002719/pexels-photo-2002719.jpeg?cs=srgb&dl=pexels-timothy-paule-ii-2002719.jpg&fm=jpg';

const StyledBox = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
}));

const AvatarBox = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	border: `4px solid ${theme.palette.background.paper}`,
}));

const UpperSection = () => {
	const { userId } = useParams();
	const { data: user } = useGetUserById(userId);
	const currentUser = useRecoilValue(currentUserState);
	const isFriend = Boolean(currentUser?.friends.includes(userId as string));

	/* 	const addFriendMutation = useAddFriend();
	const removeFriendMutation = useRemoveFriend();

	const onAddRemoveFriend = () => {
		isFriend
			? removeFriendMutation.mutate(userId)
			: addFriendMutation.mutate(userId);
	};

	const isAddRemoveFriendLoading =
		addFriendMutation.isLoading || removeFriendMutation.isLoading; */

	return (
		<StyledBox
			sx={{
				width: '100%',
			}}
		>
			<Box
				sx={{
					px: { xs: 0, md: '20px' },
					pb: '20px',
					width: { xs: '100%', md: '980px' },
					mx: 'auto',
				}}
			>
				<img
					src={COVER_IMG}
					alt='cover'
					style={{
						width: '100%',
						overflow: 'hidden',
						display: 'flex',
						justifyContent: 'center',
						objectFit: 'cover',
						height: '350px',
						borderRadius: '0 0 8px 8px',
					}}
				/>
				<Stack
					direction={{ xs: 'column', md: 'row' }}
					justifyContent={{ xs: 'center', md: 'space-between' }}
				>
					<Stack
						direction={{ xs: 'column', md: 'row' }}
						alignItems={{ xs: 'center', md: 'flex-start' }}
					>
						<AvatarBox
							sx={{
								width: '150px',
								height: '150px',
								mt: '-40px',
								mx: '40px',
								borderRadius: '50%',
							}}
						>
							<Avatar
								alt='Avatar'
								src={user?.avatar}
								sx={{
									width: '100%',
									height: '100%',
								}}
							/>
						</AvatarBox>

						<Typography
							sx={{
								mt: '20px',
								fontWeight: 'bold',
							}}
							variant='h4'
							color='#1976d2'
							gutterBottom
						>
							{user?.userName}
						</Typography>
					</Stack>
					<Stack
						alignSelf={{ xs: 'center', md: 'flex-end' }}
						direction={{ xs: 'column', sm: 'row' }}
						spacing={2}
					>
						<Button
							startIcon={isFriend ? <PersonIcon /> : <PersonAddIcon />}
							variant={isFriend ? 'outlined' : 'contained'}
							/* 	onClick={onAddRemoveFriend}
							disabled={isAddRemoveFriendLoading} */
						>
							{isFriend ? 'Remove Friends' : 'Add Friends'}
						</Button>
						<Button
							startIcon={<ChatIcon />}
							variant={isFriend ? 'contained' : 'outlined'}
						>
							Message
						</Button>
					</Stack>
				</Stack>
			</Box>
		</StyledBox>
	);
};

export default UpperSection;
