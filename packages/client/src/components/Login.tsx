import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Button,
	Divider,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { ILoginInput } from '../common/interfaces';
import { loginReq } from '../common/requests';
import { currentUserState } from '../recoil/states';
import { axiosInstance } from '../services/axios';

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<ILoginInput>();

	const onError = (err: AxiosError<{ error: string }>) => {
		const errMsg = err?.response?.data.error;
		setError('username', { message: errMsg });
		setError('password', { message: errMsg });
	};

	const { data, mutate, isLoading, isSuccess } = useMutation(loginReq, {
		onError,
	});

	const onSubmit = (user: ILoginInput) => {
		mutate(user);
	};

	const setCurrentUser = useRecoilState(currentUserState)[1];

	useEffect(() => {
		if (isSuccess && data) {
			setCurrentUser(data);
			axiosInstance.defaults.headers.common['csrf-token'] = data.csrfToken;
		}
	}, [data, isSuccess, setCurrentUser]);

	const [showPassword, setShowPassword] = useState(false);

	const handleToggleShowPassword = () => setShowPassword((prev) => !prev);

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
					<FormControl variant='outlined' error={Boolean(errors.username)}>
						<InputLabel htmlFor='email'>Email</InputLabel>
						<OutlinedInput id='email' label='Email' {...register('username')} />
						<FormHelperText id='email'>
							{errors.username?.message}
						</FormHelperText>
					</FormControl>
					<FormControl variant='outlined' error={Boolean(errors.password)}>
						<InputLabel htmlFor='password'>Password</InputLabel>
						<OutlinedInput
							id='password'
							label='Password'
							type={showPassword ? 'text' : 'password'}
							{...register('password')}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={handleToggleShowPassword}
										edge='end'
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
						/>
						<FormHelperText id='password'>
							{errors.password?.message}
						</FormHelperText>
					</FormControl>

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
