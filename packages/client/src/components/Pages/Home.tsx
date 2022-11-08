import { Stack } from '@mui/material';
import PostForm from '../PostForm';
import RightSideBar from '../RightSideBar';

const Home = () => {
	return (
		<Stack direction='row' justifyContent='space-between' sx={{ mt: '78px' }}>
			<RightSideBar />
			<PostForm />
			<h1>Reft Side Bar</h1>
		</Stack>
	);
};

export default Home;
