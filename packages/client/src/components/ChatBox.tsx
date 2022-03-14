import CloseIcon from '@mui/icons-material/Close';
import {
	alpha,
	Avatar,
	CardHeader,
	Divider,
	IconButton,
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
				avatar={<Avatar />}
				action={
					<IconButton aria-label='close' sx={{ mr: '8px' }}>
						<CloseIcon />
					</IconButton>
				}
				title='Username'
				sx={{ p: '8px' }}
			/>
			<Divider />
			<CardContent sx={{ height: 353, overflowX: 'hidden', overflowY: 'auto' }}>
				{arr.map((item, idx) => (idx % 2 === 0 ? <ChatMsg /> : <OwnChatMsg />))}
			</CardContent>
			<CardActions>
				<CustomInput placeholder='Aa' inputProps={{ 'aria-label': 'chat' }} />
			</CardActions>
		</Card>
	);
}
