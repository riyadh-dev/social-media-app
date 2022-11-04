import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Avatar, Badge, styled } from '@mui/material';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { TUiUser } from '../../common/types';
import { chatBoxState } from '../../recoil/states';

const CloseAvatar = styled(Avatar)(({ theme }) => ({
	width: '20px',
	height: '20px',
	border: `2px solid ${theme.palette.background.paper}`,
	cursor: 'pointer',
}));

const MinimizedChatBox = ({ user }: { user: Omit<TUiUser, 'csrfToken'> }) => {
	const [isMouseOver, setIsMouseOver] = useState(false);

	const setChatBox = useRecoilState(chatBoxState)[1];

	const onRemoveMinimizedChat = () => {
		setChatBox((prev) => {
			const { minimized, open } = prev;
			minimized.delete(user.id);
			return {
				minimized,
				open,
			};
		});
	};

	const onOpenMinimizedChat = () => {
		setChatBox((prev) => {
			const { minimized, open } = prev;
			minimized.delete(user.id);

			const openKeys = Array.from(open.keys());
			if (openKeys.length >= 3) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				minimized.set(openKeys[0], open.get(openKeys[0])!);
				open.delete(openKeys[0]);
			}

			open.set(user.id, user);
			return {
				minimized,
				open,
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
				src={user.avatar}
				sx={{ height: '48px', width: '48px', cursor: 'pointer' }}
				onClick={onOpenMinimizedChat}
			/>
		</Badge>
	);
};

export default MinimizedChatBox;
