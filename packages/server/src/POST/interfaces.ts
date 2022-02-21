export interface IPost {
	_id: string;
	author: {
		id: string;
		username: string;
		profilePicture: string;
	};
	description: string;
	img: string;
	likes: string[];
	dislikes: string[];
	createdAt: string;
	updatedAt: string;
}
