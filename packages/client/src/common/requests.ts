import axios from 'axios';

const server_domain = 'http://localhost:4000/api';

export interface ILoginInput {
	username: string;
	password: string;
}
export const loginReq = async (user: ILoginInput) => {
	const { data } = await axios.post(`${server_domain}/user/login`, user, {
		withCredentials: true,
	});
	return data;
};
