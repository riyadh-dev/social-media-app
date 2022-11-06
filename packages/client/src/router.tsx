import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';

const LoginSignUp = lazy(() => import('./components/LoginSignUp'));

const router = createBrowserRouter([
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
