import { faker } from '@faker-js/faker';
import { IPost } from '@social-media-app/shared';
import chalk from 'chalk';
import { TUserDocument } from '../common/types';
import PostModel from '../DATA_SOURCES/POST/model';

//TODO add comments likes and dislikes
const genPosts = async (usersDocs: TUserDocument[], postsNumber: number) => {
	console.log(chalk.yellow('Creating Posts...'));

	const promises: Promise<unknown>[] = [];

	usersDocs.forEach((userDoc) => {
		for (let index = 0; index < postsNumber; index++) {
			const post: Omit<IPost, 'id' | 'updatedAt'> = {
				author: {
					id: userDoc.id,
					avatar: userDoc.avatar,
					userName: userDoc.userName,
				},
				description: faker.commerce.productDescription(),
				img:
					faker.image.nature() +
					'?random=' +
					Math.floor(Math.random() * 100000),
				dislikes: [],
				likes: [],
				comments: [],
				createdAt: faker.date.recent(365 * 3),
			};

			promises.push(PostModel.create(post));
		}
	});

	await Promise.all(promises);
};

export default genPosts;
