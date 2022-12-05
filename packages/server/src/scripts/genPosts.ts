import { faker } from '@faker-js/faker';
import { IPost, IPostComment } from '@social-media-app/shared';
import chalk from 'chalk';
import { TUserDocument } from '../common/types';
import PostModel from '../DATA_SOURCES/POST/model';
import PostCommentModel from '../DATA_SOURCES/POST_COMMENT/model';

const COMMENTS_PER_POST = 15;

const genPosts = async (usersDocs: TUserDocument[], postsNumber: number) => {
	console.log(chalk.yellow('Creating Comments...'));
	const commentBodies: Omit<IPostComment, 'id'>[] = [];
	usersDocs.forEach((author) => {
		for (let index = 0; index < COMMENTS_PER_POST; index++) {
			commentBodies.push({
				author: {
					id: author.id,
					userName: author.userName,
					avatar: author.avatar,
				},
				dislikes: [],
				likes: [],
				text: faker.lorem.sentence(),
				createdAt: faker.date.between('2015', '2022'),
				updatedAt: faker.date.between('2015', '2022'),
			});
		}
	});

	const postCommentIds = (await PostCommentModel.create(commentBodies)).map(
		(comment) => comment.id
	);

	console.log(chalk.yellow('Creating Posts...'));
	const postBodies: Omit<IPost, 'id'>[] = [];
	usersDocs.forEach((author) => {
		let cursor = 0;
		for (let index = 0; index < postsNumber; index++) {
			postBodies.push({
				author: {
					id: author.id,
					avatar: author.avatar,
					userName: author.userName,
				},
				description: faker.lorem.paragraphs(
					faker.datatype.number({ min: 1, max: 9 })
				),
				img: faker.image.business(640, 480, true),
				dislikes: [],
				likes: [],
				comments: postCommentIds.slice(cursor, cursor + COMMENTS_PER_POST),
				createdAt: faker.date.between('2015', '2022'),
				updatedAt: faker.date.between('2015', '2022'),
			});
			cursor += COMMENTS_PER_POST + 1;
		}
	});

	await PostModel.create(postBodies);
};

export default genPosts;
