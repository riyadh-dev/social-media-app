import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Badge } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import useDislikePost from '../../common/hooks/mutations/useDislike';
import useLikePost from '../../common/hooks/mutations/useLike';
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

export default function Post({
	post,
	lastItemRef,
}: {
	post: IPost;
	lastItemRef?: (node: HTMLDivElement) => void;
}) {
	const [expanded, setExpanded] = React.useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const canExpand = post.description.length > 160;
	const description =
		canExpand === true && expanded === false
			? post.description.substring(0, 160) + ' ...'
			: post.description;

	const likeMutation = useLikePost(post._id);
	const dislikeMutation = useDislikePost(post._id);

	const currentUserId = useRecoilState(currentUserState)[0]?._id ?? '';

	const thumbUpColor = post.likes.includes(currentUserId)
		? 'primary'
		: 'inherit';
	const thumbDownColor = post.dislikes.includes(currentUserId)
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
		</Card>
	);
}
