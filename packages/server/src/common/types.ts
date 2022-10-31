import { IUser } from '@social-media-app/shared/src';
import { Document, Types } from 'mongoose';

export type TUserDocument = Document<unknown, unknown, IUser> &
	IUser & {
		_id: Types.ObjectId;
	};
