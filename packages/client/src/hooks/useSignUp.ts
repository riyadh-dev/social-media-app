import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { TUiSignUpInput } from '../common/types';
import { signUpValidationSchema } from '../common/validation';
import { signUp } from '../queries/users';

const useSignUp = () => {
	const useFormReturn = useForm<TUiSignUpInput>({
		resolver: yupResolver(signUpValidationSchema),
	});
	const useMutationReturn = useMutation<
		unknown,
		//TODO move type def elsewhere
		AxiosError<{ userName?: string; email?: string }>,
		TUiSignUpInput
	>(signUp);

	useEffect(() => {
		if (useMutationReturn.isSuccess) useFormReturn.reset();
	}, [useFormReturn, useMutationReturn.isSuccess]);

	const onSubmit = useFormReturn.handleSubmit((signUpInput) =>
		useMutationReturn.mutate(signUpInput)
	);

	return { useFormReturn, useMutationReturn, onSubmit };
};

export default useSignUp;
