import { IChatMessage, TChatMessageInput } from '@social-media-app/shared';
import { axiosInstance } from '../services/axios';

export const sendChatMessagesQuery = async (
	chatMessageInput: TChatMessageInput
): Promise<unknown> => {
	const { data } = await axiosInstance.post('/messages', chatMessageInput, {
		withCredentials: true,
	});
	return data;
};

export const getConversationQuery = async (
	conversationMembers: string[]
): Promise<IChatMessage[]> => {
	if (conversationMembers.length <= 0)
		Promise.reject(new Error('Invalid body'));

	const { data } = await axiosInstance.post(
		'/messages/conversation',
		conversationMembers,
		{ withCredentials: true }
	);

	return data;
};
