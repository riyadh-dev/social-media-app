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
	Badge,
	Box,
	CardHeader,
	Divider,
	IconButton,
	Paper,
	Stack,
	styled,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { Link as RouterLink, useParams } from 'react-router-dom';
import useDislikePost from '../../hooks/useDislike';
import useLikePost from '../../hooks/useLike';
import useGetPostComments from '../../hooks/usePostComments';
import { getPostsWithImagesQuery } from '../../queries/posts';
import PostCommentForm from '../Posts/PostCommentForm';

const CommentText = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#383838' : '#f0f2f5',
	borderRadius: '16px',
}));

const PostsWithImageViewer = () => {
	const { postId, authorId } = useParams();

	const { data, fetchNextPage } = useInfiniteQuery(
		['posts', 'posts-viewer'],
		({ pageParam = 'first' }) =>
			getPostsWithImagesQuery({ authorId, postId, date: pageParam }),
		{ getNextPageParam: (lastPage) => lastPage[lastPage.length - 1]?.createdAt }
	);

	const posts = data?.pages.flat();
	const [postIndex, setPostIndex] = useState(0);
	const canNext = postIndex + 1 < (posts?.length ?? 0);
	const canBack = postIndex > 0;

	const handleNext = () => {
		setPostIndex(postIndex + 1);
		if (postIndex % 2 === 0) fetchNextPage();
	};
	const handleBack = () => setPostIndex(postIndex - 1);

	const { mutate: likeMutation } = useLikePost(posts?.[postIndex].id);
	const { mutate: dislikeMutation } = useDislikePost(posts?.[postIndex].id);

	const { data: comments } = useGetPostComments(
		posts?.[postIndex].comments,
		Boolean(posts?.[postIndex].id),
		posts?.[postIndex].id
	);

	if (!posts) return null;

	return (
		<Stack width='100vw' height='100vh' direction='row'>
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
					onClick={handleBack}
					disabled={!canBack}
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
					onClick={handleNext}
					disabled={!canNext}
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
				<Box component='img' height='100%' src={posts[postIndex].img} />
			</Box>

			<Paper
				sx={{
					borderRadius: 0,
					height: '100vh',
					width: '30vw',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Stack>
					<CardHeader
						avatar={
							<Avatar
								src={posts[postIndex].author.avatar}
								aria-label='avatar'
								component={RouterLink}
								to={'/profile/' + posts[postIndex].author.id}
							/>
						}
						action={
							<IconButton aria-label='settings'>
								<MoreVertIcon />
							</IconButton>
						}
						title={posts[postIndex].author.userName}
						subheader={new Date(
							posts[postIndex].createdAt
						).toLocaleDateString()}
					/>
					<Typography px='16px' paragraph>
						{posts[postIndex].description}
					</Typography>
					<Divider variant='middle' />
					<Stack direction='row' justifyContent='space-around' py='12px'>
						<span>
							<IconButton aria-label='like' onClick={() => likeMutation()}>
								<Badge
									badgeContent={posts?.[postIndex].likes.length}
									color='primary'
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}
								>
									<ThumbUpIcon /* color={thumbUpColor} */ />
								</Badge>
							</IconButton>
							<IconButton
								aria-label='dislike'
								onClick={() => dislikeMutation()}
							>
								<Badge
									badgeContent={posts?.[postIndex].dislikes.length}
									color='error'
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right',
									}}
								>
									<ThumbDownIcon /* color={thumbDownColor} */ />
								</Badge>
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
					{comments?.map((comment) => (
						<Stack key={comment.id} direction='row' spacing={2}>
							<Avatar src={comment.author.avatar} />
							<CommentText sx={{ px: '12px', py: '8px' }} elevation={0}>
								<Typography>{comment.text}</Typography>
							</CommentText>
						</Stack>
					))}
				</Stack>
				<PostCommentForm postId={posts[postIndex].id} />
			</Paper>
		</Stack>
	);
};

export default PostsWithImageViewer;
