import { Stack } from '@mui/material';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from './components/Pages/Home';
import Main from './components/Pages/Main';
import Profile from './components/Pages/Profile';
import RequireAuth from './components/RequireAuth';

const LoginSignUp = lazy(() => import('./components/LoginSignUp'));

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
			{ path: 'favorites', element: <PlaceHolderComp compName='favorites' /> },
			{ path: 'friends', element: <PlaceHolderComp compName='friends' /> },
			{ path: '/profile/:userId', element: <Profile /> },
		],
	},
	{
		path: '/login',
		element: (
			<Suspense fallback={<h1>loading...</h1>}>
				<LoginSignUp />
			</Suspense>
		),
	},
	{
		path: '*',
		element: (
			<RequireAuth>
				<h1>No Match</h1>
			</RequireAuth>
		),
	},
]);

export default router;
