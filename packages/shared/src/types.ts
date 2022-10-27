import { IChatMessageAction, IChatMessageTypingAction } from './interfaces';

export type TChatMessageStatus = 'pending' | 'sent' | 'received' | 'viewed';
export type TFriendRequestStatus = 'pending' | 'accepted' | 'rejected';
export type TWebSocketAction = IChatMessageAction | IChatMessageTypingAction;
