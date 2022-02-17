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
import { useMutation, useQuery } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { queryClient } from '../..';
import {
	ICurrentUser,
	ICurrentUser as IUser,
	IPost,
} from '../../common/interfaces';
import { dislikePostReq, likePostReq, UserReq } from '../../common/requests';
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

export default function Post({ postData }: { postData: IPost }) {
	const [expanded, setExpanded] = React.useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const canExpand = postData.description.length > 160;
	const description =
		canExpand === true && expanded === false
			? postData.description.substring(0, 160) + ' ...'
			: postData.description;

	const { data, status } = useQuery<IUser>(['user', postData.author], () =>
		UserReq(postData.author)
	);

	const likeMutation = useMutation(() => likePostReq(postData._id), {
		onSuccess: () => queryClient.invalidateQueries(['posts']),
	});

	const dislikeMutation = useMutation(() => dislikePostReq(postData._id), {
		onSuccess: () => queryClient.invalidateQueries(['posts']),
	});

	const { _id: currentUserId } = useRecoilState(
		currentUserState
	)[0] as ICurrentUser;

	if (status !== 'success' || !data) return null;

	const postDate = new Date(data.createdAt);
	const thumbUpColor = postData.likes.includes(currentUserId)
		? 'primary'
		: 'inherit';
	const thumbDownColor = postData.dislikes.includes(currentUserId)
		? 'error'
		: 'inherit';

	return (
		<Card sx={{ maxWidth: 680 }}>
			<CardHeader
				avatar={
					<Avatar
						src={data.profilePicture}
						aria-label='avatar'
						component={RouterLink}
						to={'/profile/' + data._id}
					/>
				}
				action={
					<IconButton aria-label='settings'>
						<MoreVertIcon />
					</IconButton>
				}
				title={data.username}
				subheader={postDate.toLocaleString()}
			/>
			<CardMedia component='img' image={postData.img} alt='post img' />
			<CardContent>
				<Typography paragraph>{description}</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<IconButton aria-label='like' onClick={() => likeMutation.mutate()}>
					<Badge
						badgeContent={postData.likes.length}
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
						badgeContent={postData.dislikes.length}
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
