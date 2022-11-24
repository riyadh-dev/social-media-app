import { Stack } from '@mui/material';
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Main from './components/Pages/Main';
import RequireAuth from './components/RequireAuth';
import Friends from './components/Pages/Friends';

const LoginSignUp = lazy(() => import('./components/LoginSignUp'));
const Home = lazy(() => import('./components/Pages/Home'));
const Profile = lazy(() => import('./components/Pages/Profile'));

const PlaceHolderComp = ({ compName }: { compName: string }) => (
	<Stack justifyContent='center' alignItems='center' height='100vh'>
		<h1>{compName}</h1>
	</Stack>
);

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<RequireAuth>
				<Main />
			</RequireAuth>
		),
		children: [
			{ path: '/', element: <Home /> },
			{ path: 'favorites', element: <Home /> },
			{ path: 'friends', element: <Friends /> },
			{ path: 'profile/:userId', element: <Profile /> },
		],
	},
	{
		path: '/login',
		element: <LoginSignUp />,
	},
	{
		path: '*',
		element: (
			<RequireAuth>
				<PlaceHolderComp compName='No Match' />
			</RequireAuth>
		),
	},
]);

export default router;
