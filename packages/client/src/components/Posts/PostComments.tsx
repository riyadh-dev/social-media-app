import { Paper, Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { IPost } from '@social-media-app/shared/src';
import useGetPostComments from '../../hooks/usePostComments';

const CommentText = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#383838' : '#f0f2f5',
	borderRadius: '16px',
}));

const PostComments = ({ post }: { post: IPost }) => {
	const { data: comments } = useGetPostComments(post.comments, true, post.id);

	return (
		<>
			{comments?.map((comment) => (
				<Stack key={comment.id} direction='row' spacing={2}>
					<Avatar src={comment.author.avatar} />
					<CommentText sx={{ px: '12px', py: '8px' }} elevation={0}>
						<Typography>{comment.text}</Typography>
					</CommentText>
				</Stack>
			))}
		</>
	);
};

export default PostComments;
