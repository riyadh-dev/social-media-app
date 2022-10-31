import { faker } from '@faker-js/faker';
import chalk from 'chalk';
import UsersModel from '../DATA_SOURCES/USER/model';
import { TSignUpInput } from '../DATA_SOURCES/USER/types';

const getMail = (idx: number) => {
	if (idx === 0) return 'test1@gmail.com';
	else if (idx === 1) return 'test2@gmail.com';
	return faker.internet.email();
};

const genUsers = async (usersNumber: number) => {
	console.log(chalk.yellow('Creating Users...'));
	const users: TSignUpInput[] = [];
	for (let idx = 0; idx < usersNumber; idx++) {
		users.push({
			email: getMail(idx),
			password: 'password',
			userName: faker.internet.userName(),
			avatar: faker.internet.avatar(),
		});
	}

	return await UsersModel.create(users);
};

export default genUsers;
