import { ThemeProvider } from '@emotion/react';
import {
	createTheme,
	CssBaseline,
	PaletteMode,
	Theme,
	useMediaQuery,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { RouterProvider } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import RecoilDebugButton from './components/Debug/RecoilDebugButton';
import { useWebSocketInit } from './hooks/useWebSocketInit';
import { themeState } from './recoil/states';
import router from './Router';

const IS_DEV = process.env.NODE_ENV === 'development';

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

	useWebSocketInit();

	return (
		<ThemeProvider theme={muiTheme}>
			<CssBaseline />
			<RouterProvider router={router} />
			{IS_DEV && (
				<>
					<ReactQueryDevtools initialIsOpen={false} />
					{/* <RecoilTimeTravelObserver /> */}
					<RecoilDebugButton />
				</>
			)}
		</ThemeProvider>
	);
}

export default App;
