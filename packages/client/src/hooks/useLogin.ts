import { yupResolver } from '@hookform/resolvers/yup';
import { TLoginInput } from '@social-media-app/shared';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { TCurrentUser } from '../common/types';
import { loginValidationSchema } from '../common/validation';
import { loginQuery } from '../queries/users';
import { currentUserState } from '../recoil/states';
import { axiosInstance } from '../services/axios';

const useLogin = () => {
	const useFormReturn = useForm<TLoginInput>({
		resolver: yupResolver(loginValidationSchema),
	});
	const useMutationResult = useMutation<TCurrentUser, AxiosError, TLoginInput>(
		loginQuery
	);

	const onSubmit = useFormReturn.handleSubmit((loginInput) =>
		useMutationResult.mutate(loginInput)
	);

	const setCurrentUser = useSetRecoilState(currentUserState);
	const navigate = useNavigate();
	const from = useLocation().state?.from?.pathname ?? '/';

	const { data, isSuccess } = useMutationResult;
	useEffect(() => {
		if (isSuccess) {
			setCurrentUser(data);
			axiosInstance.defaults.headers.common['csrf-token'] = data.csrfToken;
			navigate(from, { replace: true });
		}
	}, [data, from, isSuccess, navigate, setCurrentUser]);

	return { useFormReturn, useMutationResult, onSubmit };
};

export default useLogin;
