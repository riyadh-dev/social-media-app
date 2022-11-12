import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import queryKeys from '../constants/reactQueryKeys';
import { getConversationQuery } from '../queries/messages';
import { currentUserState } from '../recoil/states';

const useGetConversation = (friendId: string | undefined) => {
	const currentUserId = useRecoilValue(currentUserState)?.id;
	const conversationMembers =
		friendId && currentUserId ? [friendId, currentUserId] : [];

	return useQuery(
		[queryKeys.conversation, friendId],
		() => getConversationQuery(conversationMembers),
		{ enabled: Boolean(friendId && currentUserId) }
	);
};

export default useGetConversation;
