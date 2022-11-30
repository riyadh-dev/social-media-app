import { IUser } from '@social-media-app/shared';
import { InferType } from 'yup';
import { MapDatesToString } from './utils';
import {
	signUpValidationSchema,
	updateUserIntroValidationSchema,
	updateUserProfileValidationSchema,
} from './validation';

export type TUiUser = Omit<MapDatesToString<IUser>, 'password'>;
export type TCurrentUser = TUiUser & { csrfToken: string };
export type TUiSignUpInput = InferType<typeof signUpValidationSchema>;
export type TUiUpdateUserProfileInput = InferType<
	typeof updateUserProfileValidationSchema
>;
export type TUiUpdateUserIntroInput = InferType<
	typeof updateUserIntroValidationSchema
>;
export type TInfinitePostsQueryType = 'liked-posts' | 'timeline-posts';
