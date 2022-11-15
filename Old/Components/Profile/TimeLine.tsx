import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import {
	Button,
	ImageListItemBar,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Link as RouterLink, useParams } from 'react-router-dom';

const TimeLine = () => {
	const id = useParams<{ id: string }>().id;
	const userQuery = useUser(id);

	const friends = userQuery.data?.followings;
	const friendsQuery = useUsers(friends);

	const { intersectionItemRef, ...postsQuery } = useTimeline(id);

	const posts = postsQuery.data?.pages.flat() ?? [];
	return (
		<Stack
			direction={{ xs: 'column', md: 'row' }}
			justifyContent={{ xs: 'flex-start', md: 'center' }}
			alignItems={{ xs: 'center', md: 'flex-start' }}
			spacing={3}
			sx={{ mt: '20px', mx: '16px' }}
		>
			<Stack
				spacing={2.5}
				sx={{
					maxWidth: { xs: '680px', md: '400px' },
					width: { xs: '100%', md: '360' },
				}}
			>
				<Paper
					sx={{
						p: '20px',
					}}
				>
					<Stack spacing={2.5}>
						<Typography sx={{ fontWeight: 'bold' }} variant='h5'>
							Intro
						</Typography>
						<Stack direction='row' spacing={1} alignItems='center'>
							<BusinessCenterIcon />
							<Typography variant='body1'>Work</Typography>
						</Stack>
						<Stack direction='row' spacing={1} alignItems='center'>
							<SchoolIcon />
							<Typography variant='body1'>Study</Typography>
						</Stack>
						<Stack direction='row' spacing={1} alignItems='center'>
							<LocationOnIcon />
							<Typography variant='body1'>Live</Typography>
						</Stack>
						<Stack direction='row' spacing={1} alignItems='center'>
							<FavoriteIcon />
							<Typography variant='body1'>Relationship</Typography>
						</Stack>
						<Stack direction='row' spacing={1} alignItems='center'>
							<WatchLaterIcon />
							<Typography variant='body1'>Join Date</Typography>
						</Stack>
					</Stack>
				</Paper>

				<Paper sx={{ p: '20px' }}>
					<Stack direction='row' spacing={1} justifyContent='space-between'>
						<Typography variant='h5' sx={{ fontWeight: 'bold' }}>
							Photos
						</Typography>
						<Button color='primary' variant='text'>
							See All Photos
						</Button>
					</Stack>
					<ImageList cols={3}></ImageList>
				</Paper>

				<Paper sx={{ p: '20px', maxWidth: { xs: '680px', md: '400px' } }}>
					<Stack direction='row' spacing={1} justifyContent='space-between'>
						<Typography variant='h5' sx={{ fontWeight: 'bold' }}>
							Friends
						</Typography>
						<Button color='primary' variant='text'>
							See All Friends
						</Button>
					</Stack>
					{friendsQuery.data && (
						<ImageList cols={3} gap={8}>
							{friendsQuery.data?.map((friend) => (
								<ImageListItem
									component={RouterLink}
									key={friend.id}
									to={`/profile/${friend.id}`}
									sx={{ textDecoration: 'none', color: 'inherit' }}
								>
									<img
										src={friend.avatar}
										alt={friend.userName}
										loading='lazy'
										style={{ borderRadius: '8px' }}
									/>
									<ImageListItemBar title={friend.userName} position='below' />
								</ImageListItem>
							))}
						</ImageList>
					)}
				</Paper>
			</Stack>
		</Stack>
	);
};

export default TimeLine;
