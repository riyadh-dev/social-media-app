import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {
	Avatar,
	Button,
	Divider,
	Paper,
	Popover,
	Stack,
	TextField,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { queryClient } from '..';
import { IAddPostInput } from '../common/interfaces';
import { addPostReq } from '../common/requests';
import { currentUserState } from '../recoil/states';

const PostForm = () => {
	const currentUser = useRecoilState(currentUserState)[0];
	const { handleSubmit, register, reset } = useForm<IAddPostInput>();

	const { mutate, status } = useMutation(addPostReq, {
		onSuccess: () => queryClient.invalidateQueries(['posts']),
	});

	const onSubmit = (post: IAddPostInput) => {
		mutate(post);
	};

	useEffect(() => {
		if (status === 'error' || status === 'success') reset();
	}, [reset, status]);

	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
		null
	);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	return (
		<Paper component='form' onSubmit={handleSubmit(onSubmit)}>
			<Stack direction='row' sx={{ p: '12px' }} spacing={2}>
				<Avatar />
				<TextField
					placeholder={`What's on your mind, ${currentUser?.username}?`}
					size='small'
					multiline
					fullWidth
					disabled={status === 'loading'}
					{...register('description')}
				/>
			</Stack>
			<Divider variant='middle' />
			<Stack direction='row' sx={{ p: '6px' }} justifyContent='space-around'>
				<Button
					aria-describedby='photo-url'
					onClick={handleClick}
					size='large'
					variant='text'
					startIcon={<AddPhotoAlternateIcon />}
				>
					Photo
				</Button>
				<Popover
					id='photo-url'
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
				>
					<TextField
						sx={{ m: '12px' }}
						placeholder='Add An Picture Url'
						size='small'
						disabled={status === 'loading'}
						{...register('img')}
					/>
				</Popover>
				<Button
					type='submit'
					size='large'
					variant='text'
					startIcon={<AddCircleIcon />}
				>
					Add Post
				</Button>
			</Stack>
		</Paper>
	);
};

export default PostForm;
