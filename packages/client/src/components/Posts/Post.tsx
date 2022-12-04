import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Badge, Button, Divider, Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Suspense, useState } from 'react';
import { Link, Link as RouterLink, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { TPaginatedPost } from '../../common/types';
import useDislikePost from '../../hooks/useDislike';
import useLikePost from '../../hooks/useLike';
import { currentUserState } from '../../recoil/atoms';
import PostCommentForm from './PostCommentForm';
import PostComments from './PostComments';
import PostCommentsSkeleton from './PostCommentsSkeleton';

interface ExpandMoreProps extends IconButtonProps {
	expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
})(({ theme, expand }) => ({
	transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
	marginLeft: 'auto',
	transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shortest,
	}),
}));

const Post = ({
	post,
	observedItemRef: lastItemRef,
}: {
	post: TPaginatedPost;
	observedItemRef?: (node: HTMLDivElement) => void;
}) => {
	const [expanded, setExpanded] = useState(false);
	const handleExpandClick = () => setExpanded(!expanded);

	const [showComments, setShowComments] = useState(false);
	const handleShowComments = () => setShowComments((prev) => !prev);
	const canExpand = post.description.length > 160;
	const description =
		canExpand === true && expanded === false
			? post.description.substring(0, 160) + ' ...'
			: post.description;

	const { mutate: likeMutation } = useLikePost(post);
	const { mutate: dislikeMutation } = useDislikePost(post);

	const currentUser = useRecoilValue(currentUserState);

	const isLiked = post.likes.includes(currentUser?.id ?? '');
	const isDisliked = post.dislikes.includes(currentUser?.id ?? '');

	const location = useLocation();
	const postsType = location.pathname === '/favorites' ? 'liked' : 'timeline';
	return (
		<Card ref={lastItemRef}>
			<CardHeader
				avatar={
					<Avatar
						src={post.author.avatar}
						aria-label='avatar'
						component={RouterLink}
						to={'/profile/' + post.author.id}
					/>
				}
				action={
					<IconButton aria-label='settings'>
						<MoreVertIcon />
					</IconButton>
				}
				title={post.author.userName}
				subheader={new Date(post.createdAt).toLocaleDateString('en-gb', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})}
			/>
			{post.img && (
				<Link
					to={`/posts/${postsType}/${currentUser?.id}?page=${post.page}&index=${post.index}`}
					state={{ from: location }}
				>
					<CardMedia component='img' image={post.img} alt='post img' />
				</Link>
			)}
			<CardContent>
				<Typography paragraph>{description}</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<IconButton
					disabled={isLiked}
					aria-label='like'
					onClick={() => likeMutation()}
				>
					<Badge
						badgeContent={post.likes.length}
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
					disabled={isDisliked}
					aria-label='dislike'
					onClick={() => dislikeMutation()}
				>
					<Badge
						badgeContent={post.dislikes.length}
						color='error'
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
					>
						<ThumbDownIcon color={isDisliked ? 'error' : 'inherit'} />
					</Badge>
				</IconButton>
				<IconButton aria-label='share'>
					<ShareIcon />
				</IconButton>
				<Button
					onClick={handleShowComments}
					variant='text'
					sx={{ ml: 'auto' }}
					disabled={!post.comments.length}
				>
					{post.comments.length} Comments
				</Button>
				{canExpand && (
					<ExpandMore
						expand={expanded}
						onClick={handleExpandClick}
						aria-expanded={expanded}
						aria-label='show more'
					>
						<ExpandMoreIcon />
					</ExpandMore>
				)}
			</CardActions>
			<Divider variant='middle' />
			<PostCommentForm postId={post.id} />

			{showComments && (
				<Stack direction='column' spacing={3} sx={{ m: 3 }}>
					<Suspense fallback={<PostCommentsSkeleton commentsNumber={8} />}>
						<PostComments post={post} />
					</Suspense>
				</Stack>
			)}
		</Card>
	);
};

export default Post;
