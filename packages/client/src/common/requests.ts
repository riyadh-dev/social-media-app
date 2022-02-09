import axios from 'axios';
import { ILoginInput } from './interfaces';

const server_domain = 'http://localhost:4000/api';

export const loginReq = async (user: ILoginInput) => {
	const { data } = await axios.post(`${server_domain}/users/login`, user, {
		withCredentials: true,
	});
	return data;
};
