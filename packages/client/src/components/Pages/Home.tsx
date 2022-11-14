import { Stack } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../../recoil/atoms';
import FriendsList from '../FriendsList';
import LeftSideBar from '../LeftSideBar';
import Timeline from '../Posts/Timeline';

const Home = () => {
	const currentUserId = useRecoilValue(currentUserState)?.id;
	return (
		<Stack
			direction='row'
			justifyContent={{ xs: 'center', lg: 'space-between' }}
			sx={{ mt: '78px' }}
		>
			<LeftSideBar />
			<Timeline userId={currentUserId} />
			<FriendsList />
		</Stack>
	);
};

export default Home;
