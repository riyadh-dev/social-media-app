import { ThemeProvider } from '@emotion/react';
import {
	createTheme,
	CssBaseline,
	PaletteMode,
	Theme,
	useMediaQuery,
} from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import Profile from './components/Profile';
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

	return (
		<ThemeProvider theme={muiTheme}>
			<CssBaseline>
				<TopBar />
				<Profile />
			</CssBaseline>
		</ThemeProvider>
	);
}

export default App;
