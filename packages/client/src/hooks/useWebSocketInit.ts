import { IChatMessage, TWebSocketAction } from '@social-media-app/shared/src';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { queryClient } from '..';
import { WS_ORIGIN } from '../constants/envVars';
import queryKeys from '../constants/reactQueryKeys';
import {
	currentUserState,
	typingIndicatorMapState,
	webSocketState,
} from '../recoil/states';

export const useWebSocketInit = () => {
	const [socket, setSocket] = useRecoilState(webSocketState);
	const setTypingIndicatorMap = useSetRecoilState(typingIndicatorMapState);
	const currentUser = useRecoilValue(currentUserState);

	const openSocketEffectCallback = () => {
		if (!currentUser || socket) return;
		setSocket(new WebSocket(WS_ORIGIN));
	};

	const onOpenEffectCallback = () => {
		if (!socket) return;
		socket.onopen = () => console.log('WebSocket Connected');
	};

	const onCloseEffectCallback = () => {
		if (!socket) return;
		socket.onclose = () => {
			console.log('WebSocket Closed');
			setTimeout(() => setSocket(new WebSocket(WS_ORIGIN)), 5000);
		};
	};

	const onMessageEffectCallback = () => {
		if (!socket) return;
		socket.onmessage = (e) => {
			const message: TWebSocketAction = JSON.parse(e.data);
			switch (message.type) {
				case 'chat-message':
					setTypingIndicatorMap((prev) =>
						new Map(prev).set(message.payload.senderId, false)
					);
					setTimeout(() => chatMessageHandler(message.payload), 200);
					break;

				case 'chat-typing-started':
					setTypingIndicatorMap((prev) =>
						new Map(prev).set(message.payload.userId, true)
					);
					break;

				case 'chat-typing-stopped':
					setTypingIndicatorMap((prev) =>
						new Map(prev).set(message.payload.userId, false)
					);
					break;

				default:
					console.log(message);
					break;
			}
		};
	};

	useEffect(openSocketEffectCallback, [currentUser, setSocket, socket]);
	useEffect(onOpenEffectCallback, [socket]);
	useEffect(onCloseEffectCallback, [setSocket, socket]);
	useEffect(onMessageEffectCallback, [setTypingIndicatorMap, socket]);
};

const chatMessageHandler = async (chatMessage: IChatMessage) => {
	await queryClient.cancelQueries(queryKeys.conversation);
	queryClient.setQueryData<IChatMessage[] | undefined>(
		[queryKeys.conversation, chatMessage.senderId],
		(old) => old?.concat(chatMessage)
	);
};
