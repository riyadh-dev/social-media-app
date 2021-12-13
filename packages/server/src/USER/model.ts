import { Schema } from 'mongoose';
import IUser from './interface';

const UserSchema = new Schema<IUser>(
	{
		username: String,
		password: String,
		profilePicture: String,
		followers: Array,
		followees: Array,
		isAdmin: Boolean,
	},
	{ timestamps: true }
);
