import bcrypt from 'bcryptjs';
import { model, Schema } from 'mongoose';
import { IUserDB } from './interface';

const UserSchema = new Schema<IUserDB>(
	{
		username: { type: String, unique: true },
		password: String,
		profilePicture: String,
		followers: Array,
		followees: Array,
		isAdmin: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

UserSchema.pre<IUserDB>('save', function (next) {
	const salt = bcrypt.genSaltSync(10);
	this.password = bcrypt.hashSync(this.password, salt);
	next();
});

export default model('User', UserSchema);
