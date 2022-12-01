import {
	Favorite as FavoriteIcon,
	House as HouseIcon,
	LocationOn as LocationOnIcon,
	Person as PersonIcon,
} from '@mui/icons-material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SchoolIcon from '@mui/icons-material/School';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import {
	Button,
	ImageList,
	ImageListItem,
	ImageListItemBar,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import { IPost } from '@social-media-app/shared/src';
import { debounce } from 'lodash';
import { useCallback, useRef, useState } from 'react';
import { InfiniteData } from 'react-query';
import { Link, Link as RouterLink, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { queryClient } from '../..';
import queryKeys from '../../constants/reactQueryKeys';
import { useGetUserById, useGetUsersById } from '../../hooks/usersHooks';
import { currentUserState } from '../../recoil/atoms';

const LeftSection = () => {
	const { userId } = useParams();
	const currentUser = useRecoilValue(currentUserState);
	const { data: user } = useGetUserById(userId);
	const { data: friends } = useGetUsersById(
		user?.friends,
		queryKeys.friends(userId)
	);

	const images = queryClient
		.getQueryData<InfiniteData<IPost>>(queryKeys.timeline(userId))
		?.pages.flat()
		.reduce<{ id: string; img: string }[]>((prev, { id, img }, idx, arr) => {
			if (!img) return prev;
			if (prev.length === 8) arr.splice(1);
			return prev.concat({ id, img });
		}, []);

	const [top, setTop] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	useCallback(() => {
		const containerElement = containerRef.current;
		const debouncedSetTop = debounce(
			() => setTop(containerElement ? containerElement.clientHeight + 16 : 0),
			100
		);

		const resizeObserver = new ResizeObserver(debouncedSetTop);
		if (containerElement) resizeObserver.observe(containerElement);

		return () => {
			resizeObserver.disconnect();
			debouncedSetTop.cancel();
		};
	}, [])();

	if (!user) return <></>;

	return (
		<Stack
			ref={containerRef}
			spacing={2.5}
			sx={{
				maxWidth: { xs: '680px', md: '425px' },
				width: { xs: '95%', md: '360' },
				position: { xs: 'initial', md: 'sticky' },
				top: { xs: 'initial', md: `calc(100vh - ${top}px)` },
			}}
		>
			<Paper
				sx={{
					p: '16px',
				}}
			>
				<Stack spacing={2.5}>
					<Stack direction='row' spacing={1} justifyContent='space-between'>
						<Typography variant='h5' sx={{ fontWeight: 'bold' }}>
							Intro
						</Typography>
						{userId === currentUser?.id && (
							<Button
								component={Link}
								to='/setting/intro'
								color='primary'
								variant='text'
							>
								Edit
							</Button>
						)}
					</Stack>
					{user.intro?.bio && (
						<Stack direction='row' spacing={1}>
							<PersonIcon />
							<Typography variant='body1'>Bio: {user.intro?.bio}</Typography>
						</Stack>
					)}
					{user.intro?.work && (
						<Stack direction='row' spacing={1} alignItems='center'>
							<BusinessCenterIcon />
							<Typography variant='body1'>
								Works at {user.intro?.work}
							</Typography>
						</Stack>
					)}
					{user.intro?.studiedAt && (
						<Stack direction='row' spacing={1} alignItems='center'>
							<SchoolIcon />
							<Typography variant='body1'>
								Studied at {user.intro?.studiedAt}
							</Typography>
						</Stack>
					)}
					{user.intro?.studiesAt && (
						<Stack direction='row' spacing={1} alignItems='center'>
							<SchoolIcon />
							<Typography variant='body1'>
								Studies at {user.intro?.studiesAt}
							</Typography>
						</Stack>
					)}
					{user.intro?.from && (
						<Stack direction='row' spacing={1} alignItems='center'>
							<LocationOnIcon />
							<Typography variant='body1'>From {user.intro?.from}</Typography>
						</Stack>
					)}
					{user.intro?.address && (
						<Stack direction='row' spacing={1} alignItems='center'>
							<HouseIcon />
							<Typography variant='body1'>
								Lives in {user.intro?.address}
							</Typography>
						</Stack>
					)}
					{user.intro?.relationshipStatus && (
						<Stack direction='row' spacing={1} alignItems='center'>
							<FavoriteIcon />
							<Typography variant='body1'>
								{user.intro?.relationshipStatus}
							</Typography>
						</Stack>
					)}
					<Stack direction='row' spacing={1} alignItems='center'>
						<WatchLaterIcon />
						<Typography variant='body1'>
							Join Date: {new Date(user.createdAt).toLocaleString()}
						</Typography>
					</Stack>
				</Stack>
			</Paper>

			<Paper sx={{ p: '16px' }}>
				<Stack direction='row' spacing={1} justifyContent='space-between'>
					<Typography variant='h5' sx={{ fontWeight: 'bold' }}>
						Photos
					</Typography>
					<Button color='primary' variant='text'>
						See All Photos
					</Button>
				</Stack>
				{/* TODO implement an image view */}
				<ImageList cols={3} sx={{ borderRadius: '8px' }}>
					{images?.map((image) => (
						<ImageListItem
							component={RouterLink}
							key={'post-image-' + image.id}
							to={`/posts/${userId}/${image.id}`}
						>
							<img src={image.img} alt='post' loading='lazy' />
						</ImageListItem>
					)) ?? <></>}
				</ImageList>
			</Paper>

			<Paper sx={{ p: '16px' }}>
				<Stack direction='row' spacing={1} justifyContent='space-between'>
					<Typography variant='h5' sx={{ fontWeight: 'bold' }}>
						Friends
					</Typography>
					<Button
						component={Link}
						to={`/friends/${user.id}`}
						color='primary'
						variant='text'
					>
						See All Friends
					</Button>
				</Stack>
				<ImageList cols={3} gap={16}>
					{friends?.slice(0, 9).map((friend) => (
						<ImageListItem
							component={RouterLink}
							key={friend.id}
							to={`/profile/${friend.id}`}
							sx={{
								textDecoration: 'none',
								color: 'inherit',
								width: '120px',
							}}
						>
							<img
								src={friend.avatar}
								alt={friend.userName}
								loading='lazy'
								style={{ borderRadius: '8px' }}
							/>
							<ImageListItemBar title={friend.userName} position='below' />
						</ImageListItem>
					)) ?? <></>}
				</ImageList>
			</Paper>
		</Stack>
	);
};

export default LeftSection;
