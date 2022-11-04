import { faker } from '@faker-js/faker';
import { IChatMessage } from '@social-media-app/shared';
import chalk from 'chalk';
import { TUserDocument } from '../common/types';
import MessagesModel from '../DATA_SOURCES/MESSAGES/model';

const addFriendsAndGenMsgs = async (
	users: TUserDocument[],
	messagesNumber: number
) => {
	console.log(chalk.yellow('Adding Friends...'));

	const randIdx = () => Math.round(Math.random() * (users.length - 1));

	const messages: Omit<IChatMessage, 'id' | 'updatedAt' | 'createdAt'>[] = [];
	const promises: Promise<unknown>[] = [];
	const usersMap = new Map<string, TUserDocument>();

	users.forEach((user) => usersMap.set(user.id, user));
	usersMap.forEach((user, userId) => {
		//befriend 50% of users
		for (let index = 0; user.friends.length < users.length * 0.5; index++) {
			//friend the first two users
			let friendId = users[index ? 1 : randIdx()]._id.toString();
			while (friendId === userId || user.friends.indexOf(friendId) !== -1)
				friendId = users[randIdx()]._id.toString();

			const friend = usersMap.get(friendId);
			user.friends.push(friendId);
			friend?.friends.push(userId);

			for (let index = 0; index < messagesNumber; index++) {
				const isEven = index % 2 === 0;
				messages.push({
					targetId: isEven ? userId : friendId,
					senderId: isEven ? friendId : userId,
					text: faker.lorem.sentence(3),
					status: 'sent',
				});
			}
		}
		promises.push(user.save());
	});

	promises.push(MessagesModel.create(messages));
	await Promise.all(promises);
};

export default addFriendsAndGenMsgs;