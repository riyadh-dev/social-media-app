import { Stack } from '@mui/material';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Main from './components/Pages/Main';
import PostsWithImageViewer from './components/Pages/PostsWithImageViewer';
import PostsWithImageViewerSkeleton from './components/Posts/PostsWithImageViewerSkeleton';
import RequireAuth from './components/RequireAuth';

const LoginSignUp = lazy(() => import('./components/LoginSignUp'));
const Home = lazy(() => import('./components/Pages/Home'));
const Friends = lazy(() => import('./components/Pages/Friends'));
const Profile = lazy(() => import('./components/Pages/Profile'));
const Messenger = lazy(() => import('./components/Pages/Messenger'));
const Settings = lazy(() => import('./components/Pages/Settings'));
const IntroUpdateForm = lazy(
	() => import('./components/Settings/IntroUpdateForm')
);
const UserUpdateForm = lazy(
	() => import('./components/Settings/UserUpdateForm')
);

/* const PostsWithImageViewer = lazy(
	() => import('./components/Pages/PostsWithImageViewer')
); */

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
			{ path: '/messenger', element: <Messenger /> },
			{
				path: 'setting',
				element: <Settings />,
				children: [
					{ path: 'account', element: <UserUpdateForm /> },
					{ path: 'intro', element: <IntroUpdateForm /> },
				],
			},
		],
	},
	{
		path: '/posts/:type/:authorId',
		element: (
			<Suspense fallback={<PostsWithImageViewerSkeleton />}>
				<PostsWithImageViewer />
			</Suspense>
		),
	},
	{
		path: '/login',
		element: <LoginSignUp />,
	},

	{
		path: '*',
		element: <PlaceHolderComp compName='No Match' />,
	},
]);

export default router;
