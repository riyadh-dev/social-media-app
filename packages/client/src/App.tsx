import { ThemeProvider } from '@emotion/react';
import {
	createTheme,
	CssBaseline,
	PaletteMode,
	Theme,
	useMediaQuery,
} from '@mui/material';
import { Suspense, useEffect, useMemo } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { RouterProvider } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import RecoilDebugButton from './components/Debug/RecoilDebugButton';
import Loading from './components/Loading';
import router from './components/router';
import { useWebSocketInit } from './hooks/useWebSocketInit';
import { themeState } from './recoil/atoms';

const IS_DEV = process.env.NODE_ENV === 'development';

const getTheme = (mode: PaletteMode): Theme =>
	createTheme({
		palette: {
			mode,
			background: {
				default: mode === 'light' ? '#F0F2F5' : '#18191A',
			},
		},
		components: {
			MuiListItem: {
				styleOverrides: {
					button: {
						borderRadius: '8px',
						':hover': {
							borderRadius: '8px',
						},
					},
				},
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
			<Suspense fallback={<Loading />}>
				<RouterProvider router={router} />
			</Suspense>
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
