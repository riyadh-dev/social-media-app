import { yupResolver } from '@hookform/resolvers/yup';
import { IChatMessage } from '@social-media-app/shared/src';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useRecoilValue } from 'recoil';
import { queryClient } from '..';
import { chatMessageSchema } from '../common/validation';
import queryKeys from '../constants/reactQueryKeys';
import { sendChatMessagesQuery } from '../queries/messages';
import { currentUserState } from '../recoil/atoms';

const useSendMessage = (targetId: string) => {
	const useMutationResult = useMutation(sendChatMessagesQuery, {
		// When mutate is called:

		onMutate: async (newMessage) => {
			const queryKey = [queryKeys.conversation, newMessage.targetId];
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)

			await queryClient.cancelQueries(queryKey);

			// Snapshot the previous value

			const previousConversation =
				queryClient.getQueryData<IChatMessage[]>(queryKey);

			// Optimistically update to the new value

			const date = new Date();
			queryClient.setQueryData<IChatMessage[] | undefined>(queryKey, (old) =>
				old?.concat({
					...newMessage,
					id: Math.random().toString(),
					status: 'pending',
					createdAt: date,
					updatedAt: date,
				})
			);

			// Return a context object with the snapshot value

			return { previousConversation };
		},

		// If the mutation fails, use the context returned from onMutate to roll back

		onError: (err, newMessage, context) => {
			queryClient.setQueryData(
				[queryKeys.conversation, newMessage.targetId],
				context?.previousConversation
			);
		},

		// Always refetch after error or success:

		onSettled: (data, err, newMessage) => {
			queryClient.invalidateQueries([
				queryKeys.conversation,
				newMessage.targetId,
			]);
		},
	});

	const sender = useRecoilValue(currentUserState);
	const { register, handleSubmit, reset } = useForm({
		resolver: yupResolver(chatMessageSchema),
	});

	const onSubmit = handleSubmit(({ text }) => {
		useMutationResult.mutate({
			senderId: sender?.id ?? '',
			targetId: targetId,
			text,
		});
		reset();
	});

	return { register, onSubmit };
};

export default useSendMessage;