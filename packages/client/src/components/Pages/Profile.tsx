import { Box, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import PostsInfiniteList from '../Posts/PostsInfiniteList';
import LeftSection from '../Profile/LeftSection';
import UpperSection from '../Profile/UpperSection';

const Profile = () => {
	const { userId } = useParams();
	return (
		<Box sx={{ mt: '64px' }}>
			<UpperSection />
			<Stack
				justifyContent='center'
				alignItems={{ xs: 'center', md: 'flex-start' }}
				spacing={3}
				sx={{ mt: '20px' }}
				direction={{ xs: 'column', md: 'row' }}
			>
				<LeftSection />
				<PostsInfiniteList listType='timeline-posts' userId={userId} />
			</Stack>
		</Box>
	);
};

export default Profile;
