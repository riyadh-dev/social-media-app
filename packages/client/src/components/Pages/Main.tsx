import { Outlet } from 'react-router-dom';
import TopBar from '../TopBar';

const Main = () => {
	return (
		<>
			<TopBar />
			<Outlet />
		</>
	);
};

export default Main;
