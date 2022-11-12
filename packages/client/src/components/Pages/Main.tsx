import { Outlet } from 'react-router-dom';
import Chat from '../Chat';
import TopBar from '../TopBar';

const Main = () => (
	<>
		<TopBar />
		<Outlet />
		<Chat />
	</>
);

export default Main;
