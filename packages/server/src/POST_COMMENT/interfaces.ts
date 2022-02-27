export interface IPostComment {
	_id: string;
	author: {
		id: string;
		username: string;
		profilePicture: string;
	};
	text: string;
	likes: string[];
	dislikes: string[];
	comments: string[];

	createdAt: string;
	updatedAt: string;
}
