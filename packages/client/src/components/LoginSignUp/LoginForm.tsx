import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Button,
	ButtonTypeMap,
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
import { lazy, useState } from 'react';
import { useLogin } from '../../hooks/usersHooks';

const SignUpForm = lazy(() => import('./SignUpForm'));

const LoginForm = () => {
	const {
		useFormReturn: {
			register,
			formState: { errors },
		},
		useMutationResult: { isLoading, status },
		onSubmit,
	} = useLogin();

	const [showPassword, setShowPassword] = useState(false);
	const handleToggleShowPassword = () => setShowPassword((prev) => !prev);

	const [openSignUpForm, setOpenSignUpForm] = useState(false);
	const handleOpenSignUpForm = () => setOpenSignUpForm(true);
	const handleCloseSignUpForm = () => setOpenSignUpForm(false);

	let LoginBtnText = 'login';
	let loginBtnColor: ButtonTypeMap['props']['color'] = 'primary';

	switch (status) {
		case 'idle':
			loginBtnColor = 'primary';
			LoginBtnText = 'login';
			break;
		case 'loading':
			LoginBtnText = 'login in...';
			break;
		case 'error':
			LoginBtnText = 'something went wrong';
			loginBtnColor = 'error';
			break;
		default:
			break;
	}

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
				<Stack spacing={2} component='form' onSubmit={onSubmit}>
					<FormControl variant='outlined' error={Boolean(errors.email)}>
						<InputLabel htmlFor='email'>Email</InputLabel>
						<OutlinedInput id='email' label='Email' {...register('email')} />
						<FormHelperText id='email'>{errors.email?.message}</FormHelperText>
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
						color={loginBtnColor}
					>
						{LoginBtnText}
					</Button>
					<Button variant='text' size='small'>
						Forget password?
					</Button>
					<Divider variant='middle' />
					<Button
						color='success'
						variant='contained'
						onClick={handleOpenSignUpForm}
					>
						Create new account
					</Button>
				</Stack>
			</Paper>
			<SignUpForm
				handleCloseSignUpForm={handleCloseSignUpForm}
				openSignUpForm={openSignUpForm}
			/>
		</Stack>
	);
};

export default LoginForm;
