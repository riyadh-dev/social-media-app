import { Stack } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { chatBoxState } from '../../packages/client/src/recoil/states';
import ChatBox from './ChatBox';
import MinimizedChatBox from './MinimizedChatBox';

const Chat = () => {
	const chatBox = useRecoilValue(chatBoxState);
	const minimized = Array.from(chatBox.minimized.values());
	const open = Array.from(chatBox.open.values());
	return (
		<>
			<Stack
				spacing={2}
				sx={{
					position: 'fixed',
					bottom: 10,
					right: 10,
					zIndex: 9999,
				}}
			>
				{minimized.map((user) => (
					<MinimizedChatBox key={'minimized-chat-box-' + user.id} user={user} />
				))}
			</Stack>
			<Stack
				direction='row'
				spacing={1}
				sx={{
					position: 'fixed',
					bottom: 0,
					right: 100,
					zIndex: 9999,
				}}
			>
				{open.map((user) => (
					<ChatBox key={'chat-box-' + user.id} user={user} />
				))}
			</Stack>
		</>
	);
};

export default Chat;
