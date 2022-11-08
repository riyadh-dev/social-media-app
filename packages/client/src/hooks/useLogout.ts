import { logoutQuery } from '../queries/users';

const useLogout = () => {
	const logout = () => {
		logoutQuery();
		localStorage.clear();
		window.location.reload();
	};

	return logout;
};

export default useLogout;
