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
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { TPaginatedPost, TPaginatedPostsType } from '../../common/types';
import { POSTS_PAGE_SIZE } from '../../constants/envVars';
import useDislikePost from '../../hooks/useDislike';
import useGetInfinitePosts from '../../hooks/useGetInfinitePosts';
import useLikePost from '../../hooks/useLike';
import { currentUserState } from '../../recoil/atoms';
import PostCommentForm from '../Posts/PostCommentForm';
import PostComments from '../Posts/PostComments';
import PostCommentsSkeleton from '../Posts/PostCommentsSkeleton';

//TODO refactor
const useRouteQuery = () => {
	const { search } = useLocation();
	return useMemo(() => new URLSearchParams(search), [search]);
};

const PostsWithImageViewer = () => {
	const { type, authorId } = useParams();
	const routeQuery = useRouteQuery();
	const page = parseInt(routeQuery.get('page') ?? '0');
	const index = parseInt(routeQuery.get('index') ?? '0');

	const currentUser = useRecoilValue(currentUserState);
	const { data, fetchNextPage } = useGetInfinitePosts(
		type as TPaginatedPostsType,
		authorId
	);

	useEffect(() => {
		fetchNextPage({ pageParam: 5 });
	}, [fetchNextPage]);
	const posts: TPaginatedPost[] = [];
	data?.pages
		.flat()
		.every((post, idx) => (post.img ? posts.push(post) : false));

	const [postIndex, setPostIndex] = useState(page * POSTS_PAGE_SIZE + index);
	const canNext = postIndex + 1 < (posts?.length ?? 0);
	const canBack = postIndex > 0;

	const handleNext = () => {
		setPostIndex(postIndex + 1);
		queryParams.index === 14
			? setQueryParams({ index: 0, page: queryParams.page + 1 })
			: setQueryParams({
					index: queryParams.index + 1,
					page: queryParams.page,
			  });
	};
	const handleBack = () => {
		setPostIndex(postIndex - 1);
		queryParams.index === 0
			? setQueryParams({ index: 14, page: queryParams.page - 1 })
			: setQueryParams({
					index: queryParams.index - 1,
					page: queryParams.page,
			  });
	};

	const { mutate: likeMutation } = useLikePost(posts?.[postIndex]);
	const { mutate: dislikeMutation } = useDislikePost(posts?.[postIndex]);

	useEffect(() => {
		if (postIndex > posts.length - 3) fetchNextPage();
	}, [fetchNextPage, postIndex, posts.length]);

	const [queryParams, setQueryParams] = useState({ page, index });
	useEffect(() => {
		window.history.replaceState(
			null,
			'Posts',
			`/posts/${type}/${currentUser?.id}?page=${queryParams.page}&index=${queryParams.index}`
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postIndex]);

	const from = useLocation().state?.from?.pathname ?? '/';

	if (!posts[postIndex]) return null;

	const isLiked = posts[postIndex].likes.includes(currentUser?.id ?? '');
	const isDisliked = posts[postIndex].dislikes.includes(currentUser?.id ?? '');

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
					to={from}
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
				<Box component='img' height='100%' src={posts?.[postIndex].img} />
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
								src={posts?.[postIndex].author.avatar}
								aria-label='avatar'
								component={RouterLink}
								to={'/profile/' + posts?.[postIndex].author.id}
							/>
						}
						action={
							<IconButton aria-label='settings'>
								<MoreVertIcon />
							</IconButton>
						}
						title={posts?.[postIndex].author.userName}
						subheader={new Date(
							posts?.[postIndex].createdAt
						).toLocaleDateString('en-gb', {
							year: 'numeric',
							day: 'numeric',
							month: 'long',
						})}
					/>
					<Typography px='16px' paragraph>
						{posts?.[postIndex].description}
					</Typography>
					<Divider variant='middle' />
					<Stack direction='row' justifyContent='space-around' py='12px'>
						<span>
							<IconButton
								disabled={isLiked}
								aria-label='like'
								onClick={() => likeMutation()}
							>
								<Badge
									badgeContent={posts?.[postIndex].likes.length}
									color='primary'
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}
								>
									<ThumbUpIcon color={isLiked ? 'primary' : 'inherit'} />
								</Badge>
							</IconButton>
							<IconButton
								aria-label='dislike'
								disabled={isDisliked}
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
									<ThumbDownIcon color={isDisliked ? 'error' : 'inherit'} />
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
					<Suspense fallback={<PostCommentsSkeleton commentsNumber={6} />}>
						<PostComments post={posts?.[postIndex]} />
					</Suspense>
				</Stack>
				<PostCommentForm postId={posts?.[postIndex].id as string} />
			</Paper>
		</Stack>
	);
};

export default PostsWithImageViewer;
