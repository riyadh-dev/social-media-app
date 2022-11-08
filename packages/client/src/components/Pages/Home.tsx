import { Outlet } from 'react-router-dom';
import TopBar from '../TopBar';

const Home = () => {
	return (
		<>
			<TopBar />
			<Outlet />
		</>
	);
};

export default Home;
