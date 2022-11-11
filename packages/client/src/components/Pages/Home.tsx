import { Stack } from '@mui/material';
import FriendsList from '../FriendsList';
import PostForm from '../PostForm';
import RightSideBar from '../RightSideBar';

const Home = () => {
	return (
		<Stack direction='row' justifyContent='space-between' sx={{ mt: '78px' }}>
			<RightSideBar />
			<PostForm />
			<FriendsList />
		</Stack>
	);
};

export default Home;
