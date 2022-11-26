const queryKeys = {
	friends: (friendsOfId?: string) => ['users', 'friends', friendsOfId],
	friendsIds: 'friends-Ids',
	receivedFriendRequests: ['friend-requests', 'received'],
	sentFriendRequests: ['friend-requests', 'sent'],
	activeFriends: ['users', 'friends', 'active'],
	conversation: (targetId?: string) => ['messages', 'conversation', targetId],
	unreadMessages: ['messages', 'unread'],
	post: (postId?: string) => ['post', postId],
	user: (userId?: string) => ['user', userId],
	timeline: (userId?: string) => ['posts', 'timeline', userId],
	likedPosts: (userId?: string) => ['posts', 'liked', userId],
	postComments: (postId?: string) => ['post-comments', postId],
	friendRequestReceivers: ['users', 'friend-request-receiver'],
	friendRequesters: ['users', 'friend-requesters'],
	searchUsers: (searchTerm?: string) => ['users', 'search', searchTerm],
};

export default queryKeys;
