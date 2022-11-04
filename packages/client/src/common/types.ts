import { IUser, TSignUpInput } from '@social-media-app/shared/src';
import { MapDatesToString } from './utils';

export type TUiUser = Omit<MapDatesToString<IUser>, 'password'>;
export type TUiSignUpInput = TSignUpInput & {
	confirmEmail: string;
	confirmPassword: string;
};
