import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {
	Avatar,
	Button,
	Divider,
	Paper,
	Stack,
	TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { queryClient } from '..';
import { IAddPostInput } from '../common/interfaces';
import { addPostReq } from '../common/requests';
import { currentUserState } from '../recoil/states';

const PostForm = () => {
	const currentUser = useRecoilState(currentUserState)[0];
	const { handleSubmit, register, reset, resetField } =
		useForm<IAddPostInput>();

	const { mutate, status } = useMutation(addPostReq, {
		onSuccess: () => queryClient.invalidateQueries(['posts']),
	});

	const onSubmit = (post: IAddPostInput) => {
		mutate(post);
	};

	useEffect(() => {
		if (status === 'error' || status === 'success') reset();
	}, [reset, status]);

	const [photoEnabled, setPhotoEnabled] = useState(false);
	const handleEnablePhoto = () => {
		setPhotoEnabled((prev) => {
			if (prev) resetField('img');
			return !prev;
		});
	};

	let sendBtnText = 'add post';
	switch (status) {
		case 'loading':
			sendBtnText = 'adding post...';
			break;
		case 'error':
			sendBtnText = 'adding post failed';
			break;
		default:
			sendBtnText = 'add post';
			break;
	}

	return (
		<Paper component='form' onSubmit={handleSubmit(onSubmit)}>
			<Stack direction='column' sx={{ p: '12px' }} spacing={2}>
				<Stack direction='row' spacing={2}>
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
				{photoEnabled && (
					<TextField
						placeholder='Paste a photo url'
						size='small'
						fullWidth
						disabled={status === 'loading'}
						sx={{ pl: '56px' }}
						{...register('img')}
					/>
				)}
			</Stack>
			<Divider variant='middle' />
			<Stack direction='row' sx={{ p: '6px' }} justifyContent='space-around'>
				<Button
					aria-describedby='photo-url'
					onClick={handleEnablePhoto}
					size='large'
					variant='text'
					startIcon={<AddPhotoAlternateIcon />}
					disabled={status === 'loading'}
				>
					{photoEnabled ? 'remove photo' : 'add photo'}
				</Button>
				<Button
					type='submit'
					size='large'
					variant='text'
					startIcon={<AddCircleIcon />}
					disabled={status === 'loading'}
					color={status === 'error' ? 'error' : 'primary'}
				>
					{sendBtnText}
				</Button>
			</Stack>
		</Paper>
	);
};

export default PostForm;
