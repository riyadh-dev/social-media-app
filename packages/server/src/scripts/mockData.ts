import { faker } from '@faker-js/faker';
import { Document, Types } from 'mongoose';
import { TPostDB } from 'src/DATA_SOURCES/POST/types';
import { clearDB, connectDB } from '../config/db';
import PostModel from '../DATA_SOURCES/POST/model';
import UserModel from '../DATA_SOURCES/USER/model';
import { TUserDB } from '../DATA_SOURCES/USER/types';

//gen users
const genUser = async (usersNumber: number) => {
	const createUsersPromises: Promise<
		Document<unknown, unknown, TUserDB> &
			TUserDB & {
				_id: Types.ObjectId;
			}
	>[] = [];
	for (let index = 0; index < usersNumber; index++) {
		const user: TUserDB = {
			username: 'user' + index, //faker.name.firstName(),
			password: 'password',
			isAdmin: faker.datatype.boolean(),
			profilePicture:
				faker.image.people() + '?random=' + Math.floor(Math.random() * 100000),
			dislikedPosts: [],
			followers: [],
			followings: [],
			likedPosts: [],
		};

		createUsersPromises.push(UserModel.create(user));
	}

	return await Promise.all(createUsersPromises);
};

const genPosts = async (postsNumber: number, usersNumber: number) => {
	const createPostsPromises: Promise<Document<unknown, unknown, TUserDB>>[] =
		[];
	const usersDocs = await genUser(usersNumber);

	usersDocs.forEach((userDoc) => {
		for (let index = 0; index < postsNumber; index++) {
			const post: TPostDB = {
				author: {
					id: userDoc.id,
					profilePicture: userDoc.profilePicture,
					username: userDoc.username,
				},
				description: faker.commerce.productDescription(),
				img:
					faker.image.nature() +
					'?random=' +
					Math.floor(Math.random() * 100000),
				dislikes: [],
				likes: [],
				comments: [],
			};

			createPostsPromises.push(PostModel.create(post));
		}
	});

	const followPromises = usersDocs.map((userDoc) => {
		const idx1 = faker.datatype.number(usersDocs.length - 1);
		const idx2 = faker.datatype.number(usersDocs.length - 1);
		const idx3 = faker.datatype.number(usersDocs.length - 1);

		userDoc.followings.push(
			usersDocs[idx1]._id.toString(),
			usersDocs[idx2]._id.toString(),
			usersDocs[idx3]._id.toString()
		);

		return userDoc.save();
	});

	return await Promise.all([...createPostsPromises, ...followPromises]);
};

const main = async () => {
	await connectDB();
	await clearDB();
	await genPosts(15, 5);
	console.log('DONE !!');
	process.exit(0);
};

main();
