import { IUser } from '@social-media-app/shared/src';
import { InferType } from 'yup';
import { MapDatesToString } from './utils';
import { signUpValidationSchema } from './validation';

export type TUiUser = Omit<MapDatesToString<IUser>, 'password'>;
export type TCurrentUser = TUiUser & { csrfToken: string };
export type TUiSignUpInput = InferType<typeof signUpValidationSchema>;
