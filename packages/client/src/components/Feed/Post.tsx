import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
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
import { useQuery } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';
import { ICurrentUser as IUser, IPost } from '../../common/interfaces';
import { UserReq } from '../../common/requests';

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
		canExpand && expanded
			? postData.description
			: postData.description.substring(0, 160) + ' ...';

	const { data, isError, isLoading } = useQuery<IUser>(
		['user', postData.author],
		() => UserReq(postData.author)
	);

	if (isError || isLoading || !data) return null;

	const postDate = new Date(data.createdAt);

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
				<IconButton aria-label='like'>
					<ThumbUpIcon />
				</IconButton>
				<IconButton aria-label='dislike'>
					<ThumbDownIcon />
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
