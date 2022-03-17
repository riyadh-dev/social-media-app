import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import RemoveIcon from '@mui/icons-material/Remove';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {
	alpha,
	Avatar,
	Button,
	CardHeader,
	Divider,
	IconButton,
	InputAdornment,
	InputBase,
	Paper,
	Stack,
	styled,
	Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import React from 'react';

const ChatMsgPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#383838' : '#f0f2f5',
	borderRadius: '16px',
}));

const OwmChatMsgPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: '#0084ff',
	color: 'white',
	borderRadius: '16px',
}));

const CustomInput = styled(InputBase)(({ theme }) => ({
	position: 'relative',
	borderRadius: '50px',
	marginInline: '16px',
	backgroundColor: alpha(theme.palette.action.active, 0.1),
	'&:hover': {
		backgroundColor: alpha(theme.palette.action.active, 0.15),
	},
	'& .MuiInputBase-input': {
		paddingInline: '10px',
	},
}));

const OwnChatMsg = () => (
	<Stack direction='row' spacing={1} sx={{ mb: 4 }}>
		<OwmChatMsgPaper sx={{ px: '12px', py: '8px' }} elevation={0}>
			<Typography variant='body2'>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas
				perferendis eos non voluptas quos ullam nostrum tempore! Aliquam facere
				enim sint, velit commodi quibusdam, labore necessitatibus omnis
				asperiores sequi adipisci.
			</Typography>
		</OwmChatMsgPaper>
		<Avatar sx={{ alignSelf: 'flex-end', width: '28px', height: '28px' }} />
	</Stack>
);

const ChatMsg = () => (
	<Stack direction='row' spacing={1} sx={{ mb: 4 }}>
		<Avatar sx={{ alignSelf: 'flex-end', width: '28px', height: '28px' }} />
		<ChatMsgPaper sx={{ px: '12px', py: '8px' }} elevation={0}>
			<Typography variant='body2'>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas
				perferendis eos non voluptas quos ullam nostrum tempore! Aliquam facere
				enim sint, velit commodi quibusdam, labore necessitatibus omnis
				asperiores sequi adipisci.
			</Typography>
		</ChatMsgPaper>
	</Stack>
);

export default function ChatBox() {
	const arr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
	return (
		<Card
			sx={{
				width: 338,
				height: 465,
				position: 'absolute',
				bottom: 0,
				right: 100,
				zIndex: 9999,
			}}
		>
			<CardHeader
				sx={{ p: '3px' }}
				avatar={
					<Button
						//component={RouterLink}
						//to={'/profile/' + currentUser?._id}
						sx={{
							textTransform: 'none',
						}}
						variant='text'
						startIcon={<Avatar alt='Avatar' sx={{ height: 32, width: 32 }} />}
					>
						{'username'}
					</Button>
				}
				action={
					<Stack direction='row'>
						<IconButton aria-label='close'>
							<RemoveIcon />
						</IconButton>
						<IconButton aria-label='close' sx={{ mr: '8px' }}>
							<CloseIcon />
						</IconButton>
					</Stack>
				}
			></CardHeader>
			<Divider />
			<CardContent sx={{ height: 353, overflowX: 'hidden', overflowY: 'auto' }}>
				{arr.map((item, idx) => (idx % 2 === 0 ? <ChatMsg /> : <OwnChatMsg />))}
			</CardContent>
			<CardActions sx={{ justifyContent: 'space-between' }}>
				<IconButton aria-label='add'>
					<AddCircleIcon color='primary' />
				</IconButton>
				<CustomInput
					placeholder='Aa'
					inputProps={{ 'aria-label': 'chat' }}
					endAdornment={
						<InputAdornment position='end'>
							<IconButton>
								<EmojiEmotionsIcon color='primary' />
							</IconButton>
						</InputAdornment>
					}
				/>
				<IconButton aria-label='like'>
					<ThumbUpIcon color='primary' />
				</IconButton>
			</CardActions>
		</Card>
	);
}
