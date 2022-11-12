import {
	IChatMessage,
	IChatMessageAction,
	IChatMessageTypingAction,
	IUserConnectionAction,
	TWebSocketAction,
} from '@social-media-app/shared/src';
import { useEffect } from 'react';
import {
	SetterOrUpdater,
	useRecoilState,
	useRecoilValue,
	useSetRecoilState,
} from 'recoil';
import { queryClient } from '..';
import { WS_ORIGIN } from '../constants/envVars';
import queryKeys from '../constants/reactQueryKeys';
import {
	currentUserState,
	typingIndicatorMapState,
	webSocketState,
} from '../recoil/atoms';

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
			const action: TWebSocketAction = JSON.parse(e.data);
			switch (action.type) {
				case 'chat-message':
					handleChatMessageAction(setTypingIndicatorMap, action);
					break;

				case 'chat-typing-started':
					handleTypingNotificationAction(setTypingIndicatorMap, action);
					break;

				case 'chat-typing-stopped':
					handleTypingNotificationAction(setTypingIndicatorMap, action);
					break;

				case 'user-connected':
					handleUserConnectionAction(action);
					break;

				case 'user-disconnected':
					handleUserConnectionAction(action);
					break;

				default:
					console.log(action);
					break;
			}
		};
	};

	useEffect(openSocketEffectCallback, [currentUser, setSocket, socket]);
	useEffect(onOpenEffectCallback, [socket]);
	useEffect(onCloseEffectCallback, [setSocket, socket]);
	useEffect(onMessageEffectCallback, [setTypingIndicatorMap, socket]);
};

const handleUserConnectionAction = async (action: IUserConnectionAction) => {
	await queryClient.cancelQueries(queryKeys.activeFriends);

	if (action.type === 'user-connected')
		queryClient.setQueryData<string[] | undefined>(
			queryKeys.activeFriends,
			(activeFriends) => activeFriends?.concat(action.payload.userId)
		);
	else
		queryClient.setQueryData<string[] | undefined>(
			queryKeys.activeFriends,
			(activeFriends) =>
				activeFriends?.filter((friendId) => friendId !== action.payload.userId)
		);
};

const handleTypingNotificationAction = (
	setTypingIndicatorMap: SetterOrUpdater<Map<string, boolean>>,
	action: IChatMessageTypingAction
) =>
	setTypingIndicatorMap((prev) =>
		new Map(prev).set(
			action.payload.userId,
			action.type === 'chat-typing-started'
		)
	);

const handleChatMessageAction = (
	setTypingIndicatorMap: SetterOrUpdater<Map<string, boolean>>,
	action: IChatMessageAction
) => {
	setTypingIndicatorMap((prev) =>
		new Map(prev).set(action.payload.senderId, false)
	);

	setTimeout(async () => {
		await queryClient.cancelQueries(queryKeys.conversation);
		queryClient.setQueryData<IChatMessage[] | undefined>(
			[queryKeys.conversation, action.payload.senderId],
			(old) => old?.concat(action.payload)
		);
	}, 150);
};