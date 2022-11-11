import { Outlet } from 'react-router-dom';
import TopBar from '../TopBar';

const Main = () => (
	<>
		<TopBar />
		<Outlet />
	</>
);

export default Main;
