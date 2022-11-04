import { IUser } from '@social-media-app/shared';
import bcrypt from 'bcryptjs';
import { model, Schema } from 'mongoose';

const UserSchema = new Schema<IUser>(
	{
		email: { type: String, unique: true },
		userName: { type: String, unique: true },
		password: String,
		avatar: String,
		friends: [String],
		likedPosts: [String],
		dislikedPosts: [String],
		isAdmin: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

UserSchema.pre('save', function (next) {
	if (!this.isModified('password')) return next();
	const salt = bcrypt.genSaltSync(10);
	this.password = bcrypt.hashSync(this.password, salt);
	next();
});

export default model('User', UserSchema);