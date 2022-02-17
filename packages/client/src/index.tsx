import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import App from './App';
import './index.css';
import { ReactQueryDevtools } from 'react-query/devtools';

export const queryClient = new QueryClient();

ReactDOM.render(
	<React.StrictMode>
		<RecoilRoot>
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<App />
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</BrowserRouter>
		</RecoilRoot>
	</React.StrictMode>,
	document.getElementById('root')
);
