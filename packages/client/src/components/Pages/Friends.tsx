import { Stack } from '@mui/material';
import { Suspense } from 'react';
import FriendsCardList from '../FriendRequests/Friends';
import ReceivedRequests from '../FriendRequests/ReceivedRequests';
import SentRequests from '../FriendRequests/SentRequests';
import Loading from '../Loading';

const Friends = () => (
	<Stack sx={{ mt: '64px' }}>
		<Suspense fallback={<Loading />}>
			<ReceivedRequests />
		</Suspense>
		<Suspense fallback={<Loading />}>
			<SentRequests />
		</Suspense>
		<Suspense fallback={<Loading />}>
			<FriendsCardList />
		</Suspense>
	</Stack>
);

export default Friends;
