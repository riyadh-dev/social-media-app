import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Badge, Button, Divider, Paper, Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { IPost } from '@social-media-app/shared';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import useDislikePost from '../../hooks/useDislike';
import useLikePost from '../../hooks/useLike';
import usePostComments from '../../hooks/usePostComments';
import { currentUserState } from '../../recoil/atoms';
import PostCommentForm from './PostCommentForm';

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

const CommentText = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#383838' : '#f0f2f5',
	borderRadius: '16px',
}));

const Post = ({
	post,
	lastItemRef,
}: {
	post: IPost;
	lastItemRef?: (node: HTMLDivElement) => void;
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

	const { data: comments, isLoading: areCommentsLoading } = usePostComments(
		post.comments,
		post.id,
		showComments
	);
	const { mutate: likeMutation } = useLikePost(post.id);
	const { mutate: dislikeMutation } = useDislikePost(post.id);

	const currentUser = useRecoilValue(currentUserState);
	const thumbUpColor = post.likes.includes(currentUser?.id ?? '')
		? 'primary'
		: 'inherit';
	const thumbDownColor = post.dislikes.includes(currentUser?.id ?? '')
		? 'error'
		: 'inherit';

	const postDate = new Date(post.createdAt).toLocaleDateString();
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
				subheader={postDate}
			/>
			{post.img && (
				<CardMedia component='img' image={post.img} alt='post img' />
			)}
			<CardContent>
				<Typography paragraph>{description}</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<IconButton aria-label='like' onClick={() => likeMutation()}>
					<Badge
						badgeContent={post.likes.length}
						color='primary'
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
					>
						<ThumbUpIcon color={thumbUpColor} />
					</Badge>
				</IconButton>
				<IconButton aria-label='dislike' onClick={() => dislikeMutation()}>
					<Badge
						badgeContent={post.dislikes.length}
						color='error'
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
					>
						<ThumbDownIcon color={thumbDownColor} />
					</Badge>
				</IconButton>
				<IconButton aria-label='share'>
					<ShareIcon />
				</IconButton>
				<Button
					onClick={handleShowComments}
					variant='text'
					sx={{ ml: 'auto' }}
					disabled={!post.comments.length || areCommentsLoading}
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
					{comments?.map((comment) => (
						<Stack key={comment.id} direction='row' spacing={2}>
							<Avatar src={comment.author.avatar} />
							<CommentText sx={{ px: '12px', py: '8px' }} elevation={0}>
								<Typography>{comment.text}</Typography>
							</CommentText>
						</Stack>
					))}
				</Stack>
			)}
		</Card>
	);
};

export default Post;
