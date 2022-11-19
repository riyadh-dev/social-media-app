import { Stack } from '@mui/material';
import { TInfinitePostsQueryType } from '../../common/types';
import useGetInfinitePosts from '../../hooks/useGetInfinitePosts';
import JumpToTopButton from '../JumpToTopButton';
import Post from './Post';
import PostForm from './PostForm';

//TODO pass down userId to post comp
const PostsInfiniteList = ({
	listType,
	userId,
}: {
	userId?: string;
	listType: TInfinitePostsQueryType;
}) => {
	const { intersectionItemRef, data } = useGetInfinitePosts(listType, userId);
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
			</Stack>
			<JumpToTopButton />
		</>
	);
};

export default PostsInfiniteList;
