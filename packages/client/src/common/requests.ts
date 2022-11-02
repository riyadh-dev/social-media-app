import { axiosInstance } from '../services/axios';
import { ICurrentUser, ILoginInput } from './interfaces';

const server_domain = 'http://localhost:4000/api';

export const loginReq = async (user: ILoginInput): Promise<ICurrentUser> => {
	const { data } = await axiosInstance.post(
		`${server_domain}/users/login`,
		user,
		{
			withCredentials: true,
		}
	);
	return data;
};

export const logoutReq = async () => {
	const { data } = await axiosInstance.post(`${server_domain}/users/logout`, {
		withCredentials: true,
	});
	return data;
};
