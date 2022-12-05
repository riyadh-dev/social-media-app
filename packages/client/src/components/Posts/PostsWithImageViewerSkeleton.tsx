import {
	ArrowBack,
	ArrowForward,
	Close as CloseIcon,
	MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import ShareIcon from '@mui/icons-material/Share';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {
	Avatar,
	Box,
	CardHeader,
	Divider,
	IconButton,
	Paper,
	Skeleton,
	Stack,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PostCommentForm from './PostCommentForm';
import PostCommentsSkeleton from './PostCommentsSkeleton';

const PostsWithImageViewerSkeleton = () => (
	<Stack direction='row'>
		<Box
			width='70vw'
			position='relative'
			display='flex'
			justifyContent='center'
			alignItems='center'
		>
			<IconButton
				component={RouterLink}
				to={'/'}
				sx={{
					top: '8px',
					left: '8px',
					height: 'fit-content',
					position: 'absolute',
				}}
			>
				<Avatar>
					<CloseIcon />
				</Avatar>
			</IconButton>
			<IconButton
				disabled
				sx={{
					left: '8px',
					position: 'absolute',
					top: 0,
					bottom: 0,
					mt: 'auto',
					mb: 'auto',
					height: 'fit-content',
				}}
			>
				<Avatar>
					<ArrowBack />
				</Avatar>
			</IconButton>
			<IconButton
				disabled
				sx={{
					right: '8px',
					position: 'absolute',
					top: 0,
					bottom: 0,
					mt: 'auto',
					mb: 'auto',
					height: 'fit-content',
				}}
			>
				<Avatar>
					<ArrowForward />
				</Avatar>
			</IconButton>
			<Skeleton variant='rectangular' height='90%' width='85%' />
		</Box>

		<Paper
			sx={{
				borderRadius: 0,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Stack>
				<CardHeader
					avatar={<Skeleton variant='circular' height='40px' width='40px' />}
					action={
						<IconButton aria-label='settings'>
							<MoreVertIcon />
						</IconButton>
					}
					title={<Skeleton variant='rectangular' height='16px' width='140px' />}
				/>
				<Stack spacing={2} p='16px'>
					<Skeleton variant='rectangular' height='16px' width='460px' />
					<Skeleton variant='rectangular' height='16px' width='430px' />
					<Skeleton variant='rectangular' height='16px' width='400px' />
				</Stack>

				<Divider variant='middle' />
				<Stack direction='row' justifyContent='space-around' py='12px'>
					<span>
						<IconButton disabled aria-label='like'>
							<ThumbUpIcon />
						</IconButton>
						<IconButton aria-label='dislike' disabled>
							<ThumbDownIcon />
						</IconButton>
					</span>

					<IconButton aria-label='share'>
						<ShareIcon />
					</IconButton>
				</Stack>
				<Divider variant='middle' />
			</Stack>
			<Stack
				p='16px'
				direction='column'
				spacing={2}
				flexGrow={1}
				overflow='auto'
			>
				<PostCommentsSkeleton commentsNumber={8} />
			</Stack>
			<PostCommentForm postId='' />
		</Paper>
	</Stack>
);

export default PostsWithImageViewerSkeleton;
