import { Stack } from '@mui/material';
import FriendsList from '../FriendsList';
import LeftSideBar from '../LeftSideBar';
import PostForm from '../PostForm';

const Home = () => {
	return (
		<Stack
			direction='row'
			justifyContent={{ xs: 'center', lg: 'space-between' }}
			sx={{ mt: '78px' }}
		>
			<LeftSideBar />
			<PostForm />
			<FriendsList />
		</Stack>
	);
};

export default Home;
