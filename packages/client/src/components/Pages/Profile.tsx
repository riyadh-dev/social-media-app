import { Box, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import Timeline from '../Posts/Timeline';
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
				<Timeline userId={userId} />
			</Stack>
		</Box>
	);
};

export default Profile;
