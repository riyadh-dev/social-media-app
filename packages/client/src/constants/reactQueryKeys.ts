const queryKeys = {
	friends: (friendsOfId?: string) => ['users', 'friends', friendsOfId],
	friendsIds: 'friends-Ids',
	receivedFriendRequests: ['friend-requests', 'received'],
	sentFriendRequests: ['friend-requests', 'sent'],
	activeFriends: ['users', 'friends', 'active'],
	conversation: (targetId?: string) => ['conversation', targetId],
	post: (postId?: string) => ['post', postId],
	user: (userId?: string) => ['user', userId],
	timeline: (userId?: string) => ['posts', 'timeline', userId],
	postComments: (postId?: string) => ['post-comments', postId],
	friendRequestReceivers: ['users', 'friend-request-receiver'],
	friendRequesters: ['users', 'friend-requesters'],
	searchUsers: (searchTerm?: string) => ['users', 'search', searchTerm],
};

export default queryKeys;
