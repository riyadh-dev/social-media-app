import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Badge, Button, Divider, Paper, Stack, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import useAddPostComment from '../../common/hooks/mutations/useAddComment';
import useDislikePost from '../../common/hooks/mutations/useDislike';
import useLikePost from '../../common/hooks/mutations/useLike';
import useComments from '../../common/hooks/queries/useComments';
import { IPost } from '../../common/interfaces';
import { currentUserState } from '../../recoil/states';

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

export default function Post({
	post,
	lastItemRef,
}: {
	post: IPost;
	lastItemRef?: (node: HTMLDivElement) => void;
}) {
	const [expanded, setExpanded] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const currentUser = useRecoilState(currentUserState)[0];

	const { handleSubmit, register, reset } = useForm<{ text: string }>();

	const commentsQuery = useComments(post.comments, post._id, showComments);

	const addPostMutation = useAddPostComment(post._id);
	const likeMutation = useLikePost(post._id);
	const dislikeMutation = useDislikePost(post._id);

	const onSubmit = (postComment: { text: string }) => {
		addPostMutation.mutate(postComment);
	};

	useEffect(() => {
		if (addPostMutation.isSuccess) reset();
	}, [addPostMutation.isSuccess, reset]);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const handleShowComments = () => {
		setShowComments((prev) => !prev);
	};

	const canExpand = post.description.length > 160;
	const description =
		canExpand === true && expanded === false
			? post.description.substring(0, 160) + ' ...'
			: post.description;

	const thumbUpColor = post.likes.includes(currentUser?._id ?? '')
		? 'primary'
		: 'inherit';
	const thumbDownColor = post.dislikes.includes(currentUser?._id ?? '')
		? 'error'
		: 'inherit';

	const postDate = new Date(post.createdAt).toLocaleDateString();
	return (
		<Card ref={lastItemRef}>
			<CardHeader
				avatar={
					<Avatar
						src={post.author.profilePicture}
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
				title={post.author.username}
				subheader={postDate}
			/>
			{post.img && (
				<CardMedia component='img' image={post.img} alt='post img' />
			)}
			<CardContent>
				<Typography paragraph>{description}</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<IconButton aria-label='like' onClick={() => likeMutation.mutate()}>
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
				<IconButton
					aria-label='dislike'
					onClick={() => dislikeMutation.mutate()}
				>
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
					disabled={!post.comments.length || commentsQuery.isLoading}
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
			<Stack
				direction='row'
				spacing={2}
				sx={{ m: 3 }}
				component='form'
				onSubmit={handleSubmit(onSubmit)}
			>
				<Avatar src={currentUser?.profilePicture} />
				<TextField
					placeholder='Write a comment...'
					size='small'
					fullWidth
					helperText='Press Enter to post.'
					disabled={addPostMutation.isLoading}
					{...register('text')}
				/>
			</Stack>

			{showComments && (
				<Stack direction='column' spacing={3} sx={{ m: 3 }}>
					{commentsQuery.data?.map((comment) => (
						<Stack key={comment._id} direction='row' spacing={2}>
							<Avatar src={comment.author.profilePicture} />
							<CommentText sx={{ px: '12px', py: '8px' }} elevation={0}>
								<Typography>{comment.text}</Typography>
							</CommentText>
						</Stack>
					))}
				</Stack>
			)}
		</Card>
	);
}
