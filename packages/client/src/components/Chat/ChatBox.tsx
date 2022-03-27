import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import RemoveIcon from '@mui/icons-material/Remove';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {
	alpha,
	Avatar,
	Button,
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
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { ICurrentUser } from '../../common/interfaces';
import { chatBoxState } from '../../recoil/states';

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
	height: '36px',
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

export default function ChatBox({
	user,
}: {
	user: Omit<ICurrentUser, 'csrfToken'>;
}) {
	const arr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

	const setChatBox = useRecoilState(chatBoxState)[1];
	const onMinimize = () => {
		setChatBox((prev) => {
			const { minimized, open } = prev;

			open.delete(user._id);
			minimized.set(user._id, user);

			const minKeys = Array.from(minimized.keys());
			if (minKeys.length >= 7) {
				minimized.delete(minKeys[0]);
			}

			return {
				minimized,
				open,
			};
		});
	};

	const onClose = () => {
		setChatBox((prev) => {
			const { minimized, open } = prev;
			open.delete(user._id);
			return {
				minimized,
				open,
			};
		});
	};

	return (
		<Card
			sx={{
				width: 338,
				height: 465,
			}}
		>
			<Stack direction='row' justifyContent='space-between' alignItems='center'>
				<Button
					component={RouterLink}
					to={'/profile/' + user._id}
					sx={{
						textTransform: 'none',
						m: '2px',
					}}
					variant='text'
					startIcon={
						<Avatar src={user.profilePicture} sx={{ height: 32, width: 32 }} />
					}
				>
					{user.username}
				</Button>
				<Stack direction='row' spacing={1} sx={{ p: '8px' }}>
					<IconButton
						aria-label='close'
						sx={{ height: 26, width: 26 }}
						onClick={onMinimize}
					>
						<RemoveIcon />
					</IconButton>
					<IconButton
						aria-label='minimize'
						sx={{ height: 26, width: 26 }}
						onClick={onClose}
					>
						<CloseIcon />
					</IconButton>
				</Stack>
			</Stack>
			<Divider />
			<CardContent sx={{ height: 353, overflowX: 'hidden', overflowY: 'auto' }}>
				{arr.map((item, idx) =>
					idx % 2 === 0 ? <ChatMsg key={idx} /> : <OwnChatMsg key={idx} />
				)}
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
							<IconButton sx={{ height: '28px', width: '28px', mr: '4px' }}>
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
