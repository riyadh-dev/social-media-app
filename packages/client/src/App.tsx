import { ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline, Stack, useMediaQuery } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import Feed from './components/Feed';
import FriendsList from './components/FriendsList';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import { themeState } from './recoil/states';

function App() {
	const [theme, setTheme] = useRecoilState(themeState);

	const prefThemeMode = useMediaQuery('(prefers-color-scheme: dark)')
		? 'dark'
		: 'light';

	const muiTheme = useMemo(
		() =>
			createTheme({
				palette: {
					mode: theme.isUserPicked ? theme.mode : prefThemeMode,
				},
			}),
		[prefThemeMode, theme]
	);

	useEffect(() => {
		if (theme.isUserPicked) return;

		setTheme({
			isUserPicked: false,
			mode: prefThemeMode,
		});
	}, [prefThemeMode, setTheme, theme.isUserPicked]);

	return (
		<ThemeProvider theme={muiTheme}>
			<CssBaseline>
				<TopBar />
				<Stack justifyContent='space-between' direction='row'>
					<SideBar />
					<Feed />
					<FriendsList />
				</Stack>
			</CssBaseline>
		</ThemeProvider>
	);
}

export default App;
