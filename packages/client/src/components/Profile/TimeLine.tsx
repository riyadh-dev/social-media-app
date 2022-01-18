import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import {
	Button,
	ImageListItemBar,
	Link,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import React from 'react';
import Post from '../Feed/Post';

const TimeLine = () => {
	return (
		<Stack
			direction={{ xs: 'column', md: 'row' }}
			justifyContent={{ xs: 'flex-start', md: 'center' }}
			alignItems={{ xs: 'center', md: 'flex-start' }}
			spacing={3}
			sx={{ mt: '20px' }}
		>
			<Stack
				spacing={2.5}
				sx={{
					maxWidth: { xs: '680px', md: '400px' },
					width: { xs: '100%', md: 'auto' },
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

				<Paper sx={{ p: '20px', maxWidth: { xs: '680px', md: '400px' } }}>
					<Stack direction='row' spacing={1} justifyContent='space-between'>
						<Typography variant='h5' sx={{ fontWeight: 'bold' }}>
							Photos
						</Typography>
						<Button color='primary' variant='text'>
							See All Photos
						</Button>
					</Stack>
					<ImageList cols={3}>
						{itemData.map((item) => (
							<Link href={item.img}>
								<ImageListItem key={item.img}>
									<img
										src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
										srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
										alt={item.title}
										loading='lazy'
									/>
								</ImageListItem>
							</Link>
						))}
					</ImageList>
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
					<ImageList gap={16}>
						{itemData.slice(0, 4).map((item) => (
							<Link href={item.img} underline='none' color='inherit'>
								<ImageListItem key={item.img}>
									<img
										src={`${item.img}?w=248&fit=crop&auto=format`}
										srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
										alt={item.title}
										loading='lazy'
										style={{ borderRadius: '8px' }}
									/>
									<ImageListItemBar title={item.title} position='below' />
								</ImageListItem>
							</Link>
						))}
					</ImageList>
				</Paper>
			</Stack>

			<Stack spacing={2.5}>
				<Post />
				<Post />
				<Post />
				<Post />
			</Stack>
		</Stack>
	);
};

const itemData = [
	{
		img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
		title: 'Breakfast',
	},
	{
		img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
		title: 'Burger',
	},
	{
		img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
		title: 'Camera',
	},
	{
		img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
		title: 'Coffee',
	},
	{
		img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
		title: 'Hats',
	},
	{
		img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
		title: 'Honey',
	},
	{
		img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
		title: 'Basketball',
	},
	{
		img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
		title: 'Fern',
	},
	{
		img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
		title: 'Mushrooms',
	},
	{
		img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
		title: 'Tomato basil',
	},
	{
		img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
		title: 'Sea star',
	},
	{
		img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
		title: 'Bike',
	},
];

export default TimeLine;
