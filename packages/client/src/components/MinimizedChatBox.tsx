import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Avatar, Badge, styled } from '@mui/material';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { ICurrentUser } from '../common/interfaces';
import { chatBoxState } from '../recoil/states';

const CloseAvatar = styled(Avatar)(({ theme }) => ({
	width: '20px',
	height: '20px',
	border: `2px solid ${theme.palette.background.paper}`,
	cursor: 'pointer',
}));

const MinimizedChatBox = ({
	user,
}: {
	user: Omit<ICurrentUser, 'csrfToken'>;
}) => {
	const [isMouseOver, setIsMouseOver] = useState(false);

	const setChatBox = useRecoilState(chatBoxState)[1];

	const onRemoveMinimizedChat = () => {
		setChatBox((prev) => {
			const minimized = [...prev.minimized];
			const toRemoveIdx = minimized.indexOf(user);
			minimized.splice(toRemoveIdx, 1);
			return {
				open: prev.open,
				minimized,
			};
		});
	};
	return (
		<Badge
			overlap='circular'
			color={isMouseOver ? 'default' : 'primary'}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			onMouseOver={() => setIsMouseOver(true)}
			onMouseLeave={() => setIsMouseOver(false)}
			badgeContent={
				isMouseOver ? (
					<CloseAvatar onClick={onRemoveMinimizedChat}>
						<CloseRoundedIcon sx={{ p: '5px' }} />
					</CloseAvatar>
				) : (
					'??'
				)
			}
		>
			<Avatar
				src={user.profilePicture}
				sx={{ height: '48px', width: '48px', cursor: 'pointer' }}
			/>
		</Badge>
	);
};

export default MinimizedChatBox;
