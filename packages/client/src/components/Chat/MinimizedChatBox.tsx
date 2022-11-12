import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Avatar, Badge, styled } from '@mui/material';
import { useState } from 'react';
import { TUiUser } from '../../common/types';
import useChatBox from '../../hooks/useChatBox';

const MinimizedAvatar = styled(Avatar)(({ theme }) => ({
	width: '20px',
	height: '20px',
	border: `2px solid ${theme.palette.background.paper}`,
	cursor: 'pointer',
}));

const OnlineBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		backgroundColor: '#44b700',
		color: '#44b700',
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		width: '0.75rem',
		height: '0.75rem',
		borderRadius: '50%',
		'&::after': {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			animation: 'ripple 1.2s infinite ease-in-out',
			border: '1px solid currentColor',
			content: '""',
		},
	},
	'@keyframes ripple': {
		'0%': {
			transform: 'scale(.8)',
			opacity: 1,
		},
		'100%': {
			transform: 'scale(2.4)',
			opacity: 0,
		},
	},
}));

const MinimizedChatBox = ({ user }: { user: TUiUser }) => {
	const [isMouseOver, setIsMouseOver] = useState(false);
	const { onMaximize, onClose } = useChatBox(user);
	return (
		<Badge
			overlap='circular'
			color={isMouseOver ? 'default' : 'primary'}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			onMouseOver={() => setIsMouseOver(true)}
			onMouseLeave={() => setIsMouseOver(false)}
			badgeContent={
				isMouseOver ? (
					<MinimizedAvatar onClick={onClose}>
						<CloseRoundedIcon sx={{ p: '5px' }} />
					</MinimizedAvatar>
				) : (
					'25'
				)
			}
		>
			<OnlineBadge
				overlap='circular'
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				variant='dot'
			>
				<Avatar
					src={user.avatar}
					sx={{ height: '48px', width: '48px', cursor: 'pointer' }}
					onClick={onMaximize}
				/>
			</OnlineBadge>
		</Badge>
	);
};

export default MinimizedChatBox;
