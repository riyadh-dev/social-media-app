import { Stack } from '@mui/material';
import useTimelinePosts from '../../hooks/useTimelinePosts';
import JumpToTopButton from '../JumpToTopButton';
import Post from './Post';
import PostForm from './PostForm';

//TODO pass down userId to post comp
const Timeline = ({ userId }: { userId?: string }) => {
	const { intersectionItemRef, data } = useTimelinePosts(userId);
	const posts = data?.pages.flat();

	return (
		<>
			<Stack
				spacing={2.5}
				sx={{
					mb: '20px',
					width: { xs: '95%', md: '600px' },
				}}
			>
				<PostForm />
				{posts?.map((post, idx) =>
					idx + 1 === posts.length ? (
						<Post key={post.id} lastItemRef={intersectionItemRef} post={post} />
					) : (
						<Post key={post.id} post={post} />
					)
				)}
			</Stack>{' '}
			<JumpToTopButton />
		</>
	);
};

export default Timeline;
