import {
	Button,
	Divider,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { AxiosError } from 'axios';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { ILoginInput, loginReq } from '../common/requests';

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<ILoginInput>();

	const onError = (err: AxiosError) => {
		const errMsg = err?.response?.data.error;
		if (errMsg === 'wrong password or username') {
			setError('username', { message: errMsg });
			setError('password', { message: errMsg });
		} else {
			setError('username', { message: err.message });
			setError('password', { message: err.message });
		}
	};

	const { data, mutate, isLoading, isSuccess, reset } = useMutation(loginReq, {
		onError,
	});

	const onSubmit = (user: ILoginInput) => {
		mutate(user);
	};

	useEffect(() => {
		if (isSuccess && data) {
			localStorage.setItem('currentUser', JSON.stringify(data));
		}
	}, [data, isSuccess]);

	return (
		<Stack
			direction={{ xs: 'column', md: 'row' }}
			justifyContent={{ xs: 'flex-start', md: 'center' }}
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
				<Stack spacing={2} component='form' onSubmit={handleSubmit(onSubmit)}>
					<TextField
						id='email'
						label='Email'
						variant='outlined'
						{...register('username')}
					/>
					<TextField
						id='password'
						label='Password'
						variant='outlined'
						{...register('password')}
					/>
					<Button
						variant='contained'
						size='large'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? 'in progress' : 'log in'}
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
