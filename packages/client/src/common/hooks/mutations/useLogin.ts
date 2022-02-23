import axios from 'axios';
import { useMutation } from 'react-query';
import { ICurrentUser, ILoginInput } from '../../interfaces';

const server_domain = 'http://localhost:4000/api';

const login = async (user: ILoginInput): Promise<ICurrentUser> => {
	const { data } = await axios.post(`${server_domain}/users/login`, user, {
		withCredentials: true,
	});
	return data;
};

const useLikePost = () => useMutation(login);

export default useLikePost;
