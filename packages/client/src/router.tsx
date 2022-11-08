import { Stack } from '@mui/material';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from './components/Pages/Home';
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
				<Home />
			</RequireAuth>
		),
		children: [
			{ path: '/', element: <PlaceHolderComp compName='root' /> },
			{ path: 'favorites', element: <PlaceHolderComp compName='favorites' /> },
			{ path: 'friends', element: <PlaceHolderComp compName='friends' /> },
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
