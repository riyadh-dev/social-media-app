import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Avatar, Badge, styled } from '@mui/material';
import { useState } from 'react';
import { TUiUser } from '../../common/types';
import useChatBox from '../../hooks/useChatBox';

const CloseAvatar = styled(Avatar)(({ theme }) => ({
	width: '20px',
	height: '20px',
	border: `2px solid ${theme.palette.background.paper}`,
	cursor: 'pointer',
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
					<CloseAvatar onClick={onClose}>
						<CloseRoundedIcon sx={{ p: '5px' }} />
					</CloseAvatar>
				) : (
					'??'
				)
			}
		>
			<Avatar
				src={user.avatar}
				sx={{ height: '48px', width: '48px', cursor: 'pointer' }}
				onClick={onMaximize}
			/>
		</Badge>
	);
};

export default MinimizedChatBox;
