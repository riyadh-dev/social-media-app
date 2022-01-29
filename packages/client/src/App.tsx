import { ThemeProvider } from '@emotion/react';
import {
	createTheme,
	CssBaseline,
	PaletteMode,
	Stack,
	Theme,
	useMediaQuery,
} from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { Route, Routes, useMatch } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Feed from './components/Feed';
import FriendsList from './components/FriendsList';
import Login from './components/Login';
import Profile from './components/Profile';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import { themeState } from './recoil/states';

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

	const showTopBar = !useMatch('login');

	return (
		<ThemeProvider theme={muiTheme}>
			<CssBaseline>
				{showTopBar ? <TopBar /> : null}

				<Routes>
					<Route
						path='/'
						element={
							<Stack direction='row' justifyContent='space-between'>
								<SideBar />
								<Feed />
								<FriendsList />
							</Stack>
						}
					/>
					<Route path='/login' element={<Login />} />
					<Route path='/profile/:id' element={<Profile />} />
				</Routes>
			</CssBaseline>
		</ThemeProvider>
	);
}

export default App;
