import { useMutation } from 'react-query';
import { ILoginInput, TUiUser } from '../../common/interfaces';
import { axiosInstance } from '../../services/axios';

const server_domain = 'http://localhost:4000/api';

const login = async (user: ILoginInput): Promise<TUiUser> => {
	const { data } = await axiosInstance.post(
		`${server_domain}/users/login`,
		user,
		{
			withCredentials: true,
		}
	);
	return data;
};

const useLikePost = () => useMutation(login);

export default useLikePost;
