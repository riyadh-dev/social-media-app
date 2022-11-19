import { Stack } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../../recoil/atoms';
import PostsInfiniteList from '../Posts/PostsInfiniteList';

const LikedPosts = () => {
	const currentUserId = useRecoilValue(currentUserState)?.id;
	return (
		<Stack direction='row' justifyContent='center' sx={{ mt: '78px' }}>
			<PostsInfiniteList listType='liked-posts' userId={currentUserId} />
		</Stack>
	);
};

export default LikedPosts;
