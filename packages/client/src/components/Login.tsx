import {
	Button,
	Divider,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const Login = () => {
	return (
		<Stack
			direction={['column', 'column', 'row']}
			justifyContent={['flex-start', 'flex-start', 'space-around']}
			alignItems='center'
			spacing={3}
			sx={{ height: '100vh' }}
		>
			<Box
				sx={{ maxWidth: 500, p: '20px' }}
				textAlign={['center', 'center', 'left']}
			>
				<Typography
					sx={{ fontWeight: 'bold' }}
					variant='h3'
					color='#1976d2'
					gutterBottom
				>
					SocialApp
				</Typography>
				<Typography variant='h5' gutterBottom>
					Connect with friends and the world around you on SocialApp.
				</Typography>
			</Box>
			<Paper sx={{ p: '20px', width: '400px' }}>
				<Stack spacing={2}>
					<TextField id='email' label='Email' variant='outlined' />
					<TextField id='password' label='Password' variant='outlined' />
					<Button variant='contained' size='large'>
						Log In
					</Button>
					<Button variant='text' size='small'>
						Forget password?
					</Button>
					<Divider variant='middle' />
					<Button color='success' variant='contained'>
						Create new account
					</Button>
				</Stack>
			</Paper>
		</Stack>
	);
};

export default Login;
