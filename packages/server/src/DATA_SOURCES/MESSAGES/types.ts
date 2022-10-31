import { IChatMessage } from '@social-media-app/shared/src';

export type TMessageInput = Pick<
	IChatMessage,
	'targetId' | 'text' | 'senderId'
>;
