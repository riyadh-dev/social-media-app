import { ThemeProvider } from '@emotion/react';
import {
	createTheme,
	CssBaseline,
	PaletteMode,
	Stack,
	Theme,
	useMediaQuery,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import Chat from './components/Chat';
import Feed from './components/Feed';
import FriendsList from './components/FriendsList';
import Login from './components/Login';
import FriendsListPage from './components/pages/FriendsList';
import Profile from './components/Profile';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import { currentUserState, themeState } from './recoil/states';

const getTheme = (mode: PaletteMode): Theme =>
	createTheme({
		palette: {
			mode,
			background: {
				default: mode === 'light' ? '#F0F2F5' : '#18191A',
			},
		},
	});

function App() {
	const [theme, setTheme] = useRecoilState(themeState);

	const prefThemeMode = useMediaQuery('(prefers-color-scheme: dark)')
		? 'dark'
		: 'light';

	const muiTheme = useMemo(
		() => getTheme(theme.isUserPicked ? theme.mode : prefThemeMode),
		[prefThemeMode, theme]
	);

	useEffect(() => {
		if (theme.isUserPicked) return;

		setTheme({
			isUserPicked: false,
			mode: prefThemeMode,
		});
	}, [prefThemeMode, setTheme, theme.isUserPicked]);

	const currentUser = useRecoilValue(currentUserState);

	return (
		<ThemeProvider theme={muiTheme}>
			<CssBaseline />
			{!currentUser ? (
				<Login />
			) : (
				<>
					<TopBar />
					<Routes>
						<Route
							path='/'
							element={
								<Stack direction='row' justifyContent='space-between'>
									<SideBar />
									<Feed />
									<FriendsList />
									<Chat />
								</Stack>
							}
						/>
						<Route path='/profile/:id' element={<Profile />} />
						<Route path='/friends' element={<FriendsListPage />} />
					</Routes>
				</>
			)}
		</ThemeProvider>
	);
}

export default App;
